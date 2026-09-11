import { GSection } from "./g-section";
import { Editable } from "../../editable";
import type { GInfoContent } from "@/lib/invitation/types";

export function GamingInfo({ content }: { content: GInfoContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-info-grid">
        {content.cells.map((c, i) => (
          <div className="g-info" key={i}>
            <div className="k"><Editable path={`cells.${i}.k`}>{c.k}</Editable></div>
            <div className="v">
              <Editable path={`cells.${i}.v`}>{c.v}</Editable>
              {c.u && <span className="u"><Editable path={`cells.${i}.u`}>{c.u}</Editable></span>}
            </div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
