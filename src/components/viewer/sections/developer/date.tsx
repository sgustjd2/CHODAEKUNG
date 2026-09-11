import { DSection } from "./d-section";
import { Editable } from "../../editable";
import type { DateContent } from "@/lib/invitation/types";

export function DevDate({ content }: { content: DateContent }) {
  const badge = content.countdown ? `D-${content.countdown.days}` : undefined;
  return (
    <DSection name={content.eyebrow} badge={badge}>
      {content.bigDate && (
        <div className="d-countdown-ascii">
          <div className="n">
            <Editable path="bigDate.0">{content.bigDate[0]}</Editable>
            <span className="sep">.</span>
            <Editable path="bigDate.1">{content.bigDate[1]}</Editable>
          </div>
          {content.subLabel && <div className="u"><Editable path="subLabel">{content.subLabel}</Editable></div>}
        </div>
      )}
      {content.dataGrid && (
        <div className="d-table">
          {content.dataGrid.map((r, i) => (
            <div className="row" key={i}>
              <span className="k"><Editable path={`dataGrid.${i}.k`}>{r.k}</Editable></span>
              <span className="v">
                <Editable path={r.v != null ? `dataGrid.${i}.v` : `dataGrid.${i}.en`}>{r.v ?? r.en}</Editable>
              </span>
            </div>
          ))}
        </div>
      )}
    </DSection>
  );
}
