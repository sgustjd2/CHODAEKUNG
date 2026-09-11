"use client";

import { useState } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { openRsvpModal } from "@/lib/invitation/rsvp-open";
import type { AcceptContent } from "@/lib/invitation/types";

export function BattleAccept({ content }: { content: AcceptContent }) {
  const [selected, setSelected] = useState<"accept" | "decline" | null>(null);
  return (
    <div className="ivb-accept">
      <div className="ivb-accept-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div className="ivb-accept-sub"><Editable path="sub">{content.sub}</Editable></div>
      <div className="ivb-accept-btns">
        <button
          type="button"
          className={`ivb-accept-btn accept${selected === "accept" ? " on" : ""}`}
          aria-pressed={selected === "accept"}
          onClick={() => { setSelected("accept"); openRsvpModal(content.accept); }}
        >
          {content.accept}
        </button>
        <button
          type="button"
          className={`ivb-accept-btn decline${selected === "decline" ? " on" : ""}`}
          aria-pressed={selected === "decline"}
          onClick={() => { setSelected("decline"); openRsvpModal(content.decline); }}
        >
          {content.decline}
        </button>
      </div>
    </div>
  );
}
