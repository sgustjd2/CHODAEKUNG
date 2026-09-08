import { Fragment } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import { Icon } from "@/components/ui/icon";
import type { CoverContent } from "@/lib/invitation/types";

export function CuteCover({ content }: { content: CoverContent }) {
  return (
    <div className="c-cover">
      <Icon name={content.mascot ?? "momo-party"} className="c-momo" viewBox="0 0 200 260" />
      {content.eyebrow && <div className="c-cover-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>}
      {content.titleLines && (
        <div className="c-title-cute">
          <Editable path="titleLines" multiline><Rich lines={content.titleLines} /></Editable>
        </div>
      )}
      {content.subtitleLines && (
        <div className="c-cover-sub">
          {content.subtitleLines.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              <Editable path={`subtitleLines.${i}`}>{l}</Editable>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
