import { TlSection } from "./tl-section";
import type { MenuContent } from "@/lib/invitation/types";

export function TimelineMenu({ content }: { content: MenuContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      {content.cards.map((c, i) => (
        <div className="menu-card" key={i}>
          <div className="menu-card-head">
            <span className="cat">{c.cat}</span>
            <span className="price-tag">{c.count}</span>
          </div>
          <h3>{c.heading}</h3>
          <div className="menu-list">
            {c.items.map((it, j) => (
              <div className="menu-item" key={j}>
                <div className="dot" />
                <span className="name-t">{it.name}</span>
                <span className="meta-t">{it.meta}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </TlSection>
  );
}
