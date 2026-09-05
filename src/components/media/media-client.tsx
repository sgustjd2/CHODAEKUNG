"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "@/components/editor/content-editors";
import { listMyMediaAction, deleteMediaAction } from "@/lib/invitation/actions";

type Item = { path: string; url: string };

export function MediaClient() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    const res = await listMyMediaAction();
    if (res.ok) {
      setItems(res.items);
      setStatus("ready");
    } else {
      setStatus("error");
    }
  };
  useEffect(() => {
    load();
  }, []);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  };
  const remove = async (path: string) => {
    if (!window.confirm("이 사진을 삭제할까요? 이 사진을 쓰는 초대장에서도 보이지 않게 돼요.")) return;
    setItems((cur) => (cur ? cur.filter((i) => i.path !== path) : cur)); // optimistic
    const res = await deleteMediaAction(path);
    if (!res.ok) {
      alert(res.error || "삭제에 실패했어요.");
      load();
    }
  };

  return (
    <div className="media">
      <div className="med-top">
        <Link className="med-logo" href="/">
          <Logo />
        </Link>
        <div className="med-crumb">DASHBOARD · <b>MEDIA</b></div>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">← 대시보드</Button>
        </Link>
      </div>

      <div className="med-wrap">
        <div className="med-head">
          <div>
            <div className="med-eb">Media Library</div>
            <h1 className="med-title">미디어 라이브러리</h1>
            <p className="med-sub">업로드한 사진을 모아 보고, URL을 복사해 재사용하거나 정리하세요.</p>
          </div>
          <div className="med-upload">
            <PhotoUpload label="+ 사진 업로드" onUploaded={() => load()} />
          </div>
        </div>

        {status === "loading" && <div className="med-empty">불러오는 중…</div>}
        {status === "error" && <div className="med-empty">사진을 불러오지 못했어요. 로그인 상태와 백엔드 설정을 확인해주세요.</div>}
        {status === "ready" && items && items.length === 0 && (
          <div className="med-empty">
            <p>아직 업로드한 사진이 없어요.</p>
            <p className="med-empty-sub">위 “사진 업로드”로 추가하거나, 편집기에서 커버·갤러리 사진을 올리면 여기에 모여요.</p>
          </div>
        )}
        {status === "ready" && items && items.length > 0 && (
          <div className="med-grid">
            {items.map((it) => (
              <div className="med-item" key={it.path}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.url} alt="" loading="lazy" />
                <div className="med-item-bar">
                  <button type="button" onClick={() => copy(it.url)}>{copied === it.url ? "복사됨!" : "URL 복사"}</button>
                  <button type="button" className="danger" onClick={() => remove(it.path)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
