"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

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

const CARDS: Card[] = [
  { slug: "jisoo-minjun", img: "romantic_wedding", status: "published", cat: "Wedding · Romantic", title: "지수 · 민준의 결혼식에 초대합니다", date: "2026.05.24", time: "Sat 12:00", dday: "D-92", analytics: [{ v: "1.2K", l: "Views" }, { v: "168", l: "RSVP" }, { v: "92%", l: "Attend" }], actions: ["편집", "미리보기", "공유 →"] },
  { slug: "appa-60", img: "minimal_birthday", status: "unlisted", cat: "Birthday · Minimal", title: "아빠의 60번째 생신에 모여요", date: "2026.06.15", time: "Mon 18:30", dday: "D-114", analytics: [{ v: "48", l: "Views" }, { v: "14", l: "RSVP" }, { v: "—", l: "Attend" }], actions: ["편집", "미리보기", "공유 →"] },
  { slug: "jibdeuli", img: "cute_housewarming", status: "draft", cat: "Housewarming · Cute", title: "새 집으로 이사했어요 :)", date: "2026.04.05", time: "Sun 15:00", dday: "D-42", analytics: [{ v: "—", l: "Views" }, { v: "—", l: "RSVP" }, { v: "78%", l: "Ready" }], actions: ["편집 계속", "미리보기", "발행"] },
  { img: "editorial_party", status: "published", cat: "Party · Editorial", title: "After Hours · 봄 파티 초대", date: "2026.03.28", time: "Sat 20:00", dday: "D-34", analytics: [{ v: "842", l: "Views" }, { v: "65", l: "RSVP" }, { v: "88%", l: "Attend" }], actions: ["편집", "미리보기", "공유 →"] },
  { img: "tmpl_doljanchi", status: "draft", cat: "Doljanchi · Warm", title: "우리 하은이 첫 생일이에요", date: "2026.07.02", time: "Thu 12:00", dday: "D-131", analytics: [{ v: "—", l: "Views" }, { v: "—", l: "RSVP" }, { v: "42%", l: "Ready" }], actions: ["편집 계속", "미리보기", "발행"] },
  { slug: "jogi-battle", img: "battle_sports", status: "past", cat: "Sports · Battle", title: "조기축구 배틀 · 3월 정기전", date: "2025.12.28", time: "Sun 07:00", dday: "완료", analytics: [{ v: "2.1K", l: "Views" }, { v: "124", l: "RSVP" }, { v: "96%", l: "Attend" }], actions: ["복제", "미리보기", "보관"] },
];

const STATS = [
  { lbl: "Active · Upcoming", val: "3", u: "개", sub: <>이번 달 · <b>2개 발행 예정</b></>, featured: true },
  { lbl: "Total Invitations", val: "12", u: "", sub: <>누적 · <b>+2</b> vs. 지난달</>, featured: false },
  { lbl: "Total Views", val: "4.8", u: "K", sub: <>모든 초대장 합산</>, featured: false },
  { lbl: "RSVP Responses", val: "247", u: "", sub: <>참석 <b>168</b> · 미정 <b>52</b> · 불참 27</>, featured: false },
];

const NAV = [
  { label: "내 초대장", icon: "ic-grid", count: String(CARDS.length), active: true },
  { label: "즐겨찾기", icon: "ic-heart", count: "3" },
  { label: "행사 캘린더", icon: "ic-clock" },
  { label: "RSVP 응답", icon: "ic-users", count: "247" },
];

const TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "draft", label: "Draft" },
  { key: "unlisted", label: "Unlisted" },
  { key: "published", label: "Published" },
  { key: "past", label: "Past" },
];

export function DashboardClient() {
  const [tab, setTab] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: CARDS.length };
    for (const card of CARDS) c[card.status] = (c[card.status] ?? 0) + 1;
    return c;
  }, []);

  const filtered = CARDS.filter(
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
          <div className="sb-avatar" style={{ width: 32, height: 32, fontSize: 14 }}>지</div>
        </div>

        <div className="sb-group">Workspace</div>
        {NAV.map((n) => (
          <button key={n.label} className={`sb-item${n.active ? " active" : ""}`} type="button">
            <Icon name={n.icon} className="ic" />
            {n.label}
            {n.count && <span className="count">{n.count}</span>}
          </button>
        ))}

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
          <div className="sb-avatar">지</div>
          <div className="sb-user">
            <div className="n">유지수</div>
            <div className="p">PLUS PLAN</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        <div className="head">
          <div>
            <div className="head-eyebrow">Dashboard</div>
            <h1 className="head-title">안녕하세요, <em>지수</em>님.</h1>
            <div className="head-sub">지금까지 12개의 초대장을 만드셨어요. 이번 달 발행 예정 2개.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="outline">가이드 보기</Button>
            <Link href="/new" style={{ textDecoration: "none" }}>
              <Button variant="primary">+ 새 초대장</Button>
            </Link>
          </div>
        </div>

        <div className="stats">
          {STATS.map((s) => (
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
                    {c.analytics.map((a, i) => (
                      <div className="a" key={i}>
                        <div className="av">{a.v}</div>
                        <div className="al">{a.l}</div>
                      </div>
                    ))}
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
