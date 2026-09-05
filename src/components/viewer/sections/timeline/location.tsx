import { Rich } from "../../rich-text";
import { TlSection } from "./tl-section";
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
      <div className="tl-map" />
      <div className="tl-loc-actions">
        {content.mapButtons.map((b, i) => (
          <div key={i} className={`tl-loc-btn${b.primary ? " primary" : ""}`}>
            {b.label}
          </div>
        ))}
      </div>
    </TlSection>
  );
}
