import type { ReactNode } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { Line } from "@/lib/invitation/types";

type EbVariant = "rose" | "sage" | "lav" | "butter";

/** Cute rounded card: colored eyebrow pill + heading + body. */
export function CCard({
  eb,
  ebVariant = "rose",
  title,
  tint,
  children,
}: {
  eb: string;
  ebVariant?: EbVariant;
  title: Line[];
  tint?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`c-card${tint ? " c-card-tint" : ""}`}>
      <div className={`c-eb${ebVariant === "rose" ? "" : ` ${ebVariant}`}`}><Editable path="eyebrow">{eb}</Editable></div>
      <div className="c-title">
        <Editable path="title" multiline><Rich lines={title} /></Editable>
      </div>
      {children}
    </div>
  );
}
