"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/db/supabase-browser";

type Note = { kind: "ok" | "err"; text: string } | null;

export function SettingsClient({ email, name, createdAt }: { email: string; name: string; createdAt: string }) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(name);
  const [nameNote, setNameNote] = useState<Note>(null);
  const [nameBusy, setNameBusy] = useState(false);

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwNote, setPwNote] = useState<Note>(null);
  const [pwBusy, setPwBusy] = useState(false);

  const joined = (() => {
    try {
      return createdAt ? new Date(createdAt).toLocaleDateString("ko-KR") : "";
    } catch {
      return "";
    }
  })();

  const saveName = async () => {
    setNameBusy(true);
    setNameNote(null);
    try {
      const { error } = await createBrowserSupabase().auth.updateUser({ data: { name: displayName.trim() } });
      setNameNote(error ? { kind: "err", text: error.message } : { kind: "ok", text: "저장했어요." });
    } catch {
      setNameNote({ kind: "err", text: "저장에 실패했어요." });
    }
    setNameBusy(false);
  };

  const savePassword = async () => {
    setPwNote(null);
    if (pw1.length < 6) return setPwNote({ kind: "err", text: "비밀번호는 6자 이상이어야 해요." });
    if (pw1 !== pw2) return setPwNote({ kind: "err", text: "두 비밀번호가 일치하지 않아요." });
    setPwBusy(true);
    try {
      const { error } = await createBrowserSupabase().auth.updateUser({ password: pw1 });
      if (error) setPwNote({ kind: "err", text: error.message });
      else {
        setPwNote({ kind: "ok", text: "비밀번호를 변경했어요." });
        setPw1("");
        setPw2("");
      }
    } catch {
      setPwNote({ kind: "err", text: "변경에 실패했어요." });
    }
    setPwBusy(false);
  };

  const logout = async () => {
    try {
      await createBrowserSupabase().auth.signOut();
    } catch {
      /* ignore */
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="settings">
      <div className="set-top">
        <Link className="set-logo" href="/">
          <Logo />
        </Link>
        <div className="set-crumb">DASHBOARD · <b>SETTINGS</b></div>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">← 대시보드</Button>
        </Link>
      </div>

      <div className="set-wrap">
        <div className="set-head">
          <div className="set-eb">Account Settings</div>
          <h1 className="set-title">설정</h1>
        </div>

        {/* Account */}
        <section className="set-card">
          <h2>계정</h2>
          <div className="set-field">
            <label>이메일</label>
            <input value={email} readOnly className="set-input readonly" />
            <p className="set-hint">이메일은 변경할 수 없어요{joined ? ` · 가입일 ${joined}` : ""}.</p>
          </div>
          <div className="set-field">
            <label htmlFor="set-name">표시 이름</label>
            <input id="set-name" className="set-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="예: 지수" maxLength={40} />
          </div>
          {nameNote && <div className={`set-note ${nameNote.kind}`}>{nameNote.text}</div>}
          <div className="set-actions">
            <Button variant="primary" size="sm" onClick={saveName} disabled={nameBusy}>
              {nameBusy ? "저장 중…" : "이름 저장"}
            </Button>
          </div>
        </section>

        {/* Password */}
        <section className="set-card">
          <h2>비밀번호 변경</h2>
          <div className="set-field">
            <label htmlFor="set-pw1">새 비밀번호</label>
            <input id="set-pw1" type="password" className="set-input" value={pw1} onChange={(e) => setPw1(e.target.value)} placeholder="6자 이상" autoComplete="new-password" />
          </div>
          <div className="set-field">
            <label htmlFor="set-pw2">새 비밀번호 확인</label>
            <input id="set-pw2" type="password" className="set-input" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="다시 입력" autoComplete="new-password" />
          </div>
          {pwNote && <div className={`set-note ${pwNote.kind}`}>{pwNote.text}</div>}
          <div className="set-actions">
            <Button variant="primary" size="sm" onClick={savePassword} disabled={pwBusy}>
              {pwBusy ? "변경 중…" : "비밀번호 변경"}
            </Button>
          </div>
        </section>

        {/* Session */}
        <section className="set-card">
          <h2>세션</h2>
          <p className="set-hint" style={{ marginTop: 0 }}>이 기기에서 로그아웃해요.</p>
          <div className="set-actions">
            <Button variant="outline" size="sm" onClick={logout}>로그아웃</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
