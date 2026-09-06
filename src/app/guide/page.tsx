import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import "./guide.css";

export const metadata: Metadata = {
  title: "이용 가이드 · 초대쿵",
  description: "초대쿵으로 초대장을 만들고, 발행하고, 카카오톡으로 공유하는 방법을 4단계로 안내해요.",
};

const STEPS: { n: string; title: string; body: string; cta?: { label: string; href: string } }[] = [
  {
    n: "01",
    title: "시작하기",
    body: "이벤트 종류와 테마를 고르거나, 마음에 드는 템플릿에서 바로 시작하세요. 빈 초대장으로 시작할 수도 있어요.",
    cta: { label: "새 초대장 만들기", href: "/new" },
  },
  {
    n: "02",
    title: "편집하기",
    body: "사진과 문구만 채우면 완성돼요. 섹션을 추가·이동·종류 변경하고, 커버 레이아웃과 등장 애니메이션도 고를 수 있어요. 한 번 올린 사진은 라이브러리에서 다시 쓸 수 있어요.",
  },
  {
    n: "03",
    title: "발행하기",
    body: "공개 범위(나만 보기·링크 공개·전체 공개)를 정하고 발행하세요. 발행한 뒤에도 언제든 다시 편집할 수 있어요.",
  },
  {
    n: "04",
    title: "공유하기",
    body: "링크 복사, 카카오톡 공유, QR 코드(PNG 저장), OS 공유까지. 초대장 링크를 어디에 붙여 넣어도 예쁜 미리보기 카드가 자동으로 만들어져요.",
    cta: { label: "템플릿 둘러보기", href: "/templates" },
  },
];

const FEATURES: { icon: string; title: string; body: string }[] = [
  { icon: "ic-grid", title: "8가지 테마", body: "로맨틱·미니멀·큐트·에디토리얼·타임라인·배틀·게이밍·개발자" },
  { icon: "ic-message", title: "모듈형 섹션", body: "커버·문구·날짜·장소·갤러리·일정·RSVP에 테마별 전용 섹션까지" },
  { icon: "ic-pin", title: "지도·장소", body: "카카오맵 주소찾기로 위치를 넣고 지도 핀까지 자동 표시" },
  { icon: "ic-heart", title: "RSVP 수집", body: "참석 여부를 모으고 대시보드에서 응답을 확인" },
  { icon: "ic-qr", title: "QR·카카오 공유", body: "QR 코드를 PNG로 저장해 인쇄하거나 카카오톡으로 바로 공유" },
  { icon: "ic-cover", title: "미디어 라이브러리", body: "한 번 올린 사진을 여러 초대장에서 재사용" },
];

export default function GuidePage() {
  return (
    <div className="guide">
      <div className="guide-top">
        <Link className="guide-logo" href="/" aria-label="초대쿵 홈">
          <Logo />
        </Link>
        <div className="guide-crumb">이용 가이드</div>
        <Link href="/new" className="guide-cta-sm">무료로 만들기</Link>
      </div>

      <div className="guide-wrap">
        <div className="guide-head">
          <div className="guide-eb">How it works</div>
          <h1 className="guide-title">
            10분이면 완성되는<br />나만의 초대장
          </h1>
          <p className="guide-lead">
            사진과 문구만 넣으면 돼요. 만들고, 발행하고, 카카오톡으로 나누기까지 — 아래 4단계면 충분해요.
          </p>
        </div>

        <section className="guide-steps">
          {STEPS.map((s) => (
            <div className="guide-step" key={s.n}>
              <div className="guide-step-n">{s.n}</div>
              <div className="guide-step-body">
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                {s.cta && (
                  <Link href={s.cta.href} className="guide-step-link">
                    {s.cta.label} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="guide-section">
          <h2 className="guide-h2">주요 기능</h2>
          <div className="guide-features">
            {FEATURES.map((f) => (
              <div className="guide-feat" key={f.title}>
                <span className="guide-feat-ic">
                  <Icon name={f.icon} />
                </span>
                <div>
                  <div className="guide-feat-t">{f.title}</div>
                  <div className="guide-feat-d">{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-final">
          <h2>준비됐나요?</h2>
          <p>지금 바로 첫 초대장을 만들어보세요. 무료로 시작할 수 있어요.</p>
          <div className="guide-final-btns">
            <Link href="/new" className="guide-btn primary">무료로 만들기</Link>
            <Link href="/#faq" className="guide-btn ghost">자주 묻는 질문</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
