import { Rich } from "../rich-text";
import { Editable } from "../editable";
import type { MessageContent } from "@/lib/invitation/types";

export function MessageSection({ content }: { content: MessageContent }) {
  return (
    <div className="iv-section">
      {content.flourish && <div className="iv-flourish">{content.flourish}</div>}
      <div className="iv-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>
      <div className="iv-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <div className="iv-body">
        <Editable path="body" multiline><Rich lines={content.body} /></Editable>
      </div>
    </div>
  );
}
