import type { Metadata } from "next";
import { getPublishedInvitation } from "@/lib/invitation/store";
import { invitationMeta } from "@/lib/invitation/meta";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import "@/components/viewer/viewer.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getPublishedInvitation(slug);
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
  // Reads the published invitation from Supabase when configured; falls back to a bundled sample.
  const invitation = await getPublishedInvitation(slug);
  return <InvitationViewer invitation={invitation} />;
}
