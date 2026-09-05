import type { ReactNode } from "react";

/** Terminal section: "# name" head with an optional status badge, then output. */
export function DSection({ name, badge, children }: { name: string; badge?: string; children?: ReactNode }) {
  return (
    <div className="d-section">
      <div className="d-sec-head">
        {name}
        {badge && <span className="badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}
