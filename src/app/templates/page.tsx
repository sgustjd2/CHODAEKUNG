import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { CategoryNav } from "@/components/templates/category-nav";
import { CustomEvent } from "@/components/templates/custom-event";
import { TemplateCard, type Template } from "@/components/templates/template-card";
import { AccountMenu } from "@/components/landing/account-menu";
import { hasSession } from "@/lib/db/supabase-server";
import { getAdminUser } from "@/lib/db/admin";
import "./templates.css";

export const metadata: Metadata = {
  title: "템플릿 · 초대쿵",
  description: "결혼식부터 롤 파티까지 — 8개 카테고리 80여 종 초대장 템플릿을 둘러보세요.",
};

type Category = {
  id: string;
  navLabel: string;
  iconName: string;
  iconClass: string;
  eb: string;
  title: ReactNode;
  desc: string;
  templates: Template[];
};

const categories: Category[] = [
  {
    id: "cat-wedding",
    navLabel: "결혼 · 기념일",
    iconName: "ic-ring",
    iconClass: "c-wedding",
    eb: "카테고리 01",
    title: <>결혼 · <em>기념일</em></>,
    desc: "두 사람의 시작, 그리고 매년 돌아오는 소중한 순간. 로맨틱, 미니멀, 파인 아트까지 다양한 감성.",
    templates: [
      { img: "romantic_wedding", badge: { text: "무료", kind: "free" }, catTag: "로맨틱 웨딩", name: <>들꽃 <em>웨딩</em></>, meta: ["세리프체", "로즈 · 아이보리"], fav: true },
      { img: "hero_flatlay", badge: { text: "클래식" }, catTag: "손글씨", name: <>왁스 <em>실링</em></>, meta: ["캘리그래피", "드라이플라워"] },
      { img: "wedding_gallery_1", badge: { text: "추천" }, catTag: "파인아트 · 세리프", name: <>맞잡은 <em>손</em></>, meta: ["블러시 · 크림", "패럴랙스"] },
      { img: "wedding_gallery_2", badge: { text: "신규", kind: "new" }, catTag: "에디토리얼 · 인기", name: <>노을 <em>웨딩</em></>, meta: ["역광", "노을"] },
    ],
  },
  {
    id: "cat-birthday",
    navLabel: "생일 · 돌잔치",
    iconName: "ic-cake",
    iconClass: "c-birthday",
    eb: "카테고리 02",
    title: <>생일 · <em>돌잔치</em></>,
    desc: "첫 생일부터 환갑까지, 매년의 축하가 특별해지는 초대장. 아기부터 어른까지 톤 별로.",
    templates: [
      { img: "minimal_birthday", badge: { text: "무료", kind: "free" }, catTag: "미니멀 생일", name: <>조용한 <em>하루</em></>, meta: ["에디토리얼 그리드", "크림 · 블러시"] },
      { img: "tmpl_doljanchi", badge: { text: "돌잔치", kind: "new" }, catTag: "첫 번째 생일", name: <>첫 <em>돌</em></>, meta: ["둥근 서체", "버터 · 피치"] },
      { img: "cute_housewarming", badge: { text: "프로", kind: "pro" }, catTag: "키즈 생일", name: <>리틀 <em>파티</em></>, meta: ["귀여운 마스코트", "파스텔"] },
      { img: "tmpl_yearend", badge: { text: "환갑 · 칠순" }, catTag: "환갑 · 칠순", name: <>황금빛 <em>날</em></>, meta: ["전통", "골드 포인트"] },
    ],
  },
  {
    id: "cat-home",
    navLabel: "집들이 · 홈파티",
    iconName: "ic-house",
    iconClass: "c-home",
    eb: "카테고리 03",
    title: <>집들이 · <em>홈파티</em></>,
    desc: "새 집 첫 손님, 저녁 홈파티, 브런치 모임. 시간별 진행과 메뉴 구성까지 담을 수 있어요.",
    templates: [
      { img: "tmpl_housewarming_v2", badge: { text: "신규", kind: "new" }, catTag: "귀여운 · 집들이", name: <>포근한 <em>집</em></>, meta: ["모모 마스코트", "파스텔"], fav: true },
      { img: "timeline_gathering", badge: { text: "타임라인 · 프로", kind: "pro" }, catTag: "타임라인 · 메뉴", name: <>홈파티 <em>타임라인</em></>, meta: ["시간별 진행", "메뉴 카드"] },
      { img: "tmpl_stationery_flatlay", badge: { text: "무료", kind: "free" }, catTag: "디너 파티", name: <>따뜻한 <em>저녁</em></>, meta: ["에디토리얼", "와인 · 크림"] },
    ],
  },
  {
    id: "cat-sports",
    navLabel: "스포츠 배틀",
    iconName: "ic-ball",
    iconClass: "c-sports",
    eb: "카테고리 04",
    title: <>스포츠 <em>배틀</em></>,
    desc: "조기축구, 배드민턴, 테니스, 야구관람, 반대항 경기까지. VS 대결 구도의 재미있는 도전장.",
    templates: [
      { img: "battle_sports", badge: { text: "배틀", kind: "new" }, catTag: "축구 · 조기축구", name: <>조기축구 <em>배틀</em></>, meta: ["VS 구도", "팀 명단"] },
      { img: "tmpl_badminton", badge: { text: "무료", kind: "free" }, catTag: "배드민턴", name: <>셔틀 <em>배틀</em></>, meta: ["2v2 · 개인전", "대진표"] },
      { img: "tmpl_baseball", badge: { text: "프로", kind: "pro" }, catTag: "야구 · 직관", name: <>야구장 <em>관람</em></>, meta: ["좌석 정보", "응원 팀"] },
      { img: "tmpl_tennis", badge: { text: "테니스" }, catTag: "테니스 · 골프", name: <>매치 <em>데이</em></>, meta: ["스코어 카드", "코트 정보"] },
      { img: "tmpl_climbing", badge: { text: "반대항", kind: "new" }, catTag: "회사 · 반대항", name: <>반대항 <em>매치</em></>, meta: ["팀 배지", "스코어보드"] },
    ],
  },
  {
    id: "cat-gaming",
    navLabel: "게이밍 · 롤",
    iconName: "ic-controller",
    iconClass: "c-gaming",
    eb: "카테고리 05",
    title: <>게이밍 · <em>롤</em></>,
    desc: "롤 빠른대전, 내전, 랭크 파티, 발로란트, 오버워치까지. 소환사명·티어·포지션 정보를 담은 게이밍 초대장.",
    templates: [
      { img: "game_lol_rank", badge: { text: "신규 · 롤", kind: "new" }, catTag: "리그 오브 레전드 · 롤", name: <>랭크 <em>파티</em></>, meta: ["티어 · 포지션", "듀오 · 자유랭"] },
      { img: "game_lol_aram", badge: { text: "무료", kind: "free" }, catTag: "롤 · 빠른대전", name: <>빠대 <em>파티</em></>, meta: ["5인 파티", "칼바람 · 일반"] },
      { img: "game_lol_draft", badge: { text: "프로 · 내전", kind: "pro" }, catTag: "사용자 설정 · 내전", name: <>10인 <em>내전</em></>, meta: ["블루 vs 레드", "드래프트"] },
      { img: "game_valorant", badge: { text: "발로란트" }, catTag: "FPS · 발로란트", name: <>요원 <em>선택</em></>, meta: ["5v5", "에이전트 선택"] },
      { img: "game_overwatch", badge: { text: "히어로", kind: "new" }, catTag: "히어로 슈터 · 오버워치", name: <>영웅 <em>선택</em></>, meta: ["탱 · 딜 · 힐", "궁 타이밍"] },
      { img: "game_fifa", badge: { text: "FC · 축구" }, catTag: "EA SPORTS FC · 피파", name: <>킥 <em>오프</em></>, meta: ["토너먼트", "포메이션"] },
      { img: "game_battleroyale", badge: { text: "배틀로얄", kind: "pro" }, catTag: "배그 · 서든어택", name: <>라스트 <em>스쿼드</em></>, meta: ["스쿼드 4인", "매치 시간"] },
      { img: "game_rts", badge: { text: "RTS · 클래식" }, catTag: "스타크래프트 · RTS", name: <>GG <em>나이트</em></>, meta: ["1v1 · 팀플", "맵 로테이션"] },
      { img: "minecraft_party", badge: { text: "신규 · 마크", kind: "new" }, catTag: "마인크래프트 · 블록월드", name: <>블록 <em>파티</em></>, meta: ["생존 · 멀티", "정원 8명"] },
      { img: "developer_terminal", badge: { text: "개발자 · 터미널", kind: "pro" }, catTag: "게임 · e스포츠", name: <>개발자 <em>밋업</em></>, meta: ["다크 · 모노", "토너먼트"] },
    ],
  },
  {
    id: "cat-outdoor",
    navLabel: "아웃도어",
    iconName: "ic-mountain",
    iconClass: "c-outdoor",
    eb: "카테고리 06",
    title: <>아웃도어 <em>모임</em></>,
    desc: "러닝, 등산, 캠핑, 피크닉, 여행/MT. 이동 경로, 준비물, 일정 공유가 필요한 모임.",
    templates: [
      { img: "tmpl_running", badge: { text: "신규", kind: "new" }, catTag: "러닝 크루", name: <>모닝 <em>런</em></>, meta: ["페이스 · 거리", "코스 지도"] },
      { img: "tmpl_hiking", badge: { text: "무료", kind: "free" }, catTag: "등산 모임", name: <>함께 <em>등산</em></>, meta: ["난이도", "준비물"] },
      { img: "tmpl_camping", badge: { text: "프로", kind: "pro" }, catTag: "캠핑 · 차박", name: <>별 <em>아래</em></>, meta: ["사이트 정보", "담당표"] },
      { img: "tmpl_picnic", badge: { text: "인기", kind: "new" }, catTag: "피크닉", name: <>화창한 <em>피크닉</em></>, meta: ["가져올 것", "공원 위치"] },
      { img: "tmpl_travel", badge: { text: "MT · 여행", kind: "pro" }, catTag: "MT · 여행", name: <>함께 <em>여행</em></>, meta: ["일별 일정", "비용 정산"], fav: true },
    ],
  },
  {
    id: "cat-hobby",
    navLabel: "취미 소모임",
    iconName: "ic-book",
    iconClass: "c-hobby",
    eb: "카테고리 07",
    title: <>취미 <em>소모임</em></>,
    desc: "스터디, 요가, 사진 출사, 반려동물, 카페 투어. 관심사로 모이는 작은 만남들.",
    templates: [
      { img: "tmpl_study", badge: { text: "무료", kind: "free" }, catTag: "스터디 모임", name: <>스터디 <em>타임</em></>, meta: ["주제 · 교재", "커리큘럼"] },
      { img: "tmpl_yoga", badge: { text: "신규", kind: "new" }, catTag: "요가 · 웰니스", name: <>슬로우 <em>플로우</em></>, meta: ["레벨", "준비물"] },
      { img: "tmpl_pet", badge: { text: "귀여움", kind: "new" }, catTag: "반려동물 모임", name: <>털친구 <em>모임</em></>, meta: ["견종·크기", "애견 카페"] },
      { img: "tmpl_rooftop_party", badge: { text: "프로", kind: "pro" }, catTag: "사진 출사", name: <>골든 <em>아워</em></>, meta: ["스팟 리스트", "장비 안내"] },
      { img: "tmpl_bookclub", badge: { text: "무료", kind: "free" }, catTag: "카페 · 맛집", name: <>카페 <em>투어</em></>, meta: ["코스", "추천 메뉴"] },
    ],
  },
  {
    id: "cat-party",
    navLabel: "파티 · 이벤트",
    iconName: "ic-confetti",
    iconClass: "c-party",
    eb: "카테고리 08",
    title: <>파티 · <em>이벤트</em></>,
    desc: "송년회, 브라이덜/베이비 샤워, 회사 행사, 세미나. 격식 있는 이벤트부터 캐주얼 파티까지.",
    templates: [
      { img: "editorial_party", badge: { text: "추천", kind: "new" }, catTag: "에디토리얼 파티", name: <>애프터 <em>파티</em></>, meta: ["필름 그레인", "매거진"] },
      { img: "tmpl_yearend_v2", badge: { text: "송년" }, catTag: "연말 · 송년회", name: <>골든 <em>나이트</em></>, meta: ["다크", "잉크 · 골드"] },
      { img: "tmpl_bridalshower", badge: { text: "신규", kind: "new" }, catTag: "브라이덜 샤워", name: <>라벤더 <em>필즈</em></>, meta: ["보태니컬", "라벤더"] },
      { img: "tmpl_seminar", badge: { text: "프로", kind: "pro" }, catTag: "세미나 · 기업", name: <>모던 <em>세미나</em></>, meta: ["포멀", "뉴트럴"] },
    ],
  },
];

