"use client";

import { useState } from "react";
import { TlSection } from "./tl-section";
import { TimelineList } from "./timeline-list";
import type { DayPlanContent } from "@/lib/invitation/types";

export function TimelineDayPlan({ content }: { content: DayPlanContent }) {
  const [day, setDay] = useState(0);
  // A freshly added section (blank shell) or one whose days were all deleted has `days: []` — render the
  // header without a list instead of throwing (which took the whole invitation down via the error
  // boundary). Resolve the index once so the edit path targets the day actually shown.
  const idx = content.days[day] ? day : 0;
  const active = content.days[idx];
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="day-tabs">
        {content.days.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`day-tab${idx === i ? " active" : ""}`}
            onClick={() => setDay(i)}
          >
            {d.label}
            <span className="en">{d.en}</span>
          </button>
        ))}
      </div>
      {active && <TimelineList items={active.items} pathBase={`days.${idx}.items`} />}
    </TlSection>
  );
}
