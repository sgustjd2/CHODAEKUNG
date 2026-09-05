import { DSection } from "./d-section";
import type { ScheduleContent } from "@/lib/invitation/types";

export function DevSchedule({ content }: { content: ScheduleContent }) {
  return (
    <DSection name={content.eyebrow} badge={`${content.items.length} items`}>
      <div className="d-table">
        {content.items.map((it, i) => (
          <div className="row" key={i}>
            <span className="k">{it.time}</span>
            <span className="v">{it.title}</span>
          </div>
        ))}
      </div>
    </DSection>
  );
}
