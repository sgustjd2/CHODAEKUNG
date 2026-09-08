import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { MinimalHead } from "./section-head";
import type { MessageContent } from "@/lib/invitation/types";

export function MinimalMessage({ content, index }: { content: MessageContent; index?: number }) {
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Editable path="title" multiline><Rich lines={content.title} /></Editable>
      </div>
      <p className="ivm-body">
        <Editable path="body" multiline><Rich lines={content.body} /></Editable>
      </p>
    </div>
  );
}
