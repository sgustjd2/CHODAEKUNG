"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { Invitation, Line } from "@/lib/invitation/types";

function lineText(lines: Line[] | undefined): string {
  if (!lines) return "";
  return lines
    .map((l) => (typeof l === "string" ? l : l.map((r) => (typeof r === "string" ? r : r.text)).join("")))
    .join(" ");
}
function coverImage(inv: Invitation): string {
  const c = inv.sections.find((s) => s.type === "cover");
  const img = c && "image" in c.content ? (c.content.image as string) : "";
  return img || "hero_flatlay";
}
function ogDesc(inv: Invitation): string {
  const parts: string[] = [];
  const d = inv.sections.find((s) => s.type === "date" || s.type === "details");
  const l = inv.sections.find((s) => s.type === "location");
  if (d && "title" in d.content) parts.push(lineText(d.content.title).split("\n")[0]);
  if (l && "title" in l.content) parts.push(lineText(l.content.title));
  return parts.filter(Boolean).join(" · ");
}

const VIS: { id: "draft" | "unlisted" | "public"; name: string; tag: string; desc: string }[] = [
  { id: "draft", name: "Draft", tag: "나만", desc: "제작자만 볼 수 있는 초안 상태. 아직 준비 중이라면." },
  { id: "unlisted", name: "Unlisted", tag: "링크만", desc: "URL을 아는 사람만 볼 수 있어요. 검색 노출 없음. (권장)" },
  { id: "public", name: "Public", tag: "검색 노출", desc: "누구나 검색·발견할 수 있어요. 크리에이터 템플릿으로 마켓 등록." },
];