const navItems = categories.map((c) => ({ id: c.id, label: c.navLabel, iconName: c.iconName }));

export default async function TemplateGalleryPage() {
  const authed = await hasSession();
  const isAdmin = authed ? (await getAdminUser()) !== null : false;
  return (
    <div className="gallery">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <Link className="nav-logo" href="/">
            <Logo />
          </Link>
          <div className="nav-crumb">
            홈 · <span className="cur">템플릿</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/new" style={{ textDecoration: "none" }}>
              <Button variant="primary" size="sm">무료로 시작하기</Button>
            </Link>
            {authed ? (
              <AccountMenu isAdmin={isAdmin} />
            ) : (
              <Link href="/login" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* HEAD */}
      <div className="head">
        <div className="head-eyebrow">템플릿 · 8개 카테고리</div>
        <h1 className="head-title">
          청첩장부터 <em>롤 파티까지.</em>
          <br />
          어떤 모임이든 초대장이 있어요.
        </h1>
        <p className="head-sub">
          감성적인 결혼식, 따끈한 집들이, 진지한 조기축구, 다같이 모이는 롤 내전까지 —
          카테고리를 골라 마음에 드는 템플릿을 고르세요. 편집기에서 자유롭게 커스터마이징할 수 있어요.
        </p>
      </div>

      {/* CATEGORY QUICK NAV (client: scroll-spy + smooth scroll) */}
      <CategoryNav items={navItems} />

      {/* SEARCH */}
      <div className="search-wrap">
        <div className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input type="text" placeholder="템플릿 검색 · 예: 미니멀 웨딩, 조기축구, 캠핑장" />
        </div>
        <div className="sort">
          정렬
          <select defaultValue="인기순" aria-label="템플릿 정렬 기준">
            <option>인기순</option>
            <option>최신순</option>
            <option>이름순</option>
          </select>
        </div>
      </div>

      {/* CUSTOM EVENT (client: banner + modal) */}
      <CustomEvent />

      {/* CATEGORY SECTIONS */}
      {categories.map((c) => (
        <section className="cat-section" id={c.id} key={c.id}>
          <div className="cat-header">
            <div className="cat-header-left">
              <div className={`cat-icon ${c.iconClass}`}>
                <Icon name={c.iconName} />
              </div>
              <div>
                <div className="cat-eb">{c.eb}</div>
                <h2 className="cat-title">{c.title}</h2>
                <p className="cat-desc">{c.desc}</p>
              </div>
            </div>
          </div>
          <div className="grid">
            {c.templates.map((t, i) => (
              <TemplateCard key={`${c.id}-${i}`} {...t} />
            ))}
          </div>
        </section>
      ))}

      {/* BOTTOM CTA */}
      <div className="bottom-cta">
        <h2>
          원하는 게 <em>없다면?</em>
        </h2>
        <p>
          빈 캔버스로 시작해서 자유롭게 만들거나, 어떤 템플릿이든 편집기에서 색상·폰트·섹션을
          원하는 대로 커스터마이징할 수 있어요.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/new" className="btn btn-primary btn-lg">빈 캔버스로 시작</Link>
          <Link href="/new" className="btn btn-outline btn-lg">템플릿 찾아보기 →</Link>
        </div>
      </div>
    </div>
  );
}
