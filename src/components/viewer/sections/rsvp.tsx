"use client";

import { useState } from "react";
import { Rich } from "../rich-text";
import { Editable } from "../editable";
import type { RsvpContent } from "@/lib/invitation/types";

export function RsvpSection({ content }: { content: RsvpContent }) {
  const [selected, setSelected] = useState(content.defaultSelected ?? -1);
  return (
    <div className={`iv-section${content.tint ? " iv-tint" : ""}`}>
      <div className="iv-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>
      <div className="iv-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div className="iv-body">
        <Editable path="body" multiline><Rich lines={content.body} /></Editable>
      </div>
      <div className="iv-rsvp-buttons">
        {content.options.map((o, i) => (
          <button
            key={o}
            type="button"
            className={`iv-rsvp-btn${selected === i ? " selected" : ""}`}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
