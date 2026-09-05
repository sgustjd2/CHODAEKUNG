import { Rich } from "../../rich-text";
import type { Team, VersusContent } from "@/lib/invitation/types";

function TeamCard({ team, home }: { team: Team; home?: boolean }) {
  return (
    <div className={`ivb-team${home ? " home" : ""}`}>
      <div className="flag">{team.flag}</div>
      <div className="name-t">{team.name}</div>
      <div className="meta">{team.meta}</div>
      {team.record && (
        <div className="record">
          <span className="w">W{team.record.w}</span> · <span className="d">D{team.record.d}</span> ·{" "}
          <span className="l">L{team.record.l}</span>
        </div>
      )}
    </div>
  );
}

export function BattleVersus({ content }: { content: VersusContent }) {
  return (
    <div className="ivb-vs-block">
      <div className="ivb-vs-header">
        <div className="ivb-vs-eb">{content.eyebrow}</div>
        <div className="ivb-vs-title">
          <Rich lines={content.title} />
        </div>
      </div>
      <div className="ivb-versus">
        <TeamCard team={content.home} home />
        <div className="ivb-vs-mid">
          <div className="ivb-vs-word">{content.vsWord ?? "VS"}</div>
        </div>
        <TeamCard team={content.away} />
      </div>
    </div>
  );
}
