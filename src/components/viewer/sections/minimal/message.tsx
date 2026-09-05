import { Rich } from "../../rich-text";
import { MinimalHead } from "./section-head";
import type { MessageContent } from "@/lib/invitation/types";

export function MinimalMessage({ content, index }: { content: MessageContent; index?: number }) {
  return (
    <div className="ivm-section">
      <MinimalHead eyebrow={content.eyebrow} index={index} />
      <div className="ivm-title">
        <Rich lines={content.title} />
      </div>
      <p className="ivm-body">
        <Rich lines={content.body} />
      </p>
    </div>
  );
}
