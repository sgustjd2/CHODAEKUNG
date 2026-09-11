import { Rich } from "../rich-text";
import { Editable } from "../editable";
import type { ScheduleContent } from "@/lib/invitation/types";

export function ScheduleSection({ content }: { content: ScheduleContent }) {
  return (
    <div className="iv-section">
      <div className="iv-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>
      <div className="iv-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div className="iv-schedule">
        {content.items.map((it, i) => (
          <div className="iv-sch-item" key={i}>
            <div className="iv-sch-time"><Editable path={`items.${i}.time`}>{it.time}</Editable></div>
            <div className="iv-sch-content">
              <div className="t"><Editable path={`items.${i}.title`}>{it.title}</Editable></div>
              <div className="d"><Editable path={`items.${i}.desc`}>{it.desc}</Editable></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
