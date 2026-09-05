import { Rich } from "../../rich-text";
import type { EndingContent } from "@/lib/invitation/types";

export function TimelineEnding({ content }: { content: EndingContent }) {
  return (
    <div className="tl-ending">
      {content.signatureLines && (
        <div className="signature">
          <Rich lines={content.signatureLines} />
        </div>
      )}
      {content.names && <div className="tl-end-name">{content.names}</div>}
      <div className="brand-tiny">
        MADE WITH 초대<span className="seal-kung">쿵</span>
      </div>
    </div>
  );
}
