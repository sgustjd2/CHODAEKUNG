"use client";

import { useState } from "react";
import { Rich } from "../../rich-text";
import type { AcceptContent } from "@/lib/invitation/types";

/** Timeline yes/no RSVP CTA (reuses the `accept` content shape). */
export function TimelineCta({ content }: { content: AcceptContent }) {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  return (
    <div className="tl-cta">
      <h3>
        <Rich lines={content.title} />
      </h3>
      <div className="sub">{content.sub}</div>
      <div className="tl-cta-btns">
        <button
          type="button"
          className={`tl-cta-btn yes${selected === "yes" ? " on" : ""}`}
          aria-pressed={selected === "yes"}
          onClick={() => setSelected("yes")}
        >
          {content.accept}
        </button>
        <button
          type="button"
          className={`tl-cta-btn no${selected === "no" ? " on" : ""}`}
          aria-pressed={selected === "no"}
          onClick={() => setSelected("no")}
        >
          {content.decline}
        </button>
      </div>
    </div>
  );
}
