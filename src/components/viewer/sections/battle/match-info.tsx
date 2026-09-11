import { BattleSecTitle } from "./sec-title";
import { Editable } from "../../editable";
import type { MatchInfoContent } from "@/lib/invitation/types";

export function BattleMatchInfo({ content }: { content: MatchInfoContent }) {
  return (
    <div className="ivb-details">
      <BattleSecTitle><Editable path="title">{content.title}</Editable></BattleSecTitle>
      <div className="ivb-info-grid">
        {content.cells.map((c, i) => (
          <div className="ivb-info-cell" key={i}>
            <div className="k"><Editable path={`cells.${i}.k`}>{c.k}</Editable></div>
            <div className="v">
              {c.v.map((p, j) =>
                p.u ? (
                  <span className="u" key={j}><Editable path={`cells.${i}.v.${j}.t`}>{p.t}</Editable></span>
                ) : (
                  <Editable key={j} path={`cells.${i}.v.${j}.t`}>{p.t}</Editable>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
