import { TlSection } from "./tl-section";
import type { DetailsContent } from "@/lib/invitation/types";

export function TimelineDetails({ content }: { content: DetailsContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="tl-info-grid">
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
      {content.party && (
        <div className="party-row">
          {content.party.avatars.map((a, i) => (
            <div key={i} className={`party-ava${a.tone ? ` n${a.tone}` : ""}`}>
              {a.label}
            </div>
          ))}
          {content.party.more && <div className="party-ava more">{content.party.more}</div>}
          <div className="party-count">
            <span className="n-t">{content.party.countLabel}</span>
            <span className="l-t">{content.party.countSub}</span>
          </div>
        </div>
      )}
    </TlSection>
  );
}
