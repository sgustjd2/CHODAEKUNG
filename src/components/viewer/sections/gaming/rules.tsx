import { GSection } from "./g-section";
import { Editable } from "../../editable";
import type { RulesContent } from "@/lib/invitation/types";

export function GamingRules({ content }: { content: RulesContent }) {
  return (
    <GSection eyebrow={content.eyebrow ?? ""} title={content.titleLine ?? []} titlePath="titleLine">
      <div className="g-rules">
        {content.rules.map((r, i) => (
          <div className="g-rule" key={i}>
            <div className="num">{i + 1}</div>
            <div className="g-rule-info">
              <div className="t"><Editable path={`rules.${i}.t`}>{r.t}</Editable></div>
              <div className="d"><Editable path={`rules.${i}.d`}>{r.d}</Editable></div>
            </div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
