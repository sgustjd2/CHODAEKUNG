import { Rich } from "../rich-text";
import { Editable } from "../editable";
import { Icon } from "@/components/ui/icon";
import { LocationMap } from "../location-map";
import { LocationButtons } from "../location-buttons";
import { lineText } from "@/lib/invitation/meta";
import { locationQuery, locationAddress } from "@/lib/invitation/map-links";
import type { LocationContent } from "@/lib/invitation/types";

export function LocationSection({ content }: { content: LocationContent }) {
  return (
    <div className="iv-section iv-loc-card">
      {content.flourishIcon && (
        <div className="iv-flourish">
          <Icon name={content.flourishIcon} />
        </div>
      )}
      <div className="iv-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>
      <div className="iv-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div className="iv-body">
        <Editable path="body" multiline><Rich lines={content.body} /></Editable>
      </div>
      <LocationMap className="iv-locmap" address={lineText(content.body)} fallback={lineText(content.title)} />
      <div className="iv-loc-actions">
        <LocationButtons
          buttons={content.mapButtons}
          query={locationQuery(content)}
          address={locationAddress(content)}
          primaryClass="iv-loc-btn primary"
          normalClass="iv-loc-btn"
        />
      </div>
    </div>
  );
}
