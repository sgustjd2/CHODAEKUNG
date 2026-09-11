import { GSection } from "./g-section";
import { Editable } from "../../editable";
import type { LanesContent } from "@/lib/invitation/types";

export function GamingLanes({ content }: { content: LanesContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-roster-wrap">
        {content.players.map((p, i) => (
          <div className={p.open ? "g-slot-open" : "g-player filled"} key={i}>
            <div className={`g-lane-icon ${p.lane}`}><Editable path={`players.${i}.laneLabel`}>{p.laneLabel}</Editable></div>
            <div className="g-p-info">
              <div className="g-p-name"><Editable path={`players.${i}.name`}>{p.name}</Editable></div>
              <div className="g-p-summoner"><Editable path={`players.${i}.summoner`}>{p.summoner}</Editable></div>
            </div>
            <div className={`g-p-tier ${p.open ? "empty" : p.tierClass ?? ""}`}><Editable path={`players.${i}.tier`}>{p.tier}</Editable></div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
