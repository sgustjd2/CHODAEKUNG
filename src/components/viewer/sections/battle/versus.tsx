import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { Team, VersusContent } from "@/lib/invitation/types";

function TeamCard({ team, base, home }: { team: Team; base: "home" | "away"; home?: boolean }) {
  return (
    <div className={`ivb-team${home ? " home" : ""}`}>
      <div className="flag">{team.flag}</div>
      <div className="name-t"><Editable path={`${base}.name`}>{team.name}</Editable></div>
      <div className="meta"><Editable path={`${base}.meta`}>{team.meta}</Editable></div>
      {team.record && (
        <div className="record">
          <span className="w">W<Editable path={`${base}.record.w`}>{team.record.w}</Editable></span> ·{" "}
          <span className="d">D<Editable path={`${base}.record.d`}>{team.record.d}</Editable></span> ·{" "}
          <span className="l">L<Editable path={`${base}.record.l`}>{team.record.l}</Editable></span>
        </div>
      )}
    </div>
  );
}

export function BattleVersus({ content }: { content: VersusContent }) {
  return (
    <div className="ivb-vs-block">
      <div className="ivb-vs-header">
        <div className="ivb-vs-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>
        <div className="ivb-vs-title">
          <Editable path="title" multiline><Rich lines={content.title} /></Editable>
        </div>
      </div>
      <div className="ivb-versus">
        <TeamCard team={content.home} base="home" home />
        <div className="ivb-vs-mid">
          <div className="ivb-vs-word">{content.vsWord ?? "VS"}</div>
        </div>
        <TeamCard team={content.away} base="away" />
      </div>
    </div>
  );
}
