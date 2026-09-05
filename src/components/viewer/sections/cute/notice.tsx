import { CCard } from "./c-card";
import { Icon } from "@/components/ui/icon";
import type { NoticeContent } from "@/lib/invitation/types";

export function CuteNotice({ content }: { content: NoticeContent }) {
  return (
    <CCard eb={content.eyebrow} ebVariant="lav" title={content.title}>
      <div className="c-notice">
        {content.items.map((it, i) => (
          <div className="c-notice-item" key={i}>
            <div className={`emoji tone-${it.tone ?? "ink"}`}>
              <Icon name={it.icon} width={20} height={20} />
            </div>
            <div>
              <div className="t">{it.t}</div>
              <div className="d">{it.d}</div>
            </div>
          </div>
        ))}
      </div>
    </CCard>
  );
}
