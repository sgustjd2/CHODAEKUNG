import type { Metadata } from "next";
import { getPublishedInvitation } from "@/lib/invitation/store";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import "@/components/viewer/viewer.css";

export const metadata: Metadata = {
  title: "초대장 · 초대쿵",
};

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
