import { GSection } from "./g-section";
import { Editable } from "../../editable";
import type { ChampionsContent } from "@/lib/invitation/types";

export function GamingChampions({ content }: { content: ChampionsContent }) {
  return (
    <GSection eyebrow={content.eyebrow} title={content.title}>
      <div className="g-champions">
        {content.items.map((c, i) => (
          <div className={`g-champ${c.picked ? " picked" : ""}`} key={i}>
            {c.icon}
            <div className="lane"><Editable path={`items.${i}.lane`}>{c.lane}</Editable></div>
          </div>
        ))}
      </div>
    </GSection>
  );
}
