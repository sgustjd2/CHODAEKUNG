import { ESection } from "./e-section";
import { Editable } from "../../editable";
import type { DetailsContent } from "@/lib/invitation/types";

export function EditorialDetails({ content }: { content: DetailsContent }) {
  return (
    <ESection num={content.num} label={content.eyebrow} headline={content.title} tint={content.tint}>
      <div className="e-details">
        {content.info.map((row, i) => (
          <div className="e-detail-row" key={i}>
            <div className="k"><Editable path={`info.${i}.k`}>{row.k}</Editable></div>
            <div className="v">
              <Editable path={`info.${i}.v`}>{row.v}</Editable>
              {row.u && <>{" "}<Editable path={`info.${i}.u`}>{row.u}</Editable></>}
            </div>
          </div>
        ))}
      </div>
    </ESection>
  );
}
