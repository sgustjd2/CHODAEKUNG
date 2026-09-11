"use client";

import { createContext, memo, useContext } from "react";
import type { ReactNode } from "react";
import type { TextStyle } from "@/lib/invitation/types";
import { textStyleCss } from "@/lib/invitation/text-style";
import { getAtPath, flattenText } from "@/lib/invitation/path";

/** Renders children once and never re-renders. Inside a contentEditable this stops React from
 * reconciling inner nodes the user has edited (which otherwise throws removeChild) — the DOM is
 * user-owned after mount; edits are read back on blur. */
const Frozen = memo(function Frozen({ children }: { children: ReactNode }) {
  return <>{children}</>;
}, () => true);

/** Provided by the editor preview only. The public viewer never sets this, so <Editable> renders
 * plain text there (no contentEditable, no handlers) — editing stays an editor concern (§7.2). */
export type EditCtx = {
  secId: string;
  onEdit: (secId: string, path: string, value: string, asLines: boolean) => void;
  /** Focusing an editable selects its section, so the side panel follows the preview. */
  onSelect?: (secId: string) => void;
  /** Focusing an editable also reports which text field it is, so the per-field style controls
   * (inspector panel + floating toolbar) target it. */
  onSelectField?: (secId: string, path: string) => void;
  /** This section's current content, so an Editable can tell whether its field still holds the
   * template example (see `defaultContent`). */
  content?: unknown;
  /** The template's original content for this section (only on a fresh template start). A field
   * whose current value still equals this reads as an untouched "example" — rendered as a gray
   * hint that clears on first tap and is dropped from the published copy. */
  defaultContent?: unknown;
};
export const EditContext = createContext<EditCtx | null>(null);

/** Per-field text-style overrides for the current section, keyed by Editable `path`. Provided by the
 * viewer around each section (in the editor always; on the public page only when styles exist), so
 * <Editable> can apply them in BOTH the editor and the published page. */
export const TextStyleContext = createContext<Record<string, TextStyle> | null>(null);

/** Ghost text for an empty field, by content field name — guides a blank-canvas start
 * ("제목"/"이름"/"날짜" instead of a generic "입력"). Falls back to "입력". */
const PH_LABELS: Record<string, string> = {
  title: "제목",
  titleLines: "제목",
  eyebrow: "문구",
  names: "이름",
  body: "내용",
  subtitle: "부제",
  subtitleLines: "부제",
  dateLabel: "날짜",
  signature: "맺음말",
  note: "안내",
  headerLeft: "머리말",
  headerRight: "머리말",
  headerRightLines: "머리말",
};
const placeholderForPath = (path: string) => PH_LABELS[path.split(".")[0]] ?? "입력";

/**
 * Inline-editable text. In the editor preview it's contentEditable and commits to the draft on blur
 * (Enter also commits); everywhere else it's just its children. `path` is the field within the
 * section's content, e.g. "dateLabel", "eyebrow", "names.0".
 */
export function Editable({
  path,
  multiline,
  placeholder,
  children,
}: {
  path: string;
  multiline?: boolean;
  /** Ghost text shown (via CSS :empty::before) when the field is empty, so a blank field is still clickable. */
  placeholder?: string;
  children: ReactNode;
}) {
  const ctx = useContext(EditContext);
  const styleMap = useContext(TextStyleContext);
  const inlineStyle = textStyleCss(styleMap?.[path]);
  // Public page (no editor context): render a styled span only when this field carries an override,
  // otherwise stay a zero-overhead plain text node (unchanged behavior).
  if (!ctx) return inlineStyle ? <span style={inlineStyle}>{children}</span> : <>{children}</>;
  // "Example" field: on a fresh template start, a field the user/wizard hasn't changed still equals
  // the template default → show it as a gray hint that clears on first focus (so typing replaces it).
  const defText = ctx.defaultContent != null ? flattenText(getAtPath(ctx.defaultContent, path)) : "";
  const isExample = defText !== "" && flattenText(getAtPath(ctx.content, path)) === defText;
  return (
    <span
      className={`iv-editable${isExample ? " iv-example" : ""}`}
      data-edit={path}
      data-ph={placeholder ?? placeholderForPath(path)}
      style={inlineStyle}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      // Focusing an inline field selects its section (side panel follows) and targets it for styling.
      // An untouched example gets fully selected on focus so the first keystroke replaces the hint
      // (and if left untouched it's dropped on publish). Done in rAF so the section-select re-render
      // settles first (mutating the DOM here would fight React's contentEditable reconciliation).
      onFocus={(e) => {
        const el = e.currentTarget;
        ctx.onSelect?.(ctx.secId);
        ctx.onSelectField?.(ctx.secId, path);
        if (isExample)
          setTimeout(() => {
            try {
              const r = document.createRange();
              r.selectNodeContents(el);
              const sel = window.getSelection();
              sel?.removeAllRanges();
              sel?.addRange(r);
            } catch {
              /* selection API unavailable */
            }
          }, 0);
      }}
      // multiline (e.g. titleLines) keeps <br>/line breaks via innerText; single-line uses textContent.
      onBlur={(e) => ctx.onEdit(ctx.secId, path, multiline ? e.currentTarget.innerText : e.currentTarget.textContent ?? "", !!multiline)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {/* Key on the text so a programmatic change (e.g. syncing the cover date from 행사 일시)
          remounts with the new value. During typing `children` is stable (it only commits on blur),
          so the key doesn't change and the user's contentEditable DOM is left untouched. */}
      <Frozen key={typeof children === "string" ? children : undefined}>{children}</Frozen>
    </span>
  );
}
