import { ESection } from "./e-section";
import { Rich } from "../../rich-text";
import { photoUrl } from "@/lib/photo";
import { LocationMap } from "../../location-map";
import { LocationButtons } from "../../location-buttons";
import { lineText } from "@/lib/invitation/meta";
import { locationQuery, locationAddress } from "@/lib/invitation/map-links";
import type { LocationContent } from "@/lib/invitation/types";

export function EditorialLocation({ content }: { content: LocationContent }) {
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title}>
      {content.photo && (
        <div className="e-photo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(content.photo)} alt="" loading="lazy" decoding="async" />
          {content.photoCap && (
            <div className="e-photo-cap">
              <span>{content.photoCap.l}</span>
              <span>{content.photoCap.r}</span>
            </div>
          )}
        </div>
      )}
      {content.body.length > 0 && (
        <div className="e-body">
          <Rich lines={content.body} />
        </div>
      )}
      <LocationMap className="iv-locmap" address={lineText(content.body)} />
      {content.mapButtons.length > 0 && (
        <div className="e-loc-actions">
          <LocationButtons
            buttons={content.mapButtons}
            query={locationQuery(content)}
            address={locationAddress(content)}
            primaryClass="btn btn-primary"
            normalClass="btn btn-outline"
          />
        </div>
      )}
    </ESection>
  );
}
