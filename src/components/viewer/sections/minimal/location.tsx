import { Rich } from "../../rich-text";
import { MinimalHead } from "./section-head";
import type { LocationContent } from "@/lib/invitation/types";

export function MinimalLocation({ content, index }: { content: LocationContent; index?: number }) {
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Rich lines={content.title} />
      </div>
      <p className="ivm-body">
        <Rich lines={content.body} />
      </p>
      <div className="ivm-map" />
      <div className="ivm-map-actions">
        {content.mapButtons.map((b, i) => (
          <div key={i} className={`ivm-loc-btn${b.primary ? " primary" : ""}`}>
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
