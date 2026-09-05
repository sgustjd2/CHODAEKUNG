import { GSection } from "./g-section";
import type { GInfoContent } from "@/lib/invitation/types";

export function GamingInfo({ content }: { content: GInfoContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-info-grid">
        {content.cells.map((c, i) => (
          <div className="g-info" key={i}>
            <div className="k">{c.k}</div>
            <div className="v">
              {c.v}
              {c.u && <span className="u">{c.u}</span>}
            </div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
