"use client";

import { useState } from "react";
import { ESection } from "./e-section";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { openRsvpModal } from "@/lib/invitation/rsvp-open";
import type { RsvpContent } from "@/lib/invitation/types";

export function EditorialRsvp({ content }: { content: RsvpContent }) {
  const [sel, setSel] = useState(content.defaultSelected ?? 0);
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title}>
      {content.body.length > 0 && (
        <div className="e-body e-rsvp-note">
          <Editable path="body" multiline><Rich lines={content.body} /></Editable>
        </div>
      )}
      <div className="e-rsvp-editorial">
        {content.innerTitle && (
          <div className="t">
            <Editable path="innerTitle" multiline><Rich lines={content.innerTitle} /></Editable>
          </div>
        )}
        <div className="e-rsvp-buttons">
          {content.options.map((o, i) => (
            <button
              type="button"
              key={i}
              className={`e-rsvp-btn${sel === i ? " selected" : ""}`}
              aria-pressed={sel === i}
              onClick={() => { setSel(i); openRsvpModal(o); }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </ESection>
  );
}
