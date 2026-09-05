"use client";

import { useState } from "react";
import { TlSection } from "./tl-section";
import { TimelineList } from "./timeline-list";
import type { DayPlanContent } from "@/lib/invitation/types";

export function TimelineDayPlan({ content }: { content: DayPlanContent }) {
  const [day, setDay] = useState(0);
  const active = content.days[day] ?? content.days[0];
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="day-tabs">
        {content.days.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`day-tab${day === i ? " active" : ""}`}
            onClick={() => setDay(i)}
          >
            {d.label}
            <span className="en">{d.en}</span>
          </button>
        ))}
      </div>
      <TimelineList items={active.items} />
    </TlSection>
  );
}
