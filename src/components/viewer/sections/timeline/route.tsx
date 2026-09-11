import { TlSection } from "./tl-section";
import { Editable } from "../../editable";
import type { RouteContent } from "@/lib/invitation/types";

export function TimelineRoute({ content }: { content: RouteContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      <div className="route-map">
        {content.stops.map((s, i) => (
          <div className="route-stop" key={i}>
            <div className="route-icon" style={s.accent ? { background: "var(--wax)" } : undefined}>
              {s.icon}
            </div>
            <div className="route-info">
              <div className="t"><Editable path={`stops.${i}.title`}>{s.title}</Editable></div>
              <div className="m"><Editable path={`stops.${i}.meta`}>{s.meta}</Editable></div>
              <div className="time-t"><Editable path={`stops.${i}.time`}>{s.time}</Editable></div>
            </div>
          </div>
        ))}
      </div>
    </TlSection>
  );
}
