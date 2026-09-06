import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Seal } from "@/components/ui/seal";
import { Icon } from "@/components/ui/icon";
import { MobileNav } from "@/components/landing/mobile-nav";
import "./landing.css";

const templates: { img: string; cat: string; name: ReactNode }[] = [
  { img: "romantic_wedding", cat: "Wedding · Romantic", name: <>Meadow <em>Love</em></> },
  { img: "minimal_birthday", cat: "Birthday · Minimal", name: <>Quiet <em>Day</em></> },
  { img: "cute_housewarming", cat: "Housewarming · Cute", name: <>Cozy <em>Home</em></> },
  { img: "editorial_party", cat: "Party · Editorial", name: <>After <em>Hours</em></> },
  { img: "tmpl_doljanchi", cat: "Doljanchi · Warm", name: <>First <em>Year</em></> },
];

const steps: { num: string; title: string; body: string; meta: string }[] = [
  {
    num: "01.",
    title: "템플릿 선택",
    body: "이벤트 유형과 스타일에 맞는 템플릿을 고르세요. 80종 중 하나를 선택하면 초대장의 뼈대가 자동으로 준비됩니다.",
    meta: "Wedding · Birthday · Party · +80",
  },
  {
    num: "02.",
    title: "정보 입력",
    body: "사진, 이름, 날짜, 장소를 넣으세요. 폰트와 색상은 즉시 반영됩니다. 원하면 세부 편집도 가능해요.",
    meta: "Photo · Text · Date · Location",
  },
  {
    num: "03.",
    title: "공유하기",
    body: "발행 버튼을 누르면 URL이 생성됩니다. 카카오톡, 링크 복사, QR 등 원하는 방법으로 공유하세요.",
    meta: "Kakao · Link · QR · OS Share",
  },
];

const kakaoPoints: { title: string; desc: string }[] = [
  { title: "공유 버튼 한 번", desc: "Kakao SDK 완전 통합 · 별도 설정 불필요" },
  { title: "자동 OG 카드", desc: "사진·제목·날짜·장소가 담긴 미리보기 카드 자동 생성" },
  { title: "인앱 브라우저 최적화", desc: "카톡·라인·인스타 어디서 열어도 자연스러운 경험" },
];

const faqs: { q: string; a: string; open?: boolean }[] = [
  { q: "무료로 어디까지 만들 수 있나요?", a: "Free 플랜은 초대장 1개, 기본 템플릿, 기본 섹션을 제공합니다. 하단에 작은 초대쿵 워터마크가 표시되지만, 카카오톡 공유·링크 복사·RSVP 기본 기능은 모두 사용할 수 있어요.", open: true },
  { q: "카카오톡 공유 시 사진과 정보가 잘 나오나요?", a: "발행된 초대장의 대표 사진과 제목·날짜가 담긴 Open Graph 카드가 자동 생성됩니다. Kakao Share 카드에는 CTA 버튼이 포함되어 받는 사람이 한 번의 탭으로 초대장을 열 수 있습니다." },
  { q: "참석 여부(RSVP)를 확인할 수 있나요?", a: "네. 초대장 편집기에서 RSVP 섹션을 활성화하면 참석 여부·동반 인원·메시지를 수집할 수 있고, 대시보드에서 실시간으로 응답 통계를 확인할 수 있습니다." },
  { q: "초대장을 비공개로 설정할 수 있나요?", a: "Draft(제작자만) · Unlisted(링크 아는 사람만) · Public(검색 노출)의 세 가지 공개 상태 중 선택할 수 있습니다. 기본값은 Unlisted이며 검색 엔진에 노출되지 않습니다." },
  { q: "모바일에서도 편집할 수 있나요?", a: "초대쿵는 모바일 우선으로 설계되었습니다. 스마트폰에서도 라이브 프리뷰와 바텀시트 편집기로 초대장을 완성할 수 있으며, 데스크탑에서는 3-column 에디터로 더 정밀한 편집이 가능합니다." },
  { q: "다른 사람이 만든 초대장을 살짝 바꿔서 쓸 수 있나요?", a: "본인이 만든 초대장은 언제든지 대시보드에서 \"복제하기\"로 새 초대장을 시작할 수 있어요. 곧 크리에이터 마켓을 통해 다른 사용자의 템플릿을 구매·활용하는 기능도 열릴 예정입니다." },
];

