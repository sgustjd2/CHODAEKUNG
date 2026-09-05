import { GSection } from "./g-section";
import type { RulesContent } from "@/lib/invitation/types";

export function GamingRules({ content }: { content: RulesContent }) {
  return (
    <GSection eyebrow={content.eyebrow ?? ""} title={content.titleLine ?? []}>
      <div className="g-rules">
        {content.rules.map((r, i) => (
          <div className="g-rule" key={i}>
            <div className="num">{i + 1}</div>
            <div className="g-rule-info">
              <div className="t">{r.t}</div>
              <div className="d">{r.d}</div>
            </div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
