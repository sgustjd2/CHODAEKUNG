"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/db/supabase-browser";
import type { MyInvitation } from "@/lib/invitation/store";

type Status = "published" | "unlisted" | "draft" | "past";
type Card = {
  slug?: string;
  img: string;
  status: Status;
  cat: string;
  title: string;
  date: string;
  time: string;
  dday: string;
  analytics: { v: string; l: string }[];
  actions: [string, string, string];
};

const THEME_LABEL: Record<string, string> = {
  romantic: "Wedding · Romantic", minimal: "Minimal", cute: "Cute", editorial: "Editorial",
  developer: "Developer", battle: "Sports · Battle", timeline: "Schedule", gaming: "Gaming",
};
const STATUS_LABEL: Record<Status, string> = { published: "발행됨", unlisted: "링크공개", draft: "초안", past: "완료" };

function relDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ko-KR");
  } catch {
    return "";
  }
}
function toCard(inv: MyInvitation): Card {
  const status: Status = inv.visibility === "published" ? "published" : inv.visibility === "unlisted" ? "unlisted" : "draft";
  return {
    slug: inv.slug,
    img: inv.img,
    status,
    cat: THEME_LABEL[inv.theme] ?? inv.theme,
    title: inv.title || inv.slug,
    date: relDate(inv.updatedAt),
    time: "",
    dday: STATUS_LABEL[status],
    analytics: [{ v: String(inv.views), l: "Views" }, { v: String(inv.rsvpCount), l: "RSVP" }, { v: STATUS_LABEL[status], l: "상태" }],
    actions: status === "draft" ? ["편집 계속", "미리보기", "발행"] : ["편집", "미리보기", "공유 →"],
  };
}

const TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "draft", label: "Draft" },
  { key: "unlisted", label: "Unlisted" },
  { key: "published", label: "Published" },
];

