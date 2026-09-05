import type { TimelineItem } from "@/lib/invitation/types";

/** Shared vertical timeline (used by the timeline section and MT day plans). */
export function TimelineList({ items }: { items: TimelineItem[] }) {
  return (
    <div className="tl-timeline">
      {items.map((it, i) => (
        <div className={`tl-item${it.state ? " " + it.state : ""}`} key={i}>
          <div className="tl-time">
            {it.time}
            {it.unit && <span className="u">{it.unit}</span>}
          </div>
          <div className="tl-content">
            <div className="t">{it.title}</div>
            <div className="d">{it.desc}</div>
            {it.tags && it.tags.length > 0 && (
              <div className="tags">
                {it.tags.map((t, j) => (
                  <span key={j} className={`tag${t.variant ? " " + t.variant : ""}`}>
                    {t.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
