import { GSection } from "./g-section";
import type { LanesContent } from "@/lib/invitation/types";

export function GamingLanes({ content }: { content: LanesContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-roster-wrap">
        {content.players.map((p, i) => (
          <div className={p.open ? "g-slot-open" : "g-player filled"} key={i}>
            <div className={`g-lane-icon ${p.lane}`}>{p.laneLabel}</div>
            <div className="g-p-info">
              <div className="g-p-name">{p.name}</div>
              <div className="g-p-summoner">{p.summoner}</div>
            </div>
            <div className={`g-p-tier ${p.open ? "empty" : p.tierClass ?? ""}`}>{p.tier}</div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
