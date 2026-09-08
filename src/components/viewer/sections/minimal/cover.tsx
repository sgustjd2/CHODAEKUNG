import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { photoUrl } from "@/lib/photo";
import type { CoverContent } from "@/lib/invitation/types";

export function MinimalCover({ content }: { content: CoverContent }) {
  return (
    <div className="ivm-cover">
      <div className="ivm-cover-header">
        <span><Editable path="headerLeft">{content.headerLeft}</Editable></span>
        <span className="h-r"><Editable path="headerRight">{content.headerRight}</Editable></span>
      </div>
      <div>
        <div className="ivm-cover-photo" style={{ backgroundImage: `url('${photoUrl(content.image)}')` }} />
        <div className="ivm-cover-title">
          {content.titleLines && <Editable path="titleLines" multiline><Rich lines={content.titleLines} /></Editable>}
          {content.subtitle && <span className="sub"><Editable path="subtitle">{content.subtitle}</Editable></span>}
        </div>
      </div>
    </div>
  );
}
