import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import "./privacy.css";

export const metadata: Metadata = {
  title: "개인정보 처리방침 · 초대쿵",
  description: "초대쿵이 수집하는 정보와 이용·보관·파기 방식을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <div className="legal">
      <div className="legal-top">
        <Link className="legal-logo" href="/" aria-label="초대쿵 홈">
          <Logo />
        </Link>
        <div className="legal-crumb">개인정보 처리방침</div>
      </div>

      <div className="legal-wrap">
        <h1 className="legal-title">개인정보 처리방침</h1>
        <p className="legal-updated">최종 업데이트: 2026년 9월 6일</p>

        <p className="legal-intro">
          초대쿵(이하 &ldquo;서비스&rdquo;)은 초대장을 만들고 공유하는 데 필요한 최소한의 정보만 수집합니다. 이 방침은
          어떤 정보를 어떻게 수집·이용·보관·파기하는지 설명합니다.
        </p>

        <h2>1. 수집하는 정보</h2>
        <ul>
          <li><b>계정 정보</b> — 회원가입 시 이메일 주소, 표시 이름.</li>
          <li><b>초대장 콘텐츠</b> — 제작자가 입력한 문구, 날짜·장소, 업로드한 사진 등.</li>
          <li><b>RSVP 응답</b> — 참석자가 입력한 이름, 참석 여부, 인원, 메시지.</li>
          <li><b>이용 기록</b> — 초대장 조회수 등 서비스 운영에 필요한 기본 통계.</li>
        </ul>

        <h2>2. 이용 목적</h2>
        <p>수집한 정보는 초대장 생성·발행·공유, RSVP 응답 취합, 그리고 서비스 운영 및 개선을 위해서만 사용합니다.</p>

        <h2>3. 열람 범위</h2>
        <p>
          RSVP 응답은 해당 초대장의 제작자만 열람할 수 있습니다. 공개된 초대장 페이지에는 참석자 명단이 표시되지
          않습니다.
        </p>

        <h2>4. 보관 및 파기</h2>
        <p>
          RSVP 응답은 초대장 발행 후 6개월간 보관한 뒤 파기합니다. 계정과 초대장 데이터는 이용자가 삭제할 때 함께
          파기됩니다. 이용자는 언제든지 더 이른 삭제를 요청할 수 있습니다.
        </p>

        <h2>5. 처리 위탁 및 제3자 제공</h2>
        <p>
          데이터 저장·인증에는 Supabase를 이용하며, 지도·공유 기능을 사용할 때 카카오 서비스가 연동됩니다. 위에 명시한
          목적 외에는 개인정보를 제3자에게 판매하거나 제공하지 않습니다.
        </p>

        <h2>6. 이용자의 권리</h2>
        <p>
          이용자는 자신의 정보에 대한 열람·수정·삭제를 요청할 수 있습니다. 초대장과 RSVP 응답은 대시보드에서, 계정
          정보는 설정 페이지에서 직접 관리할 수 있습니다.
        </p>

        <h2>7. 문의</h2>
        <p>개인정보 처리에 관한 문의는 서비스 운영자에게 연락해 주세요.</p>

        <div className="legal-note">
          본 방침은 서비스의 현재 데이터 처리 방식을 바탕으로 작성된 기본 안내입니다. 실제 운영 주체·연락처·법적 고지
          등 세부 사항은 운영자가 확인하여 보완해야 합니다.
        </div>
      </div>
    </div>
  );
}
