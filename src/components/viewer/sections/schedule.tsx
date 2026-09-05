import { Rich } from "../rich-text";
import type { ScheduleContent } from "@/lib/invitation/types";

export function ScheduleSection({ content }: { content: ScheduleContent }) {
  return (
    <div className="iv-section">
      <div className="iv-eb">{content.eyebrow}</div>
      <div className="iv-title">
        <Rich lines={content.title} />
      </div>
      <div className="iv-schedule">
        {content.items.map((it, i) => (
          <div className="iv-sch-item" key={i}>
            <div className="iv-sch-time">{it.time}</div>
            <div className="iv-sch-content">
              <div className="t">{it.title}</div>
              <div className="d">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
