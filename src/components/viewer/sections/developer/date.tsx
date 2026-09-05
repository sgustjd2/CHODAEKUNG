import { DSection } from "./d-section";
import type { DateContent } from "@/lib/invitation/types";

export function DevDate({ content }: { content: DateContent }) {
  const badge = content.countdown ? `D-${content.countdown.days}` : undefined;
  return (
    <DSection name={content.eyebrow} badge={badge}>
      {content.bigDate && (
        <div className="d-countdown-ascii">
          <div className="n">
            {content.bigDate[0]}
            <span className="sep">.</span>
            {content.bigDate[1]}
          </div>
          {content.subLabel && <div className="u">{content.subLabel}</div>}
        </div>
      )}
      {content.dataGrid && (
        <div className="d-table">
          {content.dataGrid.map((r, i) => (
            <div className="row" key={i}>
              <span className="k">{r.k}</span>
              <span className="v">{r.v ?? r.en}</span>
            </div>
          ))}
        </div>
      )}
    </DSection>
  );
}
