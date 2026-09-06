"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { listMyRsvpsAction, listRsvpsAction } from "@/lib/invitation/actions";
import type { RsvpRow } from "@/lib/invitation/store";

type Resp = "yes" | "no" | "maybe";
type Row = { name: string; response: Resp; plus: string; side: string; msg: string; time: string };

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}
function toRow(r: RsvpRow): Row {
  const resp: Resp = /참석|yes/i.test(r.response) ? "yes" : /불참|no/i.test(r.response) ? "no" : "maybe";
  return { name: r.name, response: resp, plus: r.guests > 1 ? `+${r.guests - 1}` : "—", side: "—", msg: r.message || "—", time: relTime(r.createdAt) };
}

const ROWS: Row[] = [
  { name: "김서연", response: "yes", plus: "+2", side: "신부측", msg: "축하해요! 오랜만에 얼굴 볼 수 있겠네요 :)", time: "2분 전" },
  { name: "박준호", response: "yes", plus: "+1", side: "신랑측", msg: "진심으로 축하드립니다. 두 분 오래오래 행복하세요.", time: "14분 전" },
  { name: "이지현", response: "maybe", plus: "—", side: "신부측", msg: "일정 확인해보고 다시 답장 드릴게요", time: "1시간 전" },
  { name: "최민서", response: "yes", plus: "+3", side: "신랑측", msg: "가족 모두 함께 참석하겠습니다 :)", time: "2시간 전" },
  { name: "정하늘", response: "no", plus: "—", side: "신부측", msg: "그날 해외 출장이라 못 갈 것 같아요 ㅠㅠ 미리 축하해요", time: "4시간 전" },
  { name: "강태윤", response: "yes", plus: "—", side: "신랑측", msg: "축하해!!! 진짜 축하해!!!", time: "어제" },
  { name: "윤소영", response: "yes", plus: "+1", side: "신부측", msg: "두 분의 앞날을 축복합니다", time: "어제" },
  { name: "홍준영", response: "maybe", plus: "—", side: "신랑측", msg: "—", time: "2일 전" },
  { name: "문재원", response: "yes", plus: "+2", side: "신랑측", msg: "가족 모두 축하드리러 갑니다", time: "3일 전" },
];

const CHIPS: { key: string; label: string; count: number }[] = [
  { key: "all", label: "전체", count: 247 },
  { key: "yes", label: "참석", count: 168 },
  { key: "no", label: "불참", count: 27 },
  { key: "maybe", label: "미정", count: 52 },
  { key: "groom", label: "신랑측", count: 120 },
  { key: "bride", label: "신부측", count: 127 },
];
const RESP_LABEL: Record<Resp, string> = { yes: "참석", no: "불참", maybe: "미정" };

type Stat = { dark: boolean; lbl: string; val: string; u: string; sub: ReactNode; barW: string; barC: string; valC?: string };
const DEMO_STATS: Stat[] = [
  { dark: true, lbl: "Total Responses", val: "247", u: "/280", sub: <>응답률 <b>88%</b></>, barW: "88%", barC: "var(--gold)", valC: undefined },
  { dark: false, lbl: "참석 · Attend", val: "168", u: "", sub: <>동반 포함 <b>+42명</b></>, barW: "68%", barC: "var(--sage)", valC: "var(--sage-deep)" },
  { dark: false, lbl: "불참 · Decline", val: "27", u: "", sub: <>11% of total</>, barW: "11%", barC: "var(--wax)", valC: "var(--wax-deep)" },
  { dark: false, lbl: "미정 · Pending", val: "52", u: "", sub: <>21% of total</>, barW: "21%", barC: "var(--lilac)", valC: "var(--lilac-deep)" },
];

