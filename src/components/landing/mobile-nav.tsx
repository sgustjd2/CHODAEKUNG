"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/db/supabase-browser";

/** Compact nav menu for narrow widths (the inline links hide ≤900px). */
export function MobileNav({ authed = false }: { authed?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const logout = async () => {
    try { await createBrowserSupabase().auth.signOut(); } catch { /* ignore */ }
    close();
    router.push("/");
    router.refresh();
  };
  return (
    <div className="mobile-nav">
      <button
        type="button"
        className={`mnav-toggle${open ? " open" : ""}`}
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <>
          <div className="mnav-backdrop" onClick={close} />
          <div className="mnav-panel" role="dialog" aria-label="메뉴">
            <a href="#templates" onClick={close}>템플릿</a>
            <a href="#how" onClick={close}>이렇게 만들어요</a>
            <a href="#kakao" onClick={close}>카카오톡 공유</a>
            <a href="#faq" onClick={close}>자주 묻는 질문</a>
            <div className="mnav-div" />
            {authed ? (
              <>
                <Link href="/dashboard" onClick={close}>내 초대장</Link>
                <Link href="/templates" onClick={close}>템플릿</Link>
                <Link href="/media" onClick={close}>미디어 라이브러리</Link>
                <Link href="/settings" onClick={close}>설정</Link>
                <button type="button" onClick={logout} style={{ background: "none", border: "none", textAlign: "left", font: "inherit", color: "var(--wax-deep, #C25C5C)", cursor: "pointer", padding: 0 }}>로그아웃</button>
              </>
            ) : (
              <Link href="/login" onClick={close}>로그인</Link>
            )}
            <Link className="btn btn-primary" href="/new" onClick={close}>무료로 만들기</Link>
          </div>
        </>
      )}
    </div>
  );
}
