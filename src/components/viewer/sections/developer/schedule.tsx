import { DSection } from "./d-section";
import { Editable } from "../../editable";
import type { ScheduleContent } from "@/lib/invitation/types";

export function DevSchedule({ content }: { content: ScheduleContent }) {
  return (
    <DSection name={content.eyebrow} badge={`${content.items.length} items`}>
      <div className="d-table">
        {content.items.map((it, i) => (
          <div className="row" key={i}>
            <span className="k"><Editable path={`items.${i}.time`}>{it.time}</Editable></span>
            <span className="v"><Editable path={`items.${i}.title`}>{it.title}</Editable></span>
          </div>
        ))}
      </div>
    </DSection>
  );
}
