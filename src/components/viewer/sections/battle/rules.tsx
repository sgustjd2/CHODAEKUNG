import { BattleSecTitle } from "./sec-title";
import type { RulesContent } from "@/lib/invitation/types";

export function BattleRules({ content }: { content: RulesContent }) {
  return (
    <div className="ivb-rules">
      <BattleSecTitle>{content.title}</BattleSecTitle>
      <div className="ivb-rules-grid">
        {content.rules.map((r, i) => (
          <div className="ivb-rule" key={i}>
            <div className="ivb-rule-num">{i + 1}</div>
            <div className="ivb-rule-txt">
              <div className="t">{r.t}</div>
              <div className="d">{r.d}</div>
            </div>
          </div>
        ))}
      </div>
      {content.prize && (
        <div className="ivb-prize">
          <div className="ivb-prize-eb">{content.prize.eb}</div>
          <div className="ivb-prize-name">{content.prize.name}</div>
          <div className="ivb-prize-sub">{content.prize.sub}</div>
        </div>
      )}
    </div>
  );
}
