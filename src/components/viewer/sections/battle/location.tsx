import { Rich } from "../../rich-text";
import { BattleSecTitle } from "./sec-title";
import { LocationMap } from "../../location-map";
import { LocationButtons } from "../../location-buttons";
import { lineText } from "@/lib/invitation/meta";
import { locationQuery, locationAddress } from "@/lib/invitation/map-links";
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
      <LocationMap className="iv-locmap" address={lineText(content.body)} />
      <div className="ivb-loc-actions">
        <LocationButtons
          buttons={content.mapButtons}
          query={locationQuery(content)}
          address={locationAddress(content)}
          primaryClass="ivb-loc-btn primary"
          normalClass="ivb-loc-btn"
        />
      </div>
    </div>
  );
}
