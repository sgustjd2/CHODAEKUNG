import { Fragment } from "react";
import { Rich } from "../../rich-text";
import { photoUrl } from "@/lib/photo";
import type { CoverContent } from "@/lib/invitation/types";

export function GamingCover({ content }: { content: CoverContent }) {
  return (
    <div className="g-cover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="g-bg" src={photoUrl(content.image)} alt="" style={content.imgFilter ? { filter: content.imgFilter } : undefined} />
      <div className="g-cover-top">
        {content.headerLeft && <div className="g-tag">{content.headerLeft}</div>}
        {content.headerRightLines && (
          <div className="g-time-tag">
            {content.headerRightLines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {l}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="g-cover-bot">
        {content.eyebrow && <div className="g-eb">{content.eyebrow}</div>}
        {content.titleLines && (
          <h1 className="g-title">
            <Rich lines={content.titleLines} />
          </h1>
        )}
        {content.subtitleLines && <div className="g-title-sub">{content.subtitleLines.join(" ")}</div>}
      </div>
    </div>
  );
}
