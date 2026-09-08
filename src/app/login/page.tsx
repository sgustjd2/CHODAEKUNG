"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { authEnabled, createBrowserSupabase } from "@/lib/db/supabase-browser";
import "./login.css";

/** Supabase returns English auth errors — show Korean instead. */
function friendlyAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) return "이미 가입된 이메일이에요. 로그인해 주세요.";
  if (m.includes("invalid login credentials")) return "이메일 또는 비밀번호가 맞지 않아요.";
  if (m.includes("email not confirmed")) return "가입 확인 메일의 링크를 먼저 눌러 가입을 완료해 주세요.";
  if (m.includes("password") && m.includes("6")) return "비밀번호는 6자 이상이어야 해요.";
  if (m.includes("invalid format") || m.includes("unable to validate email")) return "이메일 형식을 확인해 주세요.";
  if (m.includes("rate limit") || m.includes("too many")) return "요청이 많아요. 잠시 후 다시 시도해 주세요.";
  return "문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [gatedCreate, setGatedCreate] = useState(false);

  // Arriving from the create/edit gate → a first-time visitor with no account. Default to signup
  // (not login), and explain why they're here.
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n && (n.startsWith("/new") || n.startsWith("/editor"))) {
      setGatedCreate(true);
      setMode("signup");
    }
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authEnabled()) {
      setMsg({ ok: false, text: "백엔드가 아직 설정되지 않았어요 (.env.local의 Supabase 키 필요)." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const sb = createBrowserSupabase();
    // Return to the page that sent us here (?next=), guarding against open redirects.
    const rawNext = new URLSearchParams(window.location.search).get("next");
    const dest = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({ email, password: pw });
        if (error) setMsg({ ok: false, text: friendlyAuthError(error.message) });
        else if (data.session) {
          router.push(dest);
          router.refresh();
        } else {
          setMsg({ ok: true, text: "확인 메일을 보냈어요. 메일의 링크를 눌러 가입을 완료한 뒤 로그인하세요." });
          setMode("login");
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) setMsg({ ok: false, text: friendlyAuthError(error.message) });
        else {
          router.push(dest);
          router.refresh();
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo" aria-label="홈으로">
          <Logo />
        </Link>
        <div className="auth-eb">{mode === "login" ? "Welcome back" : "Create account"}</div>
        <h1 className="auth-title">{mode === "login" ? "로그인" : "회원가입"}</h1>
        <p className="auth-sub">{gatedCreate ? "초대장을 만들려면 먼저 가입해 주세요 — 이메일만 있으면 돼요." : mode === "login" ? "내 초대장을 관리하려면 로그인하세요." : "가입하면 만든 초대장을 계정에서 관리할 수 있어요."}</p>

        <form onSubmit={submit}>
          <label className="auth-field">
            <span>이메일</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" autoFocus />
          </label>
          <label className="auth-field">
            <span>비밀번호</span>
            <input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="6자 이상" autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </label>
          {msg && <div className={`auth-msg${msg.ok ? " ok" : ""}`}>{msg.text}</div>}
          <button type="submit" className="auth-btn" disabled={busy}>
            {busy ? "처리 중…" : mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <button type="button" onClick={() => { setMode("signup"); setMsg(null); }}>회원가입</button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{" "}
              <button type="button" onClick={() => { setMode("login"); setMsg(null); }}>로그인</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
