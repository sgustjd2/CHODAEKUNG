import type { Metadata } from "next";
import { getInvitation } from "@/lib/invitation/samples";
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
  const invitation = getInvitation(slug);
  return <InvitationViewer invitation={invitation} />;
}
