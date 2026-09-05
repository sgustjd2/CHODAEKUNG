import type { Metadata } from "next";
import { getPublishedInvitation } from "@/lib/invitation/store";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import type { Invitation, Line } from "@/lib/invitation/types";
import "@/components/viewer/viewer.css";

function lineText(lines: Line[] | undefined): string {
  if (!lines) return "";
  return lines.map((l) => (typeof l === "string" ? l : l.map((r) => (typeof r === "string" ? r : r.text)).join(""))).join(" ").trim();
}
function ogTitle(inv: Invitation): string {
  const cover = inv.sections.find((s) => s.type === "cover");
  if (cover && cover.type === "cover") {
    if (cover.content.names?.length) return cover.content.names.join(" · ");
    if (cover.content.title) return cover.content.title;
    if (cover.content.titleLines) return lineText(cover.content.titleLines);
  }
  return "초대장";
}
function ogDesc(inv: Invitation): string {
  const parts: string[] = [];
  const d = inv.sections.find((s) => s.type === "date" || s.type === "details" || s.type === "gInfo");
  const l = inv.sections.find((s) => s.type === "location");
  if (d && "title" in d.content) parts.push(lineText(d.content.title).split("\n")[0]);
  if (l && "title" in l.content) parts.push(lineText(l.content.title));
  return parts.filter(Boolean).join(" · ") || "초대장을 확인하고 참석 여부를 알려주세요.";
}
function ogImage(inv: Invitation): string {
  const cover = inv.sections.find((s) => s.type === "cover");
  const img = cover && "image" in cover.content ? (cover.content.image as string) : "";
  return `/assets/photos/${img || "hero_flatlay"}.jpg`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getPublishedInvitation(slug);
  const title = ogTitle(inv);
  const description = ogDesc(inv);
  const image = ogImage(inv);
  return {
    title: `${title} · 초대쿵`,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }], type: "website", siteName: "초대쿵" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Reads the published invitation from Supabase when configured; falls back to a bundled sample.
  const invitation = await getPublishedInvitation(slug);
  return <InvitationViewer invitation={invitation} />;
}
