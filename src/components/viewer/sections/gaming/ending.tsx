import type { EndingContent } from "@/lib/invitation/types";

export function GamingEnding({ content }: { content: EndingContent }) {
  return (
    <div className="g-ending">
      <div className="signature">{content.signature}</div>
      {content.names && <div className="signature-sub">{content.names}</div>}
      <div className="brand-tiny">
        MADE WITH 초대<span className="seal-kung">쿵</span>
      </div>
    </div>
  );
}
