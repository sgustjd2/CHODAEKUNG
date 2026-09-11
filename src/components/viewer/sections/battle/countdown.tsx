"use client";

import type { CountdownContent } from "@/lib/invitation/types";
import { Editable } from "../../editable";
import { useCountdown } from "../../use-countdown";

export function BattleCountdown({ content, target }: { content: CountdownContent; target?: string }) {
  // Live numbers when the invitation has a valid event datetime; else the template's static cells.
  const live = useCountdown(target);
  const nums = live ? [live.d, live.h, live.m, live.s] : null;
  return (
    <div className="ivb-countdown">
      <div className="ivb-cd-lbl"><Editable path="label">{content.label}</Editable></div>
      <div className="ivb-cd-time">
        {content.cells.map((c, i) => (
          <div className={`ivb-cd-cell${c.warn ? " warn" : ""}`} key={i}>
            <div className="n">{nums && i < 4 ? (i === 0 ? String(nums[i]) : String(nums[i]).padStart(2, "0")) : c.n}</div>
            <div className="l"><Editable path={`cells.${i}.l`}>{c.l}</Editable></div>
          </div>
        ))}
      </div>
    </div>
  );
}
