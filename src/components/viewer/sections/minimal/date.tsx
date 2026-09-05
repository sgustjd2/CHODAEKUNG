import { MinimalHead } from "./section-head";
import type { DateContent } from "@/lib/invitation/types";

export function MinimalDate({ content, index }: { content: DateContent; index?: number }) {
  return (
    <div className={`ivm-section${content.tint ? " ivm-tint" : ""}`}>
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      {content.bigDate && (
        <div className="ivm-big-date">
          {content.bigDate[0]}
          <span className="dot">.</span>
          {content.bigDate[1]}
        </div>
      )}
      {content.dataGrid && (
        <div className="ivm-data">
          {content.dataGrid.map((c, i) => (
            <div className="cell" key={i}>
              <div className="k">{c.k}</div>
              <div className="v">
                {c.en && <span className="en">{c.en}</span>}
                {c.v}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
