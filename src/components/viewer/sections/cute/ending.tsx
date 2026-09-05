import { Icon } from "@/components/ui/icon";
import type { EndingContent } from "@/lib/invitation/types";

export function CuteEnding({ content }: { content: EndingContent }) {
  return (
    <div className="c-ending">
      <Icon name="momo-card" className="c-ending-momo" viewBox="0 0 220 240" />
      {content.signature && (
        <div className="say">
          {content.signature} <Icon name="ic-heart-fill" className="c-heart" width={20} height={20} />
        </div>
      )}
      {content.names && <div className="from">{content.names}</div>}
      <div className="brand-tiny">
        <Icon name="moi-mark" viewBox="0 0 48 48" width={16} height={16} /> MADE WITH CHODAEKUNG
      </div>
    </div>
  );
}
