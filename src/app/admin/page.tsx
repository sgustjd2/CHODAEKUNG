import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/db/supabase-server";
import { getAdminUser } from "@/lib/db/admin";
import { loadAdminData } from "@/lib/invitation/admin-store";
import { AdminClient } from "@/components/admin/admin-client";
import "./admin.css";

export const metadata: Metadata = {
  title: "관리자 · 초대쿵",
  robots: { index: false, follow: false },
};

// Admin console — requires an admin account (public.admins). Non-admins are redirected away
// without revealing the console (dashboard if signed in, login otherwise).
export default async function AdminPage() {
  const admin = await getAdminUser();
  if (!admin) {
    const user = await getCurrentUser();
    redirect(user ? "/dashboard" : "/login");
  }
  const data = await loadAdminData();
  return <AdminClient adminEmail={admin.email ?? ""} data={data} />;
}
