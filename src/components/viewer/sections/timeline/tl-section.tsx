import type { ReactNode } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { Line } from "@/lib/invitation/types";

/** Timeline section shell: eyebrow bar + heading + body, optional paper tint. */
export function TlSection({
  eyebrow,
  title,
  tint,
  children,
}: {
  eyebrow: string;
  title: Line[];
  tint?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`tl-section${tint ? " tl-tint" : ""}`}>
      <div className="tl-section-eb"><Editable path="eyebrow">{eyebrow}</Editable></div>
      <h2>
        <Editable path="title" multiline><Rich lines={title} /></Editable>
      </h2>
      {children}
    </div>
  );
}
