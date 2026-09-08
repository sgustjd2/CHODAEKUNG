"use client";

import { GSection } from "./g-section";
import type { CountdownContent } from "@/lib/invitation/types";
import { useCountdown } from "../../use-countdown";

export function GamingCountdown({ content, target }: { content: CountdownContent; target?: string }) {
  // Live numbers when the invitation has a valid event datetime; else the template's static cells.
  const live = useCountdown(target);
  const nums = live ? [live.d, live.h, live.m, live.s] : null;
  return (
    <GSection eyebrow={content.eyebrow ?? ""} title={content.title ?? []}>
      <div className="g-countdown">
        {content.cells.map((c, i) => (
          <div className={`g-cd-cell${c.warn ? " warn" : ""}`} key={i}>
            <div className="n">{nums && i < 4 ? (i === 0 ? String(nums[i]) : String(nums[i]).padStart(2, "0")) : c.n}</div>
            <div className="l">{c.l}</div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
