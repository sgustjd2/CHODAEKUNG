"use client";

import { useState } from "react";
import { ESection } from "./e-section";
import { Rich } from "../../rich-text";
import type { RsvpContent } from "@/lib/invitation/types";

export function EditorialRsvp({ content }: { content: RsvpContent }) {
  const [sel, setSel] = useState(content.defaultSelected ?? 0);
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title}>
      {content.body.length > 0 && (
        <div className="e-body e-rsvp-note">
          <Rich lines={content.body} />
        </div>
      )}
      <div className="e-rsvp-editorial">
        {content.innerTitle && (
          <div className="t">
            <Rich lines={content.innerTitle} />
          </div>
        )}
        <div className="e-rsvp-buttons">
          {content.options.map((o, i) => (
            <button
              type="button"
              key={i}
              className={`e-rsvp-btn${sel === i ? " selected" : ""}`}
              aria-pressed={sel === i}
              onClick={() => setSel(i)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </ESection>
  );
}
