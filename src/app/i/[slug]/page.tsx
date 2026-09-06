import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedInvitation } from "@/lib/invitation/store";
import { invitationMeta } from "@/lib/invitation/meta";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import "@/components/viewer/viewer.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getPublishedInvitation(slug);
  if (!inv) return { title: "초대장을 찾을 수 없어요 · 초대쿵" };
  const { title, description, image } = invitationMeta(inv);
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
  // Live DB invitation when configured, else a curated sample (local/demo). Unknown → 404.
  const invitation = await getPublishedInvitation(slug);
  if (!invitation) notFound();
  return <InvitationViewer invitation={invitation} />;
}
