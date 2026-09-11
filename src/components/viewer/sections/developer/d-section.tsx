import type { ReactNode } from "react";
import { Editable } from "../../editable";

/** Terminal section: "# name" head with an optional status badge, then output.
 * `name` is the section's content.eyebrow (all callers pass it), so it edits at path "eyebrow". */
export function DSection({ name, badge, children }: { name: string; badge?: string; children?: ReactNode }) {
  return (
    <div className="d-section">
      <div className="d-sec-head">
        <Editable path="eyebrow">{name}</Editable>
        {badge && <span className="badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}
