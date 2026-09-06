import { photoUrl } from "@/lib/photo";
import type { Invitation, Line } from "./types";

/**
 * Share/OG metadata derived from an invitation's structured content.
 * Shared by the public page's <generateMetadata> and the in-app share (KakaoTalk / copy).
 */
export type InvitationMeta = { title: string; description: string; image: string };

export function lineText(lines: Line[] | undefined): string {
  if (!lines) return "";
  return lines
    .map((l) => (typeof l === "string" ? l : l.map((r) => (typeof r === "string" ? r : r.text)).join("")))
    .join(" ")
    .trim();
}

export function invitationMeta(inv: Invitation): InvitationMeta {
  const cover = inv.sections.find((s) => s.type === "cover");
  let title = "초대장";
  let image = "hero_flatlay";
  if (cover && cover.type === "cover") {
    if (cover.content.names?.length) title = cover.content.names.filter((n) => n.trim()).join(" · ") || title;
    else if (cover.content.title) title = cover.content.title;
    else if (cover.content.titleLines) title = lineText(cover.content.titleLines) || title;
    if (cover.content.image) image = cover.content.image;
  }

  const parts: string[] = [];
  const d = inv.sections.find((s) => s.type === "date" || s.type === "details" || s.type === "gInfo");
  const l = inv.sections.find((s) => s.type === "location");
  if (d && "title" in d.content) parts.push(lineText(d.content.title).split("\n")[0]);
  if (l && "title" in l.content) parts.push(lineText(l.content.title));
  const description = parts.filter(Boolean).join(" · ") || "초대장을 확인하고 참석 여부를 알려주세요.";

  return { title, description, image: photoUrl(image) };
}
