import { BattleSecTitle } from "./sec-title";
import { Editable } from "../../editable";
import type { RosterContent } from "@/lib/invitation/types";

export function BattleRoster({ content }: { content: RosterContent }) {
  return (
    <div className="ivb-roster">
      {content.groups.map((g, gi) => (
        <div key={gi} style={gi > 0 ? { marginTop: 24 } : undefined}>
          <BattleSecTitle><Editable path={`groups.${gi}.title`}>{g.title}</Editable></BattleSecTitle>
          <div className="ivb-roster-list">
            {g.players.map((p, i) => (
              <div className={`ivb-player${gi > 0 ? " away" : ""}`} key={i}>
                <div className="num"><Editable path={`groups.${gi}.players.${i}.num`}>{p.num}</Editable></div>
                <div className="ivb-player-info">
                  <div className="p-name"><Editable path={`groups.${gi}.players.${i}.name`}>{p.name}</Editable></div>
                  <div className="p-role"><Editable path={`groups.${gi}.players.${i}.role`}>{p.role}</Editable></div>
                </div>
                {p.badge && <span className="badge"><Editable path={`groups.${gi}.players.${i}.badge`}>{p.badge}</Editable></span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
