import type { ReactNode } from "react";

/** Battle section eyebrow with the leading accent bar (`.ivb-sec-title`). */
export function BattleSecTitle({ children }: { children: ReactNode }) {
  return <div className="ivb-sec-title">{children}</div>;
}
