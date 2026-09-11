import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { MinimalHead } from "./section-head";
import { LocationMap } from "../../location-map";
import { LocationButtons } from "../../location-buttons";
import { lineText } from "@/lib/invitation/meta";
import { locationQuery, locationAddress } from "@/lib/invitation/map-links";
import type { LocationContent } from "@/lib/invitation/types";

export function MinimalLocation({ content, index }: { content: LocationContent; index?: number }) {
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <p className="ivm-body">
        <Editable path="body" multiline><Rich lines={content.body} /></Editable>
      </p>
      <LocationMap className="iv-locmap" address={lineText(content.body)} fallback={lineText(content.title)} />
      <div className="ivm-map-actions">
        <LocationButtons
          buttons={content.mapButtons}
          query={locationQuery(content)}
          address={locationAddress(content)}
          primaryClass="ivm-loc-btn primary"
          normalClass="ivm-loc-btn"
        />
      </div>
    </div>
  );
}