export function DashboardClient({ userEmail, myInvitations }: { userEmail: string; myInvitations: MyInvitation[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");

  const cards = useMemo(() => myInvitations.map(toCard), [myInvitations]);
  const name = userEmail.split("@")[0] || "회원";
  const nav = [
    { label: "내 초대장", icon: "ic-grid", count: String(cards.length), active: true },
    { label: "RSVP 응답", icon: "ic-users" as string | undefined },
  ];
  const stats = [
    { lbl: "내 초대장", val: String(cards.length), u: "개", sub: <>계정에 저장됨</>, featured: true },
    { lbl: "발행됨", val: String(cards.filter((c) => c.status === "published").length), u: "", sub: <>공개 링크 활성</>, featured: false },
    { lbl: "링크공개", val: String(cards.filter((c) => c.status === "unlisted").length), u: "", sub: <>Unlisted</>, featured: false },
    { lbl: "초안", val: String(cards.filter((c) => c.status === "draft").length), u: "", sub: <>미발행</>, featured: false },
  ];

  const logout = async () => {
    try {
      await createBrowserSupabase().auth.signOut();
    } catch {
      /* ignore */
    }
    router.push("/login");
    router.refresh();
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: cards.length };
    for (const card of cards) c[card.status] = (c[card.status] ?? 0) + 1;
    return c;
  }, [cards]);

  const filtered = cards.filter(
    (c) => (tab === "all" || c.status === tab) && (q.trim() === "" || c.title.includes(q.trim()))
  );

  return (
    <div className="dash">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <Link className="sb-brand" href="/">
          <svg className="ck-logo" viewBox="0 0 400 140" role="img" aria-label="초대쿵">
            <use href="/assets/moi-symbols.svg#chodaekung-lockup" />
          </svg>
        </Link>

        <div className="sb-cta">
          <Link href="/new" style={{ textDecoration: "none" }}>
            <Button variant="primary">+ 새 초대장 만들기</Button>
          </Link>
        </div>

        <div className="sb-mobile-cta">
          <Link href="/new" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="sm">+ 새 초대장</Button>
          </Link>
          <div className="sb-avatar" style={{ width: 32, height: 32, fontSize: 14 }}>{name.charAt(0).toUpperCase()}</div>
        </div>

        <div className="sb-group">Workspace</div>
        {nav.map((n) =>
          n.label === "RSVP 응답" ? (
            <Link key={n.label} className="sb-item" href="/rsvp">
              <Icon name={n.icon!} className="ic" />
              {n.label}
            </Link>
          ) : (
            <button key={n.label} className="sb-item active" type="button">
              <Icon name={n.icon!} className="ic" />
              {n.label}
              {n.count && <span className="count">{n.count}</span>}
            </button>
          )
        )}

        <div className="sb-group">Library</div>
        <Link className="sb-item" href="/templates">
          <Icon name="ic-book" className="ic" />
          템플릿
        </Link>
        <button className="sb-item" type="button">
          <Icon name="ic-camera" className="ic" />
          미디어 라이브러리
        </button>

        <div className="sb-group">Settings</div>
        <button className="sb-item" type="button">
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          설정
        </button>

        <div className="sb-footer">
          <div className="sb-avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="sb-user">
            <div className="n">{name}</div>
            <div className="p" style={{ textTransform: "none", letterSpacing: 0 }}>{userEmail}</div>
          </div>
          <button type="button" onClick={logout} aria-label="로그아웃" title="로그아웃" style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4, display: "flex" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        <div className="head">
          <div>
            <div className="head-eyebrow">Dashboard</div>
            <h1 className="head-title">안녕하세요, <em>{name}</em>님.</h1>
            <div className="head-sub">
              {cards.length > 0 ? `총 ${cards.length}개의 초대장을 관리하고 있어요.` : "아직 만든 초대장이 없어요. 첫 초대장을 만들어보세요."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="outline">가이드 보기</Button>
            <Link href="/new" style={{ textDecoration: "none" }}>
              <Button variant="primary">+ 새 초대장</Button>
            </Link>
          </div>
        </div>

        <div className="stats">
          {stats.map((s) => (
            <div className={`stat${s.featured ? " featured" : ""}`} key={s.lbl}>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-val">
                {s.val}
                {s.u && <span className="u">{s.u}</span>}
              </div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t.key} className={`tab-btn${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
                {t.label} <span className="c">{counts[t.key] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="right">
            <div className="search-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input placeholder="초대장 검색" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="inv-grid">
          <Link className="inv-empty" href="/new">
            <Icon name="momo-run" viewBox="0 0 240 240" />
            <div className="et">새 <em>초대장</em> 시작</div>
            <div className="es">80종의 템플릿에서 시작하거나 빈 캔버스로 만들어보세요.</div>
          </Link>

          {filtered.map((c) => {
            const preview = c.slug ? `/i/${c.slug}` : "#";
            const editHref = c.slug ? `/editor?slug=${c.slug}` : "/editor";
            return (
              <div className="inv-card" key={c.title}>
                <div className="inv-cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/photos/${c.img}.jpg`} alt="" />
                  <div className={`inv-status ${c.status}`}>
                    {c.status === "published" ? "● Published" : c.status === "unlisted" ? "Unlisted" : c.status === "draft" ? "Draft" : "Past"}
                  </div>
                  <button className="inv-menu" aria-label="더보기">⋯</button>
                </div>
                <div className="inv-info">
                  <div className="inv-cat">{c.cat}</div>
                  <div className="inv-title">{c.title}</div>
                  <div className="inv-date">
                    <span className="d">{c.date}</span>
                    <span>{c.time}</span>
                    {c.status === "past" ? <span style={{ color: "var(--muted)" }}>완료</span> : <span className="dday">{c.dday}</span>}
                  </div>
                  <div className="inv-analytics">
                    {c.analytics.map((a, i) =>
                      a.l === "RSVP" && c.slug ? (
                        <Link className="a" key={i} href={`/rsvp?slug=${c.slug}`} title="응답 보기" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                          <div className="av">{a.v}</div>
                          <div className="al">RSVP →</div>
                        </Link>
                      ) : (
                        <div className="a" key={i}>
                          <div className="av">{a.v}</div>
                          <div className="al">{a.l}</div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="inv-actions">
                    <Link className="ia" href={editHref}>{c.actions[0]}</Link>
                    <Link className="ia" href={preview}>{c.actions[1]}</Link>
                    <Link className="ia share" href={c.status === "draft" ? editHref : preview}>{c.actions[2]}</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
