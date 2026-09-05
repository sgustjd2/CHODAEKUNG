import { GSection } from "./g-section";
import type { ChampionsContent } from "@/lib/invitation/types";

export function GamingChampions({ content }: { content: ChampionsContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-champions">
        {content.items.map((c, i) => (
          <div className={`g-champ${c.picked ? " picked" : ""}`} key={i}>
            {c.icon}
            <div className="lane">{c.lane}</div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
