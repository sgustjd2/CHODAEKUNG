"use client";

import { TlSection } from "./tl-section";
import { Editable } from "../../editable";
import { useLiveParty } from "../../use-live-party";
import type { DetailsContent } from "@/lib/invitation/types";

export function TimelineDetails({ content, slug, preview, capacity }: { content: DetailsContent; slug?: string; preview?: boolean; capacity?: number }) {
  // Published page: party block reflects real RSVPs. Editor/preview: the template's own party.
  const party = useLiveParty(slug, preview ?? false, capacity, content.party);
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
      {party && (
        <div className="party-row">
          {party.avatars.map((a, i) => (
            <div key={i} className={`party-ava${a.tone ? ` n${a.tone}` : ""}`}>
              {a.label}
            </div>
          ))}
          {party.more && <div className="party-ava more">{party.more}</div>}
          <div className="party-count">
            <span className="n-t"><Editable path="party.countLabel">{party.countLabel}</Editable></span>
            {party.countSub && <span className="l-t"><Editable path="party.countSub">{party.countSub}</Editable></span>}
          </div>
        </div>
      )}
    </TlSection>
  );
}
