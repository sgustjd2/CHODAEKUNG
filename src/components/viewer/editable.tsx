"use client";

import { createContext, memo, useContext } from "react";
import type { ReactNode } from "react";

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
};
export const EditContext = createContext<EditCtx | null>(null);

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
  if (!ctx) return <>{children}</>;
  return (
    <span
      className="iv-editable"
      data-edit={path}
      data-ph={placeholder ?? placeholderForPath(path)}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      // Focusing an inline field selects its section so the side panel follows the preview.
      onFocus={() => ctx.onSelect?.(ctx.secId)}
      // multiline (e.g. titleLines) keeps <br>/line breaks via innerText; single-line uses textContent.
      onBlur={(e) => ctx.onEdit(ctx.secId, path, multiline ? e.currentTarget.innerText : e.currentTarget.textContent ?? "", !!multiline)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      <Frozen>{children}</Frozen>
    </span>
  );
}