export function RsvpClient() {
  const [chip, setChip] = useState("all");
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState("");
  const [liveRows, setLiveRows] = useState<Row[] | null>(null);
  const [access, setAccess] = useState<"demo" | "loading" | "live" | "denied">("demo");
  const [hydrated, setHydrated] = useState(false); // gate first paint so a slug URL never flashes the demo

  // /rsvp?slug=… → real responses: signed-in owner first (works on any device), else the link edit-token.
  useEffect(() => {
    setHydrated(true);
    const s = new URLSearchParams(window.location.search).get("slug")?.trim();
    if (!s) return; // no slug → marketing/demo showcase
    setSlug(s);
    setAccess("loading");
    let token = "";
    try {
      token = localStorage.getItem(`chodaekung:editor:token:${s}`) || "";
    } catch {
      /* ignore */
    }
    (async () => {
      let res = await listMyRsvpsAction(s);
      if (!res.ok && token) res = await listRsvpsAction(s, token);
      if (res.ok) {
        setLiveRows(res.rows.map(toRow));
        setAccess("live");
      } else {
        setAccess("denied");
      }
    })();
  }, []);

  const isLive = access === "live";
  const rows = isLive ? liveRows ?? [] : access === "demo" ? ROWS : [];
  const total = rows.length;
  const nYes = rows.filter((r) => r.response === "yes").length;
  const nNo = rows.filter((r) => r.response === "no").length;
  const nMaybe = rows.filter((r) => r.response === "maybe").length;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const countFor = (key: string) =>
    key === "all" ? rows.length : key === "groom" ? rows.filter((r) => r.side === "신랑측").length : key === "bride" ? rows.filter((r) => r.side === "신부측").length : rows.filter((r) => r.response === key).length;

  const chips = isLive ? CHIPS.filter((c) => ["all", "yes", "no", "maybe"].includes(c.key)) : CHIPS;

  const filtered = rows.filter((r) => {
    const chipOk =
      chip === "all" ||
      chip === r.response ||
      (chip === "groom" && r.side === "신랑측") ||
      (chip === "bride" && r.side === "신부측");
    return chipOk && (q.trim() === "" || r.name.includes(q.trim()));
  });

  const stats: Stat[] = isLive
    ? [
        { dark: true, lbl: "Total Responses", val: String(total), u: "", sub: <>실시간 집계</>, barW: "100%", barC: "var(--gold)" },
        { dark: false, lbl: "참석 · Attend", val: String(nYes), u: "", sub: <>{pct(nYes)}% of total</>, barW: `${pct(nYes)}%`, barC: "var(--sage)", valC: "var(--sage-deep)" },
        { dark: false, lbl: "불참 · Decline", val: String(nNo), u: "", sub: <>{pct(nNo)}% of total</>, barW: `${pct(nNo)}%`, barC: "var(--wax)", valC: "var(--wax-deep)" },
        { dark: false, lbl: "미정 · Pending", val: String(nMaybe), u: "", sub: <>{pct(nMaybe)}% of total</>, barW: `${pct(nMaybe)}%`, barC: "var(--lilac)", valC: "var(--lilac-deep)" },
      ]
    : DEMO_STATS;

  // Donut segment lengths (live); circle circumference ≈ 345.
  const C = 345;
  const seg = (n: number) => (total ? (n / total) * C : 0);

  const exportCsv = () => {
    const header = isLive ? ["이름", "응답", "동반", "메시지", "응답시간"] : ["이름", "응답", "동반", "측", "메시지", "응답시간"];
    const body = filtered.map((r) => (isLive ? [r.name, RESP_LABEL[r.response], r.plus, r.msg, r.time] : [r.name, RESP_LABEL[r.response], r.plus, r.side, r.msg, r.time]));
    const csv = [header, ...body]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp${isLive && slug ? "-" + slug : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // First paint / loading a slug's data / no access → chrome + a centered message (never the demo).
  if (!hydrated || access === "loading" || access === "denied") {
    return (
      <div className="rsvp">
        <div className="top">
          <Link className="top-logo" href="/dashboard">
            <Logo />
          </Link>
          <div className="top-crumb">DASHBOARD · <b>RSVP</b></div>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">← 대시보드</Button>
          </Link>
        </div>
        <div className="wrap">
          <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--muted)" }}>
            {access === "denied" ? (
              <>
                <h2 style={{ marginBottom: 8, color: "var(--ink)" }}>응답을 볼 수 없어요</h2>
                <p>이 초대장의 응답은 소유자만 볼 수 있어요. 로그인 상태를 확인하거나, 초대장을 발행한 기기에서 다시 시도해주세요.</p>
              </>
            ) : (
              <p>불러오는 중…</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp">
      <div className="top">
        <Link className="top-logo" href="/dashboard">
          <Logo />
        </Link>
        <div className="top-crumb">DASHBOARD · INVITATIONS · <b>RSVP</b></div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">← 대시보드</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={exportCsv}>CSV 내보내기</Button>
        </div>
      </div>

      <div className="wrap">
        <div className="head">
          <div>
            <div className="head-eb">RSVP Responses</div>
            <h1 className="head-title">응답 <em>대시보드</em></h1>
            <div className="head-sub">실시간으로 참석자 응답을 확인하세요. 개인정보는 안전하게 보관됩니다.</div>
          </div>
          {isLive ? (
            <div className="inv-mini">
              <div className="thumb" style={{ background: "var(--paper-2)" }} />
              <div className="info">
                <div className="t">{slug}</div>
                <div className="m">응답 {total}건 <span className="badge">LIVE</span></div>
              </div>
            </div>
          ) : (
            <div className="inv-mini">
              <div className="thumb" style={{ backgroundImage: "url('/assets/photos/romantic_wedding.jpg')" }} />
              <div className="info">
                <div className="t">지수 · 민준의 결혼식</div>
                <div className="m">2026.05.24 · SAT · 12:00 <span className="badge">Published</span></div>
              </div>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="stats">
          {stats.map((s) => (
            <div className={`stat${s.dark ? " dark" : ""}`} key={s.lbl}>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-val" style={s.valC ? { color: s.valC } : undefined}>
                {s.val}
                {s.u && <span className="u">{s.u}</span>}
              </div>
              <div className="stat-sub">{s.sub}</div>
              <div className="stat-bar"><div className="fill" style={{ width: s.barW, background: s.barC }} /></div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="chart-row" style={isLive ? { gridTemplateColumns: "1fr" } : undefined}>
          {!isLive && (
            <div className="chart-card">
              <div className="chart-head">
                <div>
                  <div className="chart-t">응답 추이 · 최근 30일</div>
                  <div className="chart-s" style={{ marginTop: 4 }}>DAILY RESPONSES</div>
                </div>
              </div>
              <div className="chart">
                <svg viewBox="0 0 600 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="600" y2="50" stroke="var(--line)" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="var(--line)" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="var(--line)" strokeDasharray="4" />
                  <path d="M 0 180 L 60 170 L 120 155 L 180 140 L 240 128 L 300 118 L 360 105 L 420 90 L 480 75 L 540 60 L 600 45 L 600 200 L 0 200 Z" fill="rgba(181,202,178,0.25)" />
                  <path d="M 0 180 L 60 170 L 120 155 L 180 140 L 240 128 L 300 118 L 360 105 L 420 90 L 480 75 L 540 60 L 600 45" fill="none" stroke="var(--sage-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 0 175 L 60 160 L 120 140 L 180 120 L 240 105 L 300 88 L 360 75 L 420 60 L 480 45 L 540 32 L 600 22" fill="none" stroke="var(--wax)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="600" cy="22" r="5" fill="var(--wax)" />
                  <circle cx="600" cy="22" r="10" fill="rgba(227,139,139,0.2)" />
                </svg>
              </div>
              <div className="chart-x">
                <span>2/28</span><span>3/2</span><span>3/4</span><span>3/6</span><span>3/8</span><span>3/10</span><span>3/12</span><span>오늘</span>
              </div>
            </div>
          )}

          <div className="chart-card">
            <div className="chart-head">
              <div>
                <div className="chart-t">응답 구성</div>
                <div className="chart-s" style={{ marginTop: 4 }}>RESPONSE BREAKDOWN</div>
              </div>
            </div>
            <div className="donut-wrap">
              <div className="donut">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="55" fill="none" stroke="var(--paper-2)" strokeWidth="16" />
                  {isLive ? (
                    <>
                      {nYes > 0 && <circle cx="70" cy="70" r="55" fill="none" stroke="var(--sage-deep)" strokeWidth="16" strokeDasharray={`${seg(nYes)} ${C}`} />}
                      {nNo > 0 && <circle cx="70" cy="70" r="55" fill="none" stroke="var(--wax)" strokeWidth="16" strokeDasharray={`${seg(nNo)} ${C}`} strokeDashoffset={-seg(nYes)} />}
                      {nMaybe > 0 && <circle cx="70" cy="70" r="55" fill="none" stroke="var(--lilac-deep)" strokeWidth="16" strokeDasharray={`${seg(nMaybe)} ${C}`} strokeDashoffset={-(seg(nYes) + seg(nNo))} />}
                    </>
                  ) : (
                    <>
                      <circle cx="70" cy="70" r="55" fill="none" stroke="var(--sage-deep)" strokeWidth="16" strokeDasharray="235 345" strokeLinecap="round" />
                      <circle cx="70" cy="70" r="55" fill="none" stroke="var(--wax)" strokeWidth="16" strokeDasharray="38 345" strokeDashoffset="-236" strokeLinecap="round" />
                      <circle cx="70" cy="70" r="55" fill="none" stroke="var(--lilac-deep)" strokeWidth="16" strokeDasharray="72 345" strokeDashoffset="-278" strokeLinecap="round" />
                    </>
                  )}
                </svg>
                <div className="donut-center">
                  <div className="n">{isLive ? total : 247}</div>
                  <div className="l">Total</div>
                </div>
              </div>
              <div className="legend">
                <div className="lg-item"><div className="sw" style={{ background: "var(--sage-deep)" }} /><span className="k">참석</span><span className="v">{isLive ? nYes : 168}</span><span className="p">{isLive ? pct(nYes) : 68}%</span></div>
                <div className="lg-item"><div className="sw" style={{ background: "var(--wax)" }} /><span className="k">불참</span><span className="v">{isLive ? nNo : 27}</span><span className="p">{isLive ? pct(nNo) : 11}%</span></div>
                <div className="lg-item"><div className="sw" style={{ background: "var(--lilac-deep)" }} /><span className="k">미정</span><span className="v">{isLive ? nMaybe : 52}</span><span className="p">{isLive ? pct(nMaybe) : 21}%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-head">
            <div>
              <div className="chart-t">참석자 명단</div>
              <div className="chart-s" style={{ marginTop: 4 }}>{isLive ? `${rows.length} RESPONSES · LIVE` : "247 RESPONSES · LAST UPDATED 방금 전"}</div>
            </div>
            <div className="table-actions">
              <div className="search-mini">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
                </svg>
                <input placeholder="이름 검색" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Button variant="primary" size="sm" onClick={exportCsv}>CSV 다운로드</Button>
            </div>
          </div>
          <div className="filter-chips">
            {chips.map((c) => (
              <button key={c.key} className={`fc${chip === c.key ? " active" : ""}`} onClick={() => setChip(c.key)}>
                {c.label} <span className="c">{isLive ? countFor(c.key) : c.count}</span>
              </button>
            ))}
          </div>
          <div className="rsvp-table-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }} />
                  <th>이름</th>
                  <th>응답</th>
                  <th>동반</th>
                  <th>측</th>
                  <th>메시지</th>
                  <th style={{ textAlign: "right" }}>응답 시간</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.name}>
                    <td><input type="checkbox" /></td>
                    <td className="name">{r.name}</td>
                    <td><span className={`badge-tag ${r.response}`}><span className="d" />{RESP_LABEL[r.response]}</span></td>
                    <td>{r.plus}</td>
                    <td>{r.side}</td>
                    <td className="msg-cell">{r.msg}</td>
                    <td className="t-right">{r.time}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--fg-3)", padding: "32px" }}>{isLive && total === 0 ? "아직 응답이 없어요." : "검색 결과가 없어요."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <div>SHOWING {filtered.length} OF {isLive ? rows.length : 247}</div>
            <div style={{ display: "flex", gap: 4 }}>
              <Button variant="ghost" size="sm">← 이전</Button>
              <Button variant="ghost" size="sm">다음 →</Button>
            </div>
          </div>
        </div>

        {/* PRIVACY */}
        <div className="privacy">
          <div className="ic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h5>참석자 개인정보 보호</h5>
            <p>수집된 정보는 초대장 제작자만 볼 수 있어요. 공개 페이지에서 참석자 명단은 표시되지 않으며, 언제든지 <a href="/privacy" target="_blank" rel="noopener">개인정보 처리방침</a>에 따라 삭제·보관 정책을 관리할 수 있습니다. RSVP 응답은 초대장 발행 후 6개월간 보관됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
