import { GSection } from "./g-section";
import type { TierChartContent } from "@/lib/invitation/types";

export function GamingTierChart({ content }: { content: TierChartContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-tier-chart">
        {content.cols.map((c, i) => (
          <div className="g-tier-col" key={i}>
            <div className="t">{c.t}</div>
            <div className="n">{c.n}</div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
