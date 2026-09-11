import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { MinimalHead } from "./section-head";
import type { ScheduleContent } from "@/lib/invitation/types";

export function MinimalSchedule({ content, index }: { content: ScheduleContent; index?: number }) {
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div style={{ marginTop: 32 }}>
        {content.items.map((it, i) => (
          <div className="ivm-sch-item" key={i}>
            <div className="time"><Editable path={`items.${i}.time`}>{it.time}</Editable></div>
            <div className="desc">
              <Editable path={`items.${i}.title`}>{it.title}</Editable>
              <span className="d"><Editable path={`items.${i}.desc`}>{it.desc}</Editable></span>
            </div>
            <div className="dur"><Editable path={`items.${i}.duration`}>{it.duration}</Editable></div>
          </div>
        ))}
      </div>
    </div>
  );
}
