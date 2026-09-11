import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { EndingContent } from "@/lib/invitation/types";

export function EditorialEnding({ content }: { content: EndingContent }) {
  return (
    <div className="e-ending">
      {content.huge && (
        <div className="brand-huge">
          <Editable path="huge" multiline><Rich lines={content.huge} /></Editable>
        </div>
      )}
      {content.colophon && (
        <div className="colophon">
          <Editable path="colophon" multiline><Rich lines={content.colophon} /></Editable>
        </div>
      )}
    </div>
  );
}
