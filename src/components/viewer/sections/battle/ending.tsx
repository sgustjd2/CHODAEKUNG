import { Editable } from "../../editable";
import type { EndingContent } from "@/lib/invitation/types";

export function BattleEnding({ content }: { content: EndingContent }) {
  return (
    <div className="ivb-ending">
      {content.stamp && <div className="stamp"><Editable path="stamp">{content.stamp}</Editable></div>}
      <div className="kung-signature">
        <Editable path="signature">{content.signature}</Editable> <span className="seal-kung">쿵</span>
      </div>
      {content.below && <div className="brand-tiny"><Editable path="below">{content.below}</Editable></div>}
    </div>
  );
}
