import { Rich } from "../../rich-text";
import { TlSection } from "./tl-section";
import { LocationMap } from "../../location-map";
import { LocationButtons } from "../../location-buttons";
import { lineText } from "@/lib/invitation/meta";
import { locationQuery, locationAddress } from "@/lib/invitation/map-links";
import type { LocationContent } from "@/lib/invitation/types";

export function TimelineLocation({ content }: { content: LocationContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="tl-info" style={{ marginBottom: 8 }}>
        <div className="k">Address</div>
        <div className="v" style={{ fontSize: 15, letterSpacing: "-0.01em" }}>
          <Rich lines={content.body} />
        </div>
      </div>
      <LocationMap className="iv-locmap" address={lineText(content.body)} fallback={lineText(content.title)} />
      <div className="tl-loc-actions">
        <LocationButtons
          buttons={content.mapButtons}
          query={locationQuery(content)}
          address={locationAddress(content)}
          primaryClass="tl-loc-btn primary"
          normalClass="tl-loc-btn"
        />
      </div>
    </TlSection>
  );
}
