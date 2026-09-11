import { TlSection } from "./tl-section";
import { Editable } from "../../editable";
import type { MenuContent } from "@/lib/invitation/types";

export function TimelineMenu({ content }: { content: MenuContent }) {
  return (
    <TlSection eyebrow={content.eyebrow} title={content.title} tint={content.tint}>
      {content.cards.map((c, i) => (
        <div className="menu-card" key={i}>
          <div className="menu-card-head">
            <span className="cat"><Editable path={`cards.${i}.cat`}>{c.cat}</Editable></span>
            <span className="price-tag"><Editable path={`cards.${i}.count`}>{c.count}</Editable></span>
          </div>
          <h3><Editable path={`cards.${i}.heading`}>{c.heading}</Editable></h3>
          <div className="menu-list">
            {c.items.map((it, j) => (
              <div className="menu-item" key={j}>
                <div className="dot" />
                <span className="name-t"><Editable path={`cards.${i}.items.${j}.name`}>{it.name}</Editable></span>
                <span className="meta-t"><Editable path={`cards.${i}.items.${j}.meta`}>{it.meta}</Editable></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </TlSection>
  );
}
