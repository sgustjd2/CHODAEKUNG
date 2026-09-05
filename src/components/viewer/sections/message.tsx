import { Rich } from "../rich-text";
import type { MessageContent } from "@/lib/invitation/types";

export function MessageSection({ content }: { content: MessageContent }) {
  return (
    <div className="iv-section">
      {content.flourish && <div className="iv-flourish">{content.flourish}</div>}
      <div className="iv-eb">{content.eyebrow}</div>
      <div className="iv-title">
        <Rich lines={content.title} />
      </div>
      <div className="iv-body">
        <Rich lines={content.body} />
      </div>
    </div>
  );
}
