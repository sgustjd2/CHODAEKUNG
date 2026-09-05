import { Rich } from "../../rich-text";
import type { CoverContent } from "@/lib/invitation/types";

export function MinimalCover({ content }: { content: CoverContent }) {
  return (
    <div className="ivm-cover">
      <div className="ivm-cover-header">
        <span>{content.headerLeft}</span>
        <span className="h-r">{content.headerRight}</span>
      </div>
      <div>
        <div className="ivm-cover-photo" style={{ backgroundImage: `url('/assets/photos/${content.image}.jpg')` }} />
        <div className="ivm-cover-title">
          {content.titleLines && <Rich lines={content.titleLines} />}
          {content.subtitle && <span className="sub">{content.subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