const footerCols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "템플릿", href: "/templates" },
      { label: "새 초대장", href: "/new" },
      { label: "대시보드", href: "/dashboard" },
      { label: "RSVP", href: "/rsvp" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "이용 가이드", href: "/guide" },
      { label: "자주 묻는 질문", href: "/#faq" },
      { label: "개인정보 처리방침", href: "/privacy" },
      { label: "카카오톡 공유", href: "/#kakao" },
      { label: "로그인", href: "/login" },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <Link className="nav-logo" href="/">
            <Logo />
          </Link>
          <div className="nav-links">
            <a href="#templates">템플릿</a>
            <a href="#how">이렇게 만들어요</a>
            <a href="#kakao">카카오톡 공유</a>
            <a href="#faq">자주 묻는 질문</a>
          </div>
          <div className="nav-cta">
            <Link className="btn btn-ghost btn-sm" href="/login">로그인</Link>
            <Link className="btn btn-primary btn-sm" href="/new">무료로 만들기</Link>
          </div>
          <MobileNav />
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="hero-eyebrow">C · H · O · D · A · E · K · U · N · G</div>
          <h1 className="hero-title">
            초대하는
            <br />
            순간까지,
            <br />
            <em>예쁘게.</em>
          </h1>
          <p className="hero-sub">
            사진과 문구만 넣으면 완성되는 나만의 모바일 초대장. 결혼식·돌잔치부터
            러닝, 등산, 조기축구, 스터디, 야구 관람까지 — 어떤 모임이든 카카오톡으로
            바로 나누세요.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" href="/new">무료로 만들기</Link>
            <Link className="btn btn-ghost btn-lg" href="/templates">템플릿 구경하기 →</Link>
          </div>
          <div className="hero-meta">
            <div>
              <div className="k">평균 제작</div>
              <div className="v">10분</div>
            </div>
            <div>
              <div className="k">템플릿</div>
              <div className="v">80+</div>
            </div>
            <div>
              <div className="k">지금 만들어진</div>
              <div className="v">124K</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/photos/hero_flatlay.jpg" alt="편지지 위에 놓인 초대장" />
          <div className="float-card top-left">
            <Icon name="moi-mark" className="fc-icon" viewBox="0 0 48 48" />
            <div>
              <div className="fc-label">Draft · Saved</div>
              <div className="fc-title">지수 · 민준</div>
              <div className="fc-sub">2026.05.24 · Sat 12:00</div>
            </div>
          </div>
          <div className="float-card bottom-right">
            <Seal style={{ width: 44, height: 44, fontSize: 20 }}>M</Seal>
            <div>
              <div className="fc-label">Ready to share</div>
              <div className="fc-title">카카오톡으로 공유하기</div>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section
        id="templates"
        style={{
          background: "var(--card)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="section-wrap">
          <div className="sec-head">
            <div className="sec-eyebrow">Templates</div>
            <h2 className="sec-title">
              모든 <em>모임에</em> 맞는
              <br />
              초대장
            </h2>
            <p className="sec-desc">
              80개 이상의 무료·프리미엄 템플릿. 이벤트 유형과 취향에 맞춰 선택하세요.
            </p>
          </div>
          <div className="templates-row">
            {templates.map((t) => (
              <div className="tpl-card" key={t.img}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/assets/photos/${t.img}.jpg`} alt="" />
                <div className="over">
                  <div className="tpl-cat">{t.cat}</div>
                  <div className="tpl-name">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link className="btn btn-outline btn-lg" href="/templates">전체 템플릿 보기 →</Link>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="steps-section" id="how">
        <div className="section-wrap">
          <div className="sec-head">
            <div className="sec-eyebrow">How it works</div>
            <h2 className="sec-title">
              3단계로 <em>완성</em>
            </h2>
            <p className="sec-desc">
              디자인 지식이 없어도 괜찮아요. 사진과 정보를 넣기만 하면 됩니다.
            </p>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.num}>
                <div className="num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="step-visual">{s.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KAKAO FEATURE */}
      <section id="kakao">
        <div className="section-wrap">
          <div className="feature-row">
            <div>
              <div className="sec-eyebrow" style={{ marginBottom: 12 }}>
                Kakao Share
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 500,
                  fontSize: 48,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.08,
                  marginBottom: 24,
                }}
              >
                단톡방에서
                <br />
                바로 열리는{" "}
                <em style={{ fontWeight: 700, color: "var(--rose)" }}>초대장</em>
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--fg-2)",
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 460,
                }}
              >
                카카오톡 공유 시 대표 사진, 날짜, 장소가 담긴 카드가 자동
                생성됩니다. 받는 사람은 카톡 인앱 브라우저에서 부드럽게 초대장을
                확인할 수 있어요.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {kakaoPoints.map((p, i) => (
                  <div
                    key={p.title}
                    style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                  >
                    <Seal
                      style={{ width: 32, height: 32, fontSize: 14, flexShrink: 0 }}
                    >
                      {i + 1}
                    </Seal>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 13.5, color: "var(--fg-3)" }}>
                        {p.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="feature-visual">
              <div className="kakao-mock">
                <div className="kakao-header">
                  <Icon
                    name="ic-user-group"
                    style={{ width: 16, height: 16, color: "var(--ink)" }}
                  />
                  지수 & 민준 결혼 준비방
                </div>
                <div className="kakao-msg">
                  <div className="kakao-avatar">지</div>
                  <div className="kakao-bubble">
                    청첩장 나왔어요 :) 5월 24일에 꼭 와주세요
                  </div>
                </div>
                <div className="kakao-card">
                  <div className="kc-img" />
                  <div className="kc-body">
                    <div className="kc-title">지수 · 민준의 결혼식에 초대합니다</div>
                    <div className="kc-sub">2026.05.24 · Sat · Seongsu Garden</div>
                  </div>
                  <div className="kc-cta">
                    <span>초대장 보기</span>
                    <span className="arr">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: "var(--paper-2)" }}>
        <div className="section-wrap">
          <div className="sec-head">
            <div className="sec-eyebrow">FAQ</div>
            <h2 className="sec-title">
              자주 묻는 <em>질문</em>
            </h2>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details className="faq-item" key={f.q} open={f.open}>
                <summary>{f.q}</summary>
                <div className="body">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {/* FINAL CTA */}
      <section style={{ textAlign: "center", padding: "120px 32px" }}>
        <div className="section-wrap">
          <Icon
            name="momo-run"
            viewBox="0 0 240 240"
            style={{ width: 88, height: 100, margin: "0 auto 24px", display: "block" }}
          />
          <div className="sec-eyebrow">Ready?</div>
          <h2 className="sec-title" style={{ fontSize: 72 }}>
            지금, 첫 <em>초대장</em>을<br />
            시작하세요.
          </h2>
          <div style={{ marginTop: 40 }}>
            <Link className="btn btn-primary btn-lg" href="/new">무료로 만들기 →</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-wrap">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <p>
              초대하는 순간까지, 예쁘게. 모든 모임의 감성을 담은 모바일 인터랙티브
              초대장.
            </p>
          </div>
          {footerCols.map((col) => (
            <div className="footer-col" key={col.title}>
              <h5>{col.title}</h5>
              {col.links.map((l) => (
                <Link href={l.href} key={l.label}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>© 2026 CHODAEKUNG. All rights reserved.</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            MADE WITH{" "}
            <Icon
              name="ic-heart-fill"
              style={{ width: 12, height: 12, color: "var(--butter)" }}
            />{" "}
            IN SEOUL
          </div>
        </div>
      </footer>
    </div>
  );
}
