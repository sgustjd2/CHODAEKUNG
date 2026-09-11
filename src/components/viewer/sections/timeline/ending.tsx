import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { EndingContent } from "@/lib/invitation/types";

export function TimelineEnding({ content }: { content: EndingContent }) {
  return (
    <div className="tl-ending">
      {content.signatureLines && (
        <div className="signature">
          <Editable path="signatureLines" multiline><Rich lines={content.signatureLines} /></Editable>
        </div>
      )}
      {content.names && <div className="tl-end-name"><Editable path="names">{content.names}</Editable></div>}
      <div className="brand-tiny">
        MADE WITH 초대<span className="seal-kung">쿵</span>
      </div>
    </div>
  );
}
