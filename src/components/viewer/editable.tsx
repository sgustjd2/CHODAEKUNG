"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/** Provided by the editor preview only. The public viewer never sets this, so <Editable> renders
 * plain text there (no contentEditable, no handlers) — editing stays an editor concern (§7.2). */
export type EditCtx = { secId: string; onEdit: (secId: string, path: string, value: string) => void };
export const EditContext = createContext<EditCtx | null>(null);

/**
 * Inline-editable text. In the editor preview it's contentEditable and commits to the draft on blur
 * (Enter also commits); everywhere else it's just its children. `path` is the field within the
 * section's content, e.g. "dateLabel", "eyebrow", "names.0".
 */
export function Editable({ path, children }: { path: string; children: ReactNode }) {
  const ctx = useContext(EditContext);
  if (!ctx) return <>{children}</>;
  return (
    <span
      className="iv-editable"
      data-edit={path}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => ctx.onEdit(ctx.secId, path, e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {children}
    </span>
  );
}
