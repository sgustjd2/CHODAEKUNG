import { Rich } from "../../rich-text";
import { BattleSecTitle } from "./sec-title";
import type { LocationContent } from "@/lib/invitation/types";

export function BattleLocation({ content }: { content: LocationContent }) {
  return (
    <div className="ivb-location">
      <BattleSecTitle>{content.eyebrow}</BattleSecTitle>
      <div className="ivb-loc-title">
        <Rich lines={content.title} />
      </div>
      <div className="ivb-loc-addr">
        <Rich lines={content.body} />
      </div>
      <div className="ivb-map" />
      <div className="ivb-loc-actions">
        {content.mapButtons.map((b, i) => (
          <div key={i} className={`ivb-loc-btn${b.primary ? " primary" : ""}`}>
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
