"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { listMyRsvpsAction, listRsvpsAction } from "@/lib/invitation/actions";
import type { RsvpRow } from "@/lib/invitation/store";

type Resp = "yes" | "no" | "maybe";
type Row = { name: string; response: Resp; plus: string; msg: string; time: string; guests?: number };

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
  return { name: r.name, response: resp, plus: r.guests > 1 ? `+${r.guests - 1}` : "—", msg: r.message || "—", time: relTime(r.createdAt), guests: r.guests };
}

const CHIP_DEFS: { key: string; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "yes", label: "참석" },
  { key: "no", label: "불참" },
  { key: "maybe", label: "미정" },
];
const RESP_LABEL: Record<Resp, string> = { yes: "참석", no: "불참", maybe: "미정" };

type Stat = { dark: boolean; lbl: string; val: string; sub: ReactNode; barW: string; barC: string; valC?: string };

export function RsvpClient() {
  const [chip, setChip] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [slug, setSlug] = useState("");
  const [liveRows, setLiveRows] = useState<Row[]>([]);
  const [access, setAccess] = useState<"loading" | "live" | "denied" | "none">("loading");

  // /rsvp?slug=… → real responses: signed-in owner first (works on any device), else the link edit-token.
  // No slug → nothing to show (RSVP is per-invitation); point the user back to the dashboard.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("slug")?.trim();
    if (!s) {
      setAccess("none");
      return;
    }
    setSlug(s);
    setAccess("loading");
    let token = "";
    try {
      token = localStorage.getItem(`chodaekung:editor:token:${s}`) || "";
    } catch {
      /* ignore */
    }
    let alive = true;
    let pollId: ReturnType<typeof setInterval> | undefined;
    // Owner-first (works on any device), else the link edit-token.
    const fetchRows = async (): Promise<Row[] | null> => {
      let res = await listMyRsvpsAction(s);
      if (!res.ok && token) res = await listRsvpsAction(s, token);
      return res.ok ? res.rows.map(toRow) : null;
    };
    (async () => {
      const rows = await fetchRows();
      if (!alive) return;
      if (rows) {
        setLiveRows(rows);
        setAccess("live");
        // The header says "LIVE / 실시간 집계" — make it true: poll so new responses appear
        // without a reload. A transient failure keeps the last good data (never downgrades access).
        pollId = setInterval(async () => {
          const next = await fetchRows();
          if (alive && next) setLiveRows(next);
        }, 15000);
      } else {
        setAccess("denied");
      }
    })();
    return () => {
      alive = false;
      if (pollId) clearInterval(pollId);
    };
  }, []);

  // Back to page 1 whenever the filter or search changes, so results aren't hidden on a stale page.
  useEffect(() => {
    setPage(1);
  }, [chip, q]);

  const rows = liveRows;
  const total = rows.length;
  const nYes = rows.filter((r) => r.response === "yes").length;
  const nNo = rows.filter((r) => r.response === "no").length;
  const nMaybe = rows.filter((r) => r.response === "maybe").length;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  // Total attending headcount = sum of guest counts for 참석 (what catering needs), not just the response count.
  const headcount = rows.filter((r) => r.response === "yes").reduce((s, r) => s + (r.guests ?? 1), 0);

  const countFor = (key: string) => (key === "all" ? rows.length : rows.filter((r) => r.response === key).length);

  const filtered = rows.filter((r) => (chip === "all" || chip === r.response) && (q.trim() === "" || r.name.includes(q.trim())));

  // Pagination: 20 rows per page. clampedPage keeps us in range when the filter shrinks the list.
  const PER_PAGE = 20;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const clampedPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((clampedPage - 1) * PER_PAGE, clampedPage * PER_PAGE);
  const rangeFrom = filtered.length === 0 ? 0 : (clampedPage - 1) * PER_PAGE + 1;
  const rangeTo = Math.min(clampedPage * PER_PAGE, filtered.length);

  const stats: Stat[] = [
    { dark: true, lbl: "Total Responses", val: String(total), sub: <>실시간 집계</>, barW: "100%", barC: "var(--gold)" },
    { dark: false, lbl: "참석 · Attend", val: String(nYes), sub: <>{pct(nYes)}% · 총 {headcount}명</>, barW: `${pct(nYes)}%`, barC: "var(--sage)", valC: "var(--sage-deep)" },
    { dark: false, lbl: "불참 · Decline", val: String(nNo), sub: <>{pct(nNo)}% of total</>, barW: `${pct(nNo)}%`, barC: "var(--wax)", valC: "var(--wax-deep)" },
    { dark: false, lbl: "미정 · Pending", val: String(nMaybe), sub: <>{pct(nMaybe)}% of total</>, barW: `${pct(nMaybe)}%`, barC: "var(--lilac)", valC: "var(--lilac-deep)" },
  ];

  // Donut segment lengths; circle circumference ≈ 345.
  const C = 345;
  const seg = (n: number) => (total ? (n / total) * C : 0);

  const exportCsv = () => {
    const header = ["이름", "응답", "동반", "메시지", "응답시간"];
    const body = filtered.map((r) => [r.name, RESP_LABEL[r.response], r.plus, r.msg, r.time]);
    const csv = [header, ...body]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp${slug ? "-" + slug : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading a slug's data / no access / no invitation selected → chrome + a centered message (never fake data).
  if (access !== "live") {
    return (
      <div className="rsvp">
        <div className="top">
          <Link className="top-logo" href="/dashboard">
            <Logo />
          </Link>
          <div className="top-crumb">DASHBOARD · INVITATIONS · <b>RSVP</b></div>
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
            ) : access === "none" ? (
              <>
                <h2 style={{ marginBottom: 8, color: "var(--ink)" }}>초대장을 선택하세요</h2>
                <p style={{ marginBottom: 20 }}>대시보드에서 초대장의 “응답 보기”를 누르면 실시간 참석 응답을 확인할 수 있어요.</p>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                  <Button variant="primary" size="sm">대시보드로 가기</Button>
                </Link>
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
          <div className="inv-mini">
            <div className="thumb" style={{ background: "var(--paper-2)" }} />
            <div className="info">
              <div className="t">{slug}</div>
              <div className="m">응답 {total}건 <span className="badge">LIVE</span></div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          {stats.map((s) => (
            <div className={`stat${s.dark ? " dark" : ""}`} key={s.lbl}>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-val" style={s.valC ? { color: s.valC } : undefined}>{s.val}</div>
              <div className="stat-sub">{s.sub}</div>
              <div className="stat-bar"><div className="fill" style={{ width: s.barW, background: s.barC }} /></div>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="chart-row" style={{ gridTemplateColumns: "1fr" }}>
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
                  {nYes > 0 && <circle cx="70" cy="70" r="55" fill="none" stroke="var(--sage-deep)" strokeWidth="16" strokeDasharray={`${seg(nYes)} ${C}`} />}
                  {nNo > 0 && <circle cx="70" cy="70" r="55" fill="none" stroke="var(--wax)" strokeWidth="16" strokeDasharray={`${seg(nNo)} ${C}`} strokeDashoffset={-seg(nYes)} />}
                  {nMaybe > 0 && <circle cx="70" cy="70" r="55" fill="none" stroke="var(--lilac-deep)" strokeWidth="16" strokeDasharray={`${seg(nMaybe)} ${C}`} strokeDashoffset={-(seg(nYes) + seg(nNo))} />}
                </svg>
                <div className="donut-center">
                  <div className="n">{total}</div>
                  <div className="l">Total</div>
                </div>
              </div>
              <div className="legend">
                <div className="lg-item"><div className="sw" style={{ background: "var(--sage-deep)" }} /><span className="k">참석</span><span className="v">{nYes}</span><span className="p">{pct(nYes)}%</span></div>
                <div className="lg-item"><div className="sw" style={{ background: "var(--wax)" }} /><span className="k">불참</span><span className="v">{nNo}</span><span className="p">{pct(nNo)}%</span></div>
                <div className="lg-item"><div className="sw" style={{ background: "var(--lilac-deep)" }} /><span className="k">미정</span><span className="v">{nMaybe}</span><span className="p">{pct(nMaybe)}%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-head">
            <div>
              <div className="chart-t">참석자 명단</div>
              <div className="chart-s" style={{ marginTop: 4 }}>{rows.length} RESPONSES · LIVE</div>
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
            {CHIP_DEFS.map((c) => (
              <button key={c.key} className={`fc${chip === c.key ? " active" : ""}`} onClick={() => setChip(c.key)}>
                {c.label} <span className="c">{countFor(c.key)}</span>
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
                  <th>메시지</th>
                  <th style={{ textAlign: "right" }}>응답 시간</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => (
                  <tr key={`${r.name}-${i}`}>
                    <td><input type="checkbox" /></td>
                    <td className="name">{r.name}</td>
                    <td><span className={`badge-tag ${r.response}`}><span className="d" />{RESP_LABEL[r.response]}</span></td>
                    <td>{r.plus}</td>
                    <td className="msg-cell">{r.msg}</td>
                    <td className="t-right">{r.time}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--fg-3)", padding: "32px" }}>{total === 0 ? "아직 응답이 없어요." : "검색 결과가 없어요."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <div>SHOWING {rangeFrom}–{rangeTo} OF {filtered.length}</div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage <= 1}>← 이전</Button>
              <span style={{ fontSize: 12, color: "var(--muted)", minWidth: 48, textAlign: "center" }}>{clampedPage} / {pageCount}</span>
              <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={clampedPage >= pageCount}>다음 →</Button>
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
