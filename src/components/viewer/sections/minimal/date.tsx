import { MinimalHead } from "./section-head";
import { Editable } from "../../editable";
import type { DateContent } from "@/lib/invitation/types";

export function MinimalDate({ content, index }: { content: DateContent; index?: number }) {
  return (
    <div className={`ivm-section${content.tint ? " ivm-tint" : ""}`}>
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      {content.bigDate && (
        <div className="ivm-big-date">
          <Editable path="bigDate.0">{content.bigDate[0]}</Editable>
          <span className="dot">.</span>
          <Editable path="bigDate.1">{content.bigDate[1]}</Editable>
        </div>
      )}
      {content.dataGrid && (
        <div className="ivm-data">
          {content.dataGrid.map((c, i) => (
            <div className="cell" key={i}>
              <div className="k"><Editable path={`dataGrid.${i}.k`}>{c.k}</Editable></div>
              <div className="v">
                {c.en && <span className="en"><Editable path={`dataGrid.${i}.en`}>{c.en}</Editable></span>}
                <Editable path={`dataGrid.${i}.v`}>{c.v}</Editable>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
