import { Rich } from "../../rich-text";
import type { EndingContent } from "@/lib/invitation/types";

export function MinimalEnding({ content }: { content: EndingContent }) {
  return (
    <div className="ivm-ending">
      <div className="huge">
        <Rich lines={content.huge ?? []} />
      </div>
      {content.below && <div className="below">{content.below}</div>}
    </div>
  );
}
