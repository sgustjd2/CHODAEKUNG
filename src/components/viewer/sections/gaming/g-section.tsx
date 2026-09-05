import type { ReactNode } from "react";
import { Rich } from "../../rich-text";
import type { Line } from "@/lib/invitation/types";

/** Gaming section shell: neon eyebrow + gradient-accent heading + body. */
export function GSection({ eyebrow, title, children }: { eyebrow: string; title: Line[]; children: ReactNode }) {
  return (
    <div className="g-section">
      <div className="g-sec-eb">{eyebrow}</div>
      <h2>
        <Rich lines={title} />
      </h2>
      {children}
    </div>
  );
}
