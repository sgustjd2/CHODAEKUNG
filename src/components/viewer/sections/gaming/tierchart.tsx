import { GSection } from "./g-section";
import { Editable } from "../../editable";
import type { TierChartContent } from "@/lib/invitation/types";

export function GamingTierChart({ content }: { content: TierChartContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-tier-chart">
        {content.cols.map((c, i) => (
          <div className="g-tier-col" key={i}>
            <div className="t"><Editable path={`cols.${i}.t`}>{c.t}</Editable></div>
            <div className="n"><Editable path={`cols.${i}.n`}>{c.n}</Editable></div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
