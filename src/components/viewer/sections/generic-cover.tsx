import type { CoverContent, Line } from "@/lib/invitation/types";
import { photoUrl } from "@/lib/photo";
import { Editable } from "../editable";

/** Flatten Line[] (string | Rich[]) to plain text for the generic cover title. */
function flatten(lines?: Line[]): string {
  if (!lines) return "";
  return lines
    .map((l) => (typeof l === "string" ? l : l.map((r) => (typeof r === "string" ? r : r.text)).join("")))
    .join(" ");
}

/**
 * Theme-agnostic cover rendered in a chosen arrangement (CoverContent.layout).
 * Used when layout !== "theme"; inherits the theme's CSS tokens (--wax, --paper,
 * fonts) from the enclosing `.iv.t-<theme>` scope so it matches any theme.
 */
export function GenericCover({ content }: { content: CoverContent }) {
  const variant = content.layout && content.layout !== "theme" ? content.layout : "photo-bottom";
  const title = content.names?.length
    ? content.names.join(content.connector ? ` ${content.connector} ` : " · ")
    : content.title || flatten(content.titleLines);
  const subtitle = content.subtitle || content.subtitleLines?.join(" ") || "";
  // Names-based title stays plain (edited via the inspector's 이름 fields); a title/titleLines-based
  // title has no inspector field, so make it inline-editable here — otherwise a cover switched to a
  // photo layout (e.g. timeline/cute/developer) would have an uneditable title/subtitle.
  const titlePath = content.names?.length ? null : content.title != null ? "title" : content.titleLines ? "titleLines" : null;
  const subPath = content.subtitle != null ? "subtitle" : content.subtitleLines ? "subtitleLines" : null;
  return (
    <div className={`gcover gcover-${variant}`}>
      <div
        className="gcover-photo"
        style={{ backgroundImage: `url('${photoUrl(content.image)}')`, filter: content.imgFilter || undefined }}
      />
      <div className="gcover-body">
        {content.eyebrow && <div className="gcover-eb"><Editable path="eyebrow">{content.eyebrow}</Editable></div>}
        {title && (
          <h1 className="gcover-title">
            {titlePath ? <Editable path={titlePath} multiline={titlePath === "titleLines"}>{title}</Editable> : title}
          </h1>
        )}
        {subtitle && (
          <p className="gcover-sub">
            {subPath ? <Editable path={subPath} multiline={subPath === "subtitleLines"}>{subtitle}</Editable> : subtitle}
          </p>
        )}
        {content.dateLabel && <div className="gcover-date"><Editable path="dateLabel">{content.dateLabel}</Editable></div>}
      </div>
    </div>
  );
}
