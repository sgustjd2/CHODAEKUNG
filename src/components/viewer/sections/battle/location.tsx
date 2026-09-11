import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { BattleSecTitle } from "./sec-title";
import { LocationMap } from "../../location-map";
import { LocationButtons } from "../../location-buttons";
import { lineText } from "@/lib/invitation/meta";
import { locationQuery, locationAddress } from "@/lib/invitation/map-links";
import type { LocationContent } from "@/lib/invitation/types";

export function BattleLocation({ content }: { content: LocationContent }) {
  return (
    <div className="ivb-location">
      <BattleSecTitle><Editable path="eyebrow">{content.eyebrow}</Editable></BattleSecTitle>
      <div className="ivb-loc-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div className="ivb-loc-addr">
        <Editable path="body" multiline><Rich lines={content.body} /></Editable>
      </div>
      <LocationMap className="iv-locmap" address={lineText(content.body)} fallback={lineText(content.title)} />
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
