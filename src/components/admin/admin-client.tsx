"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import type { AdminData, AdminInvitation, AdminUser } from "@/lib/invitation/admin-store";
import {
  adminDeleteInvitationAction,
  adminSetVisibilityAction,
  adminSetUserTierAction,
  adminBanUserAction,
  adminDeleteUserAction,
} from "@/lib/invitation/admin-actions";

type Tab = "invitations" | "users";
type Result = { ok: boolean; error?: string };

const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const VIS_LABEL: Record<string, string> = { published: "공개", unlisted: "링크공개", draft: "초안" };

export function AdminClient({ adminEmail, data }: { adminEmail: string; data: AdminData }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("invitations");
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();

  // Run an admin action, surface any error, then reload the server-rendered data on success.
  const run = (label: string, action: () => Promise<Result>) => {
    startTransition(async () => {
      const res = await action();
      if (!res.ok) alert(`${label} 실패: ${res.error ?? "알 수 없는 오류"}`);
      else router.refresh();
    });
  };

  const ql = q.trim().toLowerCase();
  const invs = data.invitations.filter(
    (i) => !ql || i.title.toLowerCase().includes(ql) || i.slug.toLowerCase().includes(ql) || i.ownerEmail.toLowerCase().includes(ql),
  );
  const users = data.users.filter((u) => !ql || u.email.toLowerCase().includes(ql) || u.name.toLowerCase().includes(ql));

  return (
    <div className="admin">
      <div className="adm-top">
        <Link className="adm-logo" href="/dashboard">
          <Logo />
        </Link>
        <div className="adm-crumb">
          ADMIN · <b>콘솔</b>
        </div>
        <span className="adm-who">{adminEmail}</span>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">← 대시보드</Button>
        </Link>
      </div>

      <div className="adm-wrap">
        <div className="adm-eb">CONSOLE</div>
        <h1 className="adm-title">관리자</h1>

        <div className="adm-stats">
          <Stat label="유저" value={data.stats.users} />
          <Stat label="초대장" value={data.stats.invitations} />
          <Stat label="공개중" value={data.stats.published} />
          <Stat label="총 조회" value={data.stats.totalViews} />
        </div>

        <div className="adm-bar">
          <div className="adm-tabs" role="tablist">
            <button role="tab" aria-selected={tab === "invitations"} className={`adm-tab${tab === "invitations" ? " active" : ""}`} onClick={() => setTab("invitations")}>
              초대장 <span className="adm-tab-n">{data.invitations.length}</span>
            </button>
            <button role="tab" aria-selected={tab === "users"} className={`adm-tab${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>
              유저 <span className="adm-tab-n">{data.users.length}</span>
            </button>
          </div>
          <input
            className="adm-search"
            type="search"
            placeholder={tab === "invitations" ? "제목·slug·소유자 검색" : "이메일·닉네임 검색"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="검색"
          />
        </div>

        {tab === "invitations" ? (
          <InvitationTable rows={invs} pending={pending} run={run} />
        ) : (
          <UserTable rows={users} pending={pending} run={run} />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-v">{value.toLocaleString()}</div>
      <div className="adm-stat-l">{label}</div>
    </div>
  );
}

function InvitationTable({ rows, pending, run }: { rows: AdminInvitation[]; pending: boolean; run: (label: string, a: () => Promise<Result>) => void }) {
  if (!rows.length) return <div className="adm-empty">초대장이 없어요.</div>;
  return (
    <div className="adm-tablewrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th>초대장</th>
            <th>소유자</th>
            <th>상태</th>
            <th>티어</th>
            <th className="num">조회</th>
            <th className="num">RSVP</th>
            <th>수정일</th>
            <th className="act">동작</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const live = r.visibility !== "draft";
            return (
              <tr key={r.slug}>
                <td>
                  <div className="adm-title-cell">{r.title || "(제목 없음)"}</div>
                  <div className="adm-sub">{r.slug} · {r.theme}</div>
                </td>
                <td className="adm-owner">{r.ownerEmail}</td>
                <td><span className={`adm-badge vis-${r.visibility}`}>{VIS_LABEL[r.visibility] ?? r.visibility}</span></td>
                <td>{r.tier === "premium" ? <span className="adm-badge tier-premium">프리미엄</span> : <span className="adm-badge">무료</span>}</td>
                <td className="num">{r.views.toLocaleString()}</td>
                <td className="num">{r.rsvpCount.toLocaleString()}</td>
                <td className="adm-sub">{fmtDate(r.updatedAt)}</td>
                <td className="act">
                  <div className="adm-rowbtns">
                    <a className="adm-mini" href={live ? `/i/${r.slug}` : "#"} target={live ? "_blank" : undefined} rel="noopener" aria-disabled={!live} onClick={(e) => { if (!live) e.preventDefault(); }}>열기</a>
                    {r.visibility === "published" ? (
                      <button className="adm-mini" disabled={pending} onClick={() => run("공개중지", () => adminSetVisibilityAction(r.slug, "draft"))}>공개중지</button>
                    ) : (
                      <button className="adm-mini" disabled={pending} onClick={() => run("공개", () => adminSetVisibilityAction(r.slug, "published"))}>공개</button>
                    )}
                    <button
                      className="adm-mini danger"
                      disabled={pending}
                      onClick={() => { if (confirm(`초대장 "${r.title || r.slug}" 을(를) 삭제할까요? RSVP·방명록도 함께 삭제되며 되돌릴 수 없어요.`)) run("삭제", () => adminDeleteInvitationAction(r.slug)); }}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function UserTable({ rows, pending, run }: { rows: AdminUser[]; pending: boolean; run: (label: string, a: () => Promise<Result>) => void }) {
  if (!rows.length) return <div className="adm-empty">유저가 없어요.</div>;
  return (
    <div className="adm-tablewrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>닉네임</th>
            <th className="num">초대장</th>
            <th>가입일</th>
            <th>최근 로그인</th>
            <th>상태</th>
            <th className="act">동작</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => {
            const allPremium = u.invitationCount > 0 && u.premiumCount === u.invitationCount;
            return (
              <tr key={u.id}>
                <td className="adm-owner">{u.email || "(이메일 없음)"}</td>
                <td>{u.name || "—"}</td>
                <td className="num">{u.invitationCount}{u.premiumCount > 0 && <span className="adm-sub"> ({u.premiumCount}P)</span>}</td>
                <td className="adm-sub">{fmtDate(u.createdAt)}</td>
                <td className="adm-sub">{fmtDate(u.lastSignInAt)}</td>
                <td>{u.banned ? <span className="adm-badge tier-banned">정지</span> : <span className="adm-badge">활성</span>}</td>
                <td className="act">
                  <div className="adm-rowbtns">
                    {allPremium ? (
                      <button className="adm-mini" disabled={pending || !u.invitationCount} onClick={() => run("프리미엄 회수", () => adminSetUserTierAction(u.id, "free"))}>프리미엄 회수</button>
                    ) : (
                      <button className="adm-mini" disabled={pending || !u.invitationCount} title={!u.invitationCount ? "초대장이 없어요" : undefined} onClick={() => run("프리미엄 부여", () => adminSetUserTierAction(u.id, "premium"))}>프리미엄 부여</button>
                    )}
                    {u.banned ? (
                      <button className="adm-mini" disabled={pending} onClick={() => run("정지 해제", () => adminBanUserAction(u.id, false))}>정지 해제</button>
                    ) : (
                      <button className="adm-mini" disabled={pending} onClick={() => { if (confirm(`${u.email} 계정을 정지할까요? 로그인이 차단돼요(데이터는 보존).`)) run("정지", () => adminBanUserAction(u.id, true)); }}>정지</button>
                    )}
                    <button
                      className="adm-mini danger"
                      disabled={pending}
                      onClick={() => { if (confirm(`${u.email} 계정을 영구 삭제할까요?\n이 유저의 초대장 ${u.invitationCount}개와 모든 RSVP·방명록이 함께 삭제되며 되돌릴 수 없어요.`)) run("계정 삭제", () => adminDeleteUserAction(u.id)); }}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
