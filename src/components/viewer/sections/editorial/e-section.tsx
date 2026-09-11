import type { ReactNode } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { Line } from "@/lib/invitation/types";

/** Editorial magazine section: big number + label + serif headline, then body. */
export function ESection({
  num,
  label,
  headline,
  tint,
  children,
}: {
  num?: string;
  label: string;
  headline: Line[];
  tint?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`e-section${tint ? " e-section-card" : ""}`}>
      <div className="e-sec-head">
        {num && <div className="e-sec-num"><Editable path="num">{num}</Editable></div>}
        <div className="e-sec-lbl"><Editable path="eyebrow">{label}</Editable></div>
      </div>
      <div className="e-headline">
        <Editable path="title" multiline><Rich lines={headline} /></Editable>
      </div>
      {children}
    </div>
  );
}
