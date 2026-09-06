import type { CoverContent, Line } from "@/lib/invitation/types";
import { photoUrl } from "@/lib/photo";

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
  return (
    <div className={`gcover gcover-${variant}`}>
      <div
        className="gcover-photo"
        style={{ backgroundImage: `url('${photoUrl(content.image)}')`, filter: content.imgFilter || undefined }}
      />
      <div className="gcover-body">
        {content.eyebrow && <div className="gcover-eb">{content.eyebrow}</div>}
        {title && <h1 className="gcover-title">{title}</h1>}
        {subtitle && <p className="gcover-sub">{subtitle}</p>}
        {content.dateLabel && <div className="gcover-date">{content.dateLabel}</div>}
      </div>
    </div>
  );
}
