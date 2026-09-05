import { BattleSecTitle } from "./sec-title";
import type { RosterContent } from "@/lib/invitation/types";

export function BattleRoster({ content }: { content: RosterContent }) {
  return (
    <div className="ivb-roster">
      {content.groups.map((g, gi) => (
        <div key={gi} style={gi > 0 ? { marginTop: 24 } : undefined}>
          <BattleSecTitle>{g.title}</BattleSecTitle>
          <div className="ivb-roster-list">
            {g.players.map((p, i) => (
              <div className={`ivb-player${gi > 0 ? " away" : ""}`} key={i}>
                <div className="num">{p.num}</div>
                <div className="ivb-player-info">
                  <div className="p-name">{p.name}</div>
                  <div className="p-role">{p.role}</div>
                </div>
                {p.badge && <span className="badge">{p.badge}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
