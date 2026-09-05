import { TlSection } from "./tl-section";
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
              <div className="t">{s.title}</div>
              <div className="m">{s.meta}</div>
              <div className="time-t">{s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </TlSection>
  );
}
