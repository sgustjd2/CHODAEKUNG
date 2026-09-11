import type { ReactNode } from "react";
import { Rich } from "../../rich-text";
import { Editable } from "../../editable";
import type { Line } from "@/lib/invitation/types";

/** Gaming section shell: neon eyebrow + gradient-accent heading + body.
 * `eyebrowPath`/`titlePath` are the content field paths the inline editors commit to
 * (default "eyebrow"/"title"; rules uses "titleLine" for its heading). */
export function GSection({
  eyebrow,
  title,
  eyebrowPath = "eyebrow",
  titlePath = "title",
  children,
}: {
  eyebrow: string;
  title: Line[];
  eyebrowPath?: string;
  titlePath?: string;
  children: ReactNode;
}) {
  return (
    <div className="g-section">
      <div className="g-sec-eb"><Editable path={eyebrowPath}>{eyebrow}</Editable></div>
      <h2>
        <Editable path={titlePath} multiline><Rich lines={title} /></Editable>
      </h2>
      {children}
    </div>
  );
}
