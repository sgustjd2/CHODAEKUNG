"use client";

import { useState } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { MinimalHead } from "./section-head";
import { openRsvpModal } from "@/lib/invitation/rsvp-open";
import type { RsvpContent } from "@/lib/invitation/types";

export function MinimalRsvp({ content, index }: { content: RsvpContent; index?: number }) {
  const [selected, setSelected] = useState(content.defaultSelected ?? -1);
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <p className="ivm-body">
        <Editable path="body" multiline><Rich lines={content.body} /></Editable>
      </p>
      <div className="ivm-rsvp-blocks">
        {content.options.map((o, i) => (
          <button
            key={o}
            type="button"
            className={`ivm-rsvp-block${selected === i ? " selected" : ""}`}
            aria-pressed={selected === i}
            onClick={() => { setSelected(i); openRsvpModal(o); }}
          >
            {content.optionSubs?.[i] && <div className="lbl">{content.optionSubs[i]}</div>}
            <div className="val">{o}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
