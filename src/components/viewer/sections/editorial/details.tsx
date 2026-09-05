import { ESection } from "./e-section";
import type { DetailsContent } from "@/lib/invitation/types";

export function EditorialDetails({ content }: { content: DetailsContent }) {
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title} tint={content.tint}>
      <div className="e-details">
        {content.info.map((row, i) => (
          <div className="e-detail-row" key={i}>
            <div className="k">{row.k}</div>
            <div className="v">
              {row.v}
              {row.u && ` ${row.u}`}
            </div>
          </div>
        ))}
      </div>
    </ESection>
  );
}
