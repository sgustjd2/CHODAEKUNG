import { Rich } from "../../rich-text";
import { photoUrl } from "@/lib/photo";
import type { CoverContent } from "@/lib/invitation/types";

export function EditorialCover({ content }: { content: CoverContent }) {
  return (
    <div className="e-cover" style={{ backgroundImage: `url('${photoUrl(content.image)}')` }}>
      <div className="e-cover-top">
        {content.headerLeft && <div className="e-issue">{content.headerLeft}</div>}
        {content.headerRightLines && (
          <div className="e-date-strip">
            {content.headerRightLines.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        )}
      </div>
      <div className="e-cover-bot">
        {content.eyebrow && <div className="e-cover-eb">{content.eyebrow}</div>}
        {content.titleLines && (
          <div className="e-cover-title">
            <Rich lines={content.titleLines} />
          </div>
        )}
        {content.coverSub && (
          <div className="e-cover-sub">
            <span className="l">{content.coverSub.l}</span>
            <span className="r">{content.coverSub.r}</span>
          </div>
        )}
      </div>
    </div>
  );
}
