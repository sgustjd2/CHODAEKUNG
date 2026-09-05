import { GSection } from "./g-section";
import type { CountdownContent } from "@/lib/invitation/types";

export function GamingCountdown({ content }: { content: CountdownContent }) {
  return (
    <GSection eyebrow={content.eyebrow ?? ""} title={content.title ?? []}>
      <div className="g-countdown">
        {content.cells.map((c, i) => (
          <div className={`g-cd-cell${c.warn ? " warn" : ""}`} key={i}>
            <div className="n">{c.n}</div>
            <div className="l">{c.l}</div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
