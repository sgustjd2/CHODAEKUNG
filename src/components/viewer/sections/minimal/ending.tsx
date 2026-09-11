import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { EndingContent } from "@/lib/invitation/types";

export function MinimalEnding({ content }: { content: EndingContent }) {
  return (
    <div className="ivm-ending">
      <div className="huge">
        <Editable path="huge" multiline><Rich lines={content.huge ?? []} /></Editable>
      </div>
      {content.below && <div className="below"><Editable path="below">{content.below}</Editable></div>}
    </div>
  );
}
