"use client";

import { useState } from "react";
import { Rich } from "../../rich-text";
import type { AcceptContent } from "@/lib/invitation/types";

export function GamingCta({ content }: { content: AcceptContent }) {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  return (
    <div className="g-cta">
      <h3>
        <Rich lines={content.title} />
      </h3>
      <div className="sub">{content.sub}</div>
      <div className="g-cta-btns">
        <button type="button" className={`g-cta-btn yes${selected === "yes" ? " on" : ""}`} aria-pressed={selected === "yes"} onClick={() => setSelected("yes")}>
          {content.accept}
        </button>
        <button type="button" className={`g-cta-btn no${selected === "no" ? " on" : ""}`} aria-pressed={selected === "no"} onClick={() => setSelected("no")}>
          {content.decline}
        </button>
      </div>
    </div>
  );
}
