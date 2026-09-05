import { Rich } from "../../rich-text";
import type { EndingContent } from "@/lib/invitation/types";

export function EditorialEnding({ content }: { content: EndingContent }) {
  return (
    <div className="e-ending">
      {content.huge && (
        <div className="brand-huge">
          <Rich lines={content.huge} />
        </div>
      )}
      {content.colophon && (
        <div className="colophon">
          <Rich lines={content.colophon} />
        </div>
      )}
    </div>
  );
}
