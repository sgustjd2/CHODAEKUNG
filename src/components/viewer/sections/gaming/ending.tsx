import { Editable } from "../../editable";
import type { EndingContent } from "@/lib/invitation/types";

export function GamingEnding({ content }: { content: EndingContent }) {
  return (
    <div className="g-ending">
      <div className="signature"><Editable path="signature">{content.signature}</Editable></div>
      {content.names && <div className="signature-sub"><Editable path="names">{content.names}</Editable></div>}
      <div className="brand-tiny">
        MADE WITH 초대<span className="seal-kung">쿵</span>
      </div>
    </div>
  );
}
