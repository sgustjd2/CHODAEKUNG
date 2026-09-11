"use client";

import { useState } from "react";
import { CCard } from "./c-card";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { Icon } from "@/components/ui/icon";
import { openRsvpModal } from "@/lib/invitation/rsvp-open";
import type { RsvpContent } from "@/lib/invitation/types";

export function CuteRsvp({ content }: { content: RsvpContent }) {
  const [sel, setSel] = useState(content.defaultSelected ?? 0);
  return (
    <CCard eb={content.eyebrow} title={content.title} tint>
      {content.body && (
        <div className="c-body">
          <Editable path="body" multiline><Rich lines={content.body} /></Editable>
        </div>
      )}
      <div className="c-rsvp-btns">
        {content.options.map((o, i) => (
          <button
            type="button"
            key={i}
            className={`c-rsvp-btn${sel === i ? " selected" : ""}`}
            aria-pressed={sel === i}
            onClick={() => { setSel(i); openRsvpModal(o); }}
          >
            {i === 0 && <Icon name="ic-heart-fill" className="c-heart-sm" width={14} height={14} />}
            {o}
          </button>
        ))}
      </div>
    </CCard>
  );
}
