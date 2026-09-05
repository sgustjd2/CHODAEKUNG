import { Rich } from "../../rich-text";
import { MinimalHead } from "./section-head";
import type { ScheduleContent } from "@/lib/invitation/types";

export function MinimalSchedule({ content, index }: { content: ScheduleContent; index?: number }) {
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Rich lines={content.title} />
      </div>
      <div style={{ marginTop: 32 }}>
        {content.items.map((it, i) => (
          <div className="ivm-sch-item" key={i}>
            <div className="time">{it.time}</div>
            <div className="desc">
              {it.title}
              <span className="d">{it.desc}</span>
            </div>
            <div className="dur">{it.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
