import type { ReactNode } from "react";
import { Rich } from "../../rich-text";
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
      <div className={`c-eb${ebVariant === "rose" ? "" : ` ${ebVariant}`}`}>{eb}</div>
      <div className="c-title">
        <Rich lines={title} />
      </div>
      {children}
    </div>
  );
}
