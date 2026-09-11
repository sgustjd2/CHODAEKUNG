import { TlSection } from "./tl-section";
import { Editable } from "../../editable";
import type { DetailsContent } from "@/lib/invitation/types";

export function TimelineDetails({ content }: { content: DetailsContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="tl-info-grid">
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
      {content.party && (
        <div className="party-row">
          {content.party.avatars.map((a, i) => (
            <div key={i} className={`party-ava${a.tone ? ` n${a.tone}` : ""}`}>
              {a.label}
            </div>
          ))}
          {content.party.more && <div className="party-ava more">{content.party.more}</div>}
          <div className="party-count">
            <span className="n-t"><Editable path="party.countLabel">{content.party.countLabel}</Editable></span>
            <span className="l-t"><Editable path="party.countSub">{content.party.countSub}</Editable></span>
          </div>
        </div>
      )}
    </TlSection>
  );
}
