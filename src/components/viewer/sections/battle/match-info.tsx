import { Fragment } from "react";
import { BattleSecTitle } from "./sec-title";
import type { MatchInfoContent } from "@/lib/invitation/types";

export function BattleMatchInfo({ content }: { content: MatchInfoContent }) {
  return (
    <div className="ivb-details">
      <BattleSecTitle>{content.title}</BattleSecTitle>
      <div className="ivb-info-grid">
        {content.cells.map((c, i) => (
          <div className="ivb-info-cell" key={i}>
            <div className="k">{c.k}</div>
            <div className="v">
              {c.v.map((p, j) =>
                p.u ? (
                  <span className="u" key={j}>{p.t}</span>
                ) : (
                  <Fragment key={j}>{p.t}</Fragment>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
