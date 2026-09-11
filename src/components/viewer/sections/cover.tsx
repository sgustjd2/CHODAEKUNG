import { Fragment } from "react";
import { photoUrl } from "@/lib/photo";
import { Editable } from "../editable";
import type { CoverContent } from "@/lib/invitation/types";

export function CoverSection({ content }: { content: CoverContent }) {
  const { image, brand, seal, eyebrow, names, connector, title, dateLabel } = content;
  return (
    <div className="iv-cover" style={{ backgroundImage: `url('${photoUrl(image)}')` }}>
      <div className="iv-cover-top">
        {brand && <div className="iv-brand"><Editable path="brand">{brand}</Editable></div>}
        {seal && <div className="iv-mini-seal"><Editable path="seal">{seal}</Editable></div>}
      </div>
      <div className="iv-cover-bot">
        <div className="iv-cover-eb"><Editable path="eyebrow">{eyebrow}</Editable></div>
        <div className="iv-cover-couple">
          {names
            ? names.map((n, i) => (
                <Fragment key={i}>
                  {i > 0 && (connector ? <span className="and"><Editable path="connector">{connector}</Editable></span> : <br />)}
                  <Editable path={`names.${i}`}>{n}</Editable>
                </Fragment>
              ))
            : <Editable path="title">{title}</Editable>}
        </div>
        <div className="iv-cover-date"><Editable path="dateLabel">{dateLabel}</Editable></div>
      </div>
    </div>
  );
}
