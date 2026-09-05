import { Rich } from "../../rich-text";
import { TlSection } from "./tl-section";
import type { CostContent } from "@/lib/invitation/types";

export function TimelineCost({ content }: { content: CostContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="cost-card">
        <div className="cost-eb">{content.costEb}</div>
        <div className="cost-total">{content.total}</div>
        <div className="cost-split">
          <Rich lines={[content.split]} />
        </div>
      </div>
      {content.info && (
        <div className="tl-info-grid" style={{ marginTop: 12 }}>
          {content.info.map((c, i) => (
            <div className="tl-info" key={i}>
              <div className="k">{c.k}</div>
              <div className="v">
                {c.v}
                {c.u && <span className="u">{c.u}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </TlSection>
  );
}
