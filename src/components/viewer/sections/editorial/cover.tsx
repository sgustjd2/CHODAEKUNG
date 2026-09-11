import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { photoUrl } from "@/lib/photo";
import type { CoverContent } from "@/lib/invitation/types";

export function EditorialCover({ content }: { content: CoverContent }) {
  return (
    <div className="e-cover" style={{ backgroundImage: `url('${photoUrl(content.image)}')` }}>
      <div className="e-cover-top">
        {content.headerLeft && <div className="e-issue"><Editable path="headerLeft">{content.headerLeft}</Editable></div>}
        {content.headerRightLines && (
          <div className="e-date-strip">
            {content.headerRightLines.map((l, i) => (
              <span key={i}><Editable path={`headerRightLines.${i}`}>{l}</Editable></span>
            ))}
          </div>
        )}
      </div>
      <div className="e-cover-bot">
        {content.eyebrow && <div className="e-cover-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>}
        {content.titleLines && (
          <div className="e-cover-title">
            <Editable path="titleLines" multiline><Rich lines={content.titleLines} /></Editable>
          </div>
        )}
        {content.coverSub && (
          <div className="e-cover-sub">
            <span className="l"><Editable path="coverSub.l">{content.coverSub.l}</Editable></span>
            <span className="r"><Editable path="coverSub.r">{content.coverSub.r}</Editable></span>
          </div>
        )}
      </div>
    </div>
  );
}
