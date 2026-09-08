import { GSection } from "./g-section";
import { Rich } from "../../rich-text";
import { LocationMap } from "../../location-map";
import { LocationButtons } from "../../location-buttons";
import { lineText } from "@/lib/invitation/meta";
import { locationQuery, locationAddress } from "@/lib/invitation/map-links";
import type { LocationContent } from "@/lib/invitation/types";

/** Gaming-theme location (for offline events — LAN/PC방): dark card address + Kakao map pin. */
export function GamingLocation({ content }: { content: LocationContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      {content.body.length > 0 && (
        <div className="g-info" style={{ marginBottom: 12 }}>
          <div className="k">Address</div>
          <div className="v" style={{ fontSize: 16 }}>
            <Rich lines={content.body} />
          </div>
        </div>
      )}
      <LocationMap className="iv-locmap" address={lineText(content.body)} />
      {content.mapButtons.length > 0 && (
        <div className="g-cta-btns" style={{ marginTop: 12, maxWidth: "none" }}>
          <LocationButtons
            buttons={content.mapButtons}
            query={locationQuery(content)}
            address={locationAddress(content)}
            classFor={() => "g-cta-btn no"}
          />
        </div>
      )}
    </GSection>
  );
}
