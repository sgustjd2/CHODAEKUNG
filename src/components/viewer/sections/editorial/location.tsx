import { ESection } from "./e-section";
import { Rich } from "../../rich-text";
import { photoUrl } from "@/lib/photo";
import { LocationMap } from "../../location-map";
import { lineText } from "@/lib/invitation/meta";
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
          {content.mapButtons.map((b, i) => (
            <button type="button" key={i} className={`btn ${b.primary ? "btn-primary" : "btn-outline"}`}>
              {b.label}
            </button>
          ))}
        </div>
      )}
    </ESection>
  );
}