export function PublishDialog({
  open,
  onClose,
  invitation,
  title,
}: {
  open: boolean;
  onClose: () => void;
  invitation: Invitation;
  title: string;
}) {
  const [vis, setVis] = useState<"draft" | "unlisted" | "public">("unlisted");
  const [plat, setPlat] = useState<"og" | "kakao" | "qr">("og");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const slug = invitation.slug;
  const img = `/assets/photos/${coverImage(invitation)}.jpg`;
  const desc = ogDesc(invitation);
  const fullUrl = `https://chodaekung.com/i/${slug}`;

  const copy = () => {
    navigator.clipboard?.writeText(fullUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  const nativeShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url: fullUrl }).catch(() => {});
    } else {
      copy();
    }
  };

  return (
    <div
      className={`pub-overlay${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pub-modal">
        <button className="pub-close" aria-label="닫기" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* LEFT: preview */}
        <div className="pub-left">
          <div className="m-eb">Publish &amp; Share</div>
          <h2 className="m-title">
            이제 <em>나눌</em>
            <br />
            시간이에요.
          </h2>
          <p className="m-sub">공유하면 이렇게 보여요. 카카오, 인스타, 문자 어디에서든 자연스러운 초대장 카드가 자동으로 생성됩니다.</p>

          <div className="platform-tabs">
            {(["og", "kakao", "qr"] as const).map((p) => (
              <button key={p} className={`pt${plat === p ? " active" : ""}`} onClick={() => setPlat(p)}>
                {p === "og" ? "Web · OG" : p === "kakao" ? "Kakao" : "QR"}
              </button>
            ))}
          </div>

          {plat === "og" && (
            <div className="og-preview">
              <div className="og-img" style={{ backgroundImage: `url('${img}')` }}>
                <div className="og-badge">Open Graph · 1200 × 630</div>
              </div>
              <div className="og-body">
                <div className="og-title">{title}</div>
                <div className="og-desc">{desc}</div>
                <div className="og-url">
                  <Icon name="moi-mark" viewBox="0 0 48 48" /> chodaekung.com/i/{slug}
                </div>
              </div>
            </div>
          )}

          {plat === "kakao" && (
            <div className="kakao-preview">
              <div className="kh">
                <Icon name="ic-user-group" /> 초대 준비방
              </div>
              <div className="km">
                <div className="kav">나</div>
                <div className="kb">초대장 나왔어요 :) 꼭 와주세요</div>
              </div>
              <div className="kc">
                <div className="kc-img" style={{ backgroundImage: `url('${img}')` }} />
                <div className="kc-b">
                  <div className="kc-t">{title}</div>
                  <div className="kc-s">{desc}</div>
                </div>
                <div className="kc-cta">
                  <span>초대장 보기</span>
                  <span className="a">→</span>
                </div>
              </div>
            </div>
          )}

          {plat === "qr" && (
            <div className="qr-block">
              <div>
                <div className="qr-img">
                  <div className="qr-mid">
                    <Icon name="moi-mark" viewBox="0 0 48 48" />
                  </div>
                </div>
                <div className="qr-cap">스캔해서 초대장 열기</div>
                <div className="qr-url">chodaekung.com/i/{slug}</div>
              </div>
            </div>
          )}

          <div className="pub-note">
            <div className="pub-note-inner">
              <span className="d" />
              <span>모든 준비가 완료되었어요. 발행 후 언제든 편집 가능해요.</span>
            </div>
          </div>
        </div>

        {/* RIGHT: controls */}
        <div className="pub-right">
          <div className="r-section">
            <div className="r-lbl">Step 1 · Visibility</div>
            <div className="r-title">공개 상태를 선택하세요</div>
            <p className="r-desc" style={{ marginBottom: 14 }}>누구에게 보여줄지 결정할 수 있어요. 언제든 대시보드에서 변경 가능해요.</p>
            <div className="vis-group">
              {VIS.map((v) => (
                <button key={v.id} type="button" className={`vis-item${vis === v.id ? " selected" : ""}`} onClick={() => setVis(v.id)}>
                  <span className="vis-radio" />
                  <span className="vis-info">
                    <span className="vis-name">
                      {v.name} <span className="tag">{v.tag}</span>
                    </span>
                    <span className="vis-desc">{v.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="r-section">
            <div className="r-lbl">Step 2 · URL</div>
            <div className="r-title">초대장 링크</div>
            <div className="url-row">
              <div className="u">
                chodaekung.com/i/<b>{slug}</b>
              </div>
              <button className={`btn-copy${copied ? " copied" : ""}`} onClick={copy}>
                <Icon name="ic-copy" /> {copied ? "복사됨" : "복사"}
              </button>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>Pro 플랜에서는 커스텀 도메인 사용 가능 (yourname.moi)</div>
          </div>

          <div className="r-section">
            <div className="r-lbl">Step 3 · Share</div>
            <div className="r-title">공유 방법 선택</div>
            <div className="share-grid">
              <button className="share-btn kakao" onClick={copy}>
                <span className="ic"><Icon name="ic-chat" /></span>
                <span>카카오톡<span className="sub-t" style={{ display: "block" }}>KAKAO SDK</span></span>
              </button>
              <button className="share-btn link" onClick={copy}>
                <span className="ic"><Icon name="ic-link" /></span>
                <span>링크 복사<span className="sub-t" style={{ display: "block" }}>CLIPBOARD</span></span>
              </button>
              <button className="share-btn qr" onClick={() => setPlat("qr")}>
                <span className="ic"><Icon name="ic-qr" /></span>
                <span>QR 코드<span className="sub-t" style={{ display: "block" }}>DOWNLOAD PNG</span></span>
              </button>
              <button className="share-btn native" onClick={nativeShare}>
                <span className="ic"><Icon name="ic-share" /></span>
                <span>OS 공유<span className="sub-t" style={{ display: "block" }}>WEB SHARE API</span></span>
              </button>
            </div>
          </div>

          <div className="pub-foot">
            <Button variant="ghost" style={{ flex: 1 }} onClick={onClose}>에디터로 돌아가기</Button>
            <Button variant="wax" style={{ flex: 1.5 }} onClick={onClose}>발행하기 →</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
