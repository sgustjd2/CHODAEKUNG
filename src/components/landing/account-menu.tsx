"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authEnabled, createBrowserSupabase } from "@/lib/db/supabase-browser";

/** Dashboard menu items surfaced in the landing account dropdown. RSVP is per-invitation
 *  (reached via each invitation's "응답 보기" on the dashboard), so it's not a top-level entry. */
const ITEMS: { href: string; label: string }[] = [
  { href: "/dashboard", label: "내 초대장" },
  { href: "/templates", label: "템플릿" },
  { href: "/media", label: "미디어 라이브러리" },
  { href: "/settings", label: "설정" },
];

const itemStyle: CSSProperties = {
  display: "block", padding: "9px 12px", borderRadius: 8, textDecoration: "none",
  color: "var(--ink)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", background: "none",
  border: "none", width: "100%", textAlign: "left", cursor: "pointer", font: "inherit",
};

/** Logged-in account menu for the marketing header: an avatar button that opens a dropdown with
 *  the dashboard menu (내 초대장 / RSVP / 템플릿 / 미디어 / 설정) plus 로그아웃. Rendered only when
 *  the server already determined the visitor is signed in. */
export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("회원");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authEnabled()) return;
    createBrowserSupabase()
      .auth.getUser()
      .then(({ data }) => {
        const u = data.user;
        if (!u) return;
        const meta = typeof u.user_metadata?.name === "string" ? u.user_metadata.name.trim() : "";
        setName(meta || (u.email ?? "").split("@")[0] || "회원");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const logout = async () => {
    try { await createBrowserSupabase().auth.signOut(); } catch { /* ignore */ }
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="내 정보"
        onClick={() => setOpen((v) => !v)}
        style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--wax)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        {name.charAt(0).toUpperCase()}
      </button>
      {open && (
        <div
          role="menu"
          style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 60, minWidth: 200, background: "var(--card, #fff)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 12px 32px rgba(26,26,46,0.16)", padding: 6 }}
        >
          <div style={{ padding: "6px 12px 8px", borderBottom: "1px solid var(--line)", marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{name}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>로그인됨</div>
          </div>
          {ITEMS.map((it) => (
            <Link key={it.href} role="menuitem" href={it.href} onClick={() => setOpen(false)} style={itemStyle}>{it.label}</Link>
          ))}
          <div style={{ borderTop: "1px solid var(--line)", margin: "4px 0" }} />
          <button type="button" role="menuitem" onClick={logout} style={{ ...itemStyle, color: "var(--wax-deep, #C25C5C)" }}>로그아웃</button>
        </div>
      )}
    </div>
  );
}
