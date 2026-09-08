import { Icon } from "@/components/ui/icon";
import { Editable } from "../editable";
import type { EndingContent } from "@/lib/invitation/types";

export function EndingSection({ content }: { content: EndingContent }) {
  return (
    <div className="iv-ending">
      {content.flourish && <div className="iv-flourish">{content.flourish}</div>}
      <div className="iv-signature"><Editable path="signature">{content.signature}</Editable></div>
      <div className="iv-names"><Editable path="names">{content.names}</Editable></div>
      <div className="iv-brand-tiny">
        <Icon name="moi-mark" viewBox="0 0 48 48" /> MADE WITH CHODAEKUNG
      </div>
    </div>
  );
}
