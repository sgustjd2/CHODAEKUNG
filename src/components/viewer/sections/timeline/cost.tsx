import { Rich } from "../../rich-text";
import { TlSection } from "./tl-section";
import { Editable } from "../../editable";
import type { CostContent } from "@/lib/invitation/types";

export function TimelineCost({ content }: { content: CostContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="cost-card">
        <div className="cost-eb"><Editable path="costEb">{content.costEb}</Editable></div>
        <div className="cost-total"><Editable path="total">{content.total}</Editable></div>
        <div className="cost-split">
          <Editable path="split"><Rich lines={[content.split]} /></Editable>
        </div>
      </div>
      {content.info && (
        <div className="tl-info-grid" style={{ marginTop: 12 }}>
          {content.info.map((c, i) => (
            <div className="tl-info" key={i}>
              <div className="k"><Editable path={`info.${i}.k`}>{c.k}</Editable></div>
              <div className="v">
                <Editable path={`info.${i}.v`}>{c.v}</Editable>
                {c.u && <span className="u"><Editable path={`info.${i}.u`}>{c.u}</Editable></span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </TlSection>
  );
}
