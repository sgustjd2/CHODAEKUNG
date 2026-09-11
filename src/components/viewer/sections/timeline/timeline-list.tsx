import { Editable } from "../../editable";
import type { TimelineItem } from "@/lib/invitation/types";

/** Shared vertical timeline (used by the timeline section and MT day plans).
 * `pathBase` is the content path of the items array so inline edits target the right field
 * — "items" for the timeline section, "days.<n>.items" for a day plan. */
export function TimelineList({ items, pathBase = "items" }: { items: TimelineItem[]; pathBase?: string }) {
  return (
    <div className="tl-timeline">
      {items.map((it, i) => (
        <div className={`tl-item${it.state ? " " + it.state : ""}`} key={i}>
          <div className="tl-time">
            <Editable path={`${pathBase}.${i}.time`}>{it.time}</Editable>
            {it.unit && <span className="u"><Editable path={`${pathBase}.${i}.unit`}>{it.unit}</Editable></span>}
          </div>
          <div className="tl-content">
            <div className="t"><Editable path={`${pathBase}.${i}.title`}>{it.title}</Editable></div>
            <div className="d"><Editable path={`${pathBase}.${i}.desc`}>{it.desc}</Editable></div>
            {it.tags && it.tags.length > 0 && (
              <div className="tags">
                {it.tags.map((t, j) => (
                  <span key={j} className={`tag${t.variant ? " " + t.variant : ""}`}>
                    <Editable path={`${pathBase}.${i}.tags.${j}.label`}>{t.label}</Editable>
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
