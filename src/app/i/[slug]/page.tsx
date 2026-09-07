import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedInvitation, isInvitationIndexable } from "@/lib/invitation/store";
import { invitationMeta } from "@/lib/invitation/meta";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import "@/components/viewer/viewer.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getPublishedInvitation(slug);
  if (!inv) return { title: "초대장을 찾을 수 없어요 · 초대쿵" };
  const { title, description, image } = invitationMeta(inv);
  // Keep unlisted invitations out of search (privacy); only explicitly-Public ones are indexable.
  const indexable = await isInvitationIndexable(slug);
  return {
    title: `${title} · 초대쿵`,
    description,
    robots: indexable ? undefined : { index: false, follow: true },
    // No width/height: cover images vary (portrait samples, landscape hero, arbitrary uploads),
    // so declaring a fixed 1200×630 misled scrapers. Let them read the real dimensions.
    openGraph: { title, description, images: [image], type: "website", siteName: "초대쿵" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Live DB invitation when configured, else a curated sample (local/demo). Unknown → 404.
  const invitation = await getPublishedInvitation(slug);
  if (!invitation) notFound();
  return <InvitationViewer invitation={invitation} />;
}
