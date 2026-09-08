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
export type EditCtx = { secId: string; onEdit: (secId: string, path: string, value: string) => void };
export const EditContext = createContext<EditCtx | null>(null);

/**
 * Inline-editable text. In the editor preview it's contentEditable and commits to the draft on blur
 * (Enter also commits); everywhere else it's just its children. `path` is the field within the
 * section's content, e.g. "dateLabel", "eyebrow", "names.0".
 */
export function Editable({ path, multiline, children }: { path: string; multiline?: boolean; children: ReactNode }) {
  const ctx = useContext(EditContext);
  if (!ctx) return <>{children}</>;
  return (
    <span
      className="iv-editable"
      data-edit={path}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      // multiline (e.g. titleLines) keeps <br>/line breaks via innerText; single-line uses textContent.
      onBlur={(e) => ctx.onEdit(ctx.secId, path, multiline ? e.currentTarget.innerText : e.currentTarget.textContent ?? "")}
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
