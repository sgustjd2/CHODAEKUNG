"use client";

import { useState } from "react";
import { Rich } from "../../rich-text";
import { MinimalHead } from "./section-head";
import type { RsvpContent } from "@/lib/invitation/types";

export function MinimalRsvp({ content, index }: { content: RsvpContent; index?: number }) {
  const [selected, setSelected] = useState(content.defaultSelected ?? -1);
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Rich lines={content.title} />
      </div>
      <p className="ivm-body">
        <Rich lines={content.body} />
      </p>
      <div className="ivm-rsvp-blocks">
        {content.options.map((o, i) => (
          <button
            key={o}
            type="button"
            className={`ivm-rsvp-block${selected === i ? " selected" : ""}`}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {content.optionSubs?.[i] && <div className="lbl">{content.optionSubs[i]}</div>}
            <div className="val">{o}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
