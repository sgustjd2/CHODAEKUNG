import type { EndingContent } from "@/lib/invitation/types";

export function BattleEnding({ content }: { content: EndingContent }) {
  return (
    <div className="ivb-ending">
      {content.stamp && <div className="stamp">{content.stamp}</div>}
      <div className="kung-signature">
        {content.signature} <span className="seal-kung">쿵</span>
      </div>
      {content.below && <div className="brand-tiny">{content.below}</div>}
    </div>
  );
}
