import { Rich } from "../rich-text";
import { Icon } from "@/components/ui/icon";
import { LocationMap } from "../location-map";
import { lineText } from "@/lib/invitation/meta";
import type { LocationContent } from "@/lib/invitation/types";

export function LocationSection({ content }: { content: LocationContent }) {
  return (
    <div className="iv-section iv-loc-card">
      {content.flourishIcon && (
        <div className="iv-flourish">
          <Icon name={content.flourishIcon} />
        </div>
      )}
      <div className="iv-eb">{content.eyebrow}</div>
      <div className="iv-title">
        <Rich lines={content.title} />
      </div>
      <div className="iv-body">
        <Rich lines={content.body} />
      </div>
      <LocationMap className="iv-locmap" address={lineText(content.body)} />
      <div className="iv-loc-actions">
        {content.mapButtons.map((b, i) => (
          <button key={i} type="button" className={`iv-loc-btn${b.primary ? " primary" : ""}`}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
