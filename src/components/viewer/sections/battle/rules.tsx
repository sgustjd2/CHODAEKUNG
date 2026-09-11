import { BattleSecTitle } from "./sec-title";
import { Editable } from "../../editable";
import type { RulesContent } from "@/lib/invitation/types";

export function BattleRules({ content }: { content: RulesContent }) {
  return (
    <div className="ivb-rules">
      <BattleSecTitle><Editable path="title">{content.title}</Editable></BattleSecTitle>
      <div className="ivb-rules-grid">
        {content.rules.map((r, i) => (
          <div className="ivb-rule" key={i}>
            <div className="ivb-rule-num">{i + 1}</div>
            <div className="ivb-rule-txt">
              <div className="t"><Editable path={`rules.${i}.t`}>{r.t}</Editable></div>
              <div className="d"><Editable path={`rules.${i}.d`}>{r.d}</Editable></div>
            </div>
          </div>
        ))}
      </div>
      {content.prize && (
        <div className="ivb-prize">
          <div className="ivb-prize-eb"><Editable path="prize.eb">{content.prize.eb}</Editable></div>
          <div className="ivb-prize-name"><Editable path="prize.name">{content.prize.name}</Editable></div>
          <div className="ivb-prize-sub"><Editable path="prize.sub">{content.prize.sub}</Editable></div>
        </div>
      )}
    </div>
  );
}
