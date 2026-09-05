"use client";

import { useState } from "react";
import { Rich } from "../../rich-text";
import type { AcceptContent } from "@/lib/invitation/types";

export function BattleAccept({ content }: { content: AcceptContent }) {
  const [selected, setSelected] = useState<"accept" | "decline" | null>(null);
  return (
    <div className="ivb-accept">
      <div className="ivb-accept-title">
        <Rich lines={content.title} />
      </div>
      <div className="ivb-accept-sub">{content.sub}</div>
      <div className="ivb-accept-btns">
        <button
          type="button"
          className={`ivb-accept-btn accept${selected === "accept" ? " on" : ""}`}
          aria-pressed={selected === "accept"}
          onClick={() => setSelected("accept")}
        >
          {content.accept}
        </button>
        <button
          type="button"
          className={`ivb-accept-btn decline${selected === "decline" ? " on" : ""}`}
          aria-pressed={selected === "decline"}
          onClick={() => setSelected("decline")}
        >
          {content.decline}
        </button>
      </div>
    </div>
  );
}
