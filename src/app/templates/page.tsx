import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { CategoryNav } from "@/components/templates/category-nav";
import { CustomEvent } from "@/components/templates/custom-event";
import { TemplateCard, type Template } from "@/components/templates/template-card";
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
    eb: "Category 01",
    title: <>결혼 · <em>기념일</em></>,
    desc: "두 사람의 시작, 그리고 매년 돌아오는 소중한 순간. 로맨틱, 미니멀, 파인 아트까지 다양한 감성.",
    templates: [
      { img: "romantic_wedding", badge: { text: "Free", kind: "free" }, catTag: "Romantic Wedding", name: <>Meadow <em>Love</em></>, meta: ["Fraunces", "Rose · Ivory"], fav: true },
      { img: "hero_flatlay", badge: { text: "Classic" }, catTag: "Handwritten", name: <>Wax <em>Seal</em></>, meta: ["Calligraphy", "Dried Florals"] },
      { img: "wedding_gallery_1", badge: { text: "Featured" }, catTag: "Fine Art · Serif", name: <>Hands <em>Together</em></>, meta: ["Blush · Cream", "Parallax"] },
      { img: "wedding_gallery_2", badge: { text: "New", kind: "new" }, catTag: "Editorial · Trending", name: <>Golden <em>Trail</em></>, meta: ["Backlit", "Sunset"] },
    ],
  },
  {
    id: "cat-birthday",
    navLabel: "생일 · 돌잔치",
    iconName: "ic-cake",
    iconClass: "c-birthday",
    eb: "Category 02",
    title: <>생일 · <em>돌잔치</em></>,
    desc: "첫 생일부터 환갑까지, 매년의 축하가 특별해지는 초대장. 아기부터 어른까지 톤 별로.",
    templates: [
      { img: "minimal_birthday", badge: { text: "Free", kind: "free" }, catTag: "Minimal Birthday", name: <>Quiet <em>Day</em></>, meta: ["Editorial Grid", "Cream · Blush"] },
      { img: "tmpl_doljanchi", badge: { text: "Doljanchi", kind: "new" }, catTag: "첫 번째 생일", name: <>First <em>Year</em></>, meta: ["Rounded", "Butter · Peach"] },
      { img: "cute_housewarming", badge: { text: "Pro", kind: "pro" }, catTag: "Kids Birthday", name: <>Little <em>Party</em></>, meta: ["Cute Mascot", "Pastel"] },
      { img: "tmpl_yearend", badge: { text: "환갑 · 칠순" }, catTag: "Milestone Birthday", name: <>Golden <em>Age</em></>, meta: ["Traditional", "Gold Accent"] },
    ],
  },
  {
    id: "cat-home",
    navLabel: "집들이 · 홈파티",
    iconName: "ic-house",
    iconClass: "c-home",
    eb: "Category 03",
    title: <>집들이 · <em>홈파티</em></>,
    desc: "새 집 첫 손님, 저녁 홈파티, 브런치 모임. 시간별 진행과 메뉴 구성까지 담을 수 있어요.",
    templates: [
      { img: "cute_housewarming", badge: { text: "New", kind: "new" }, catTag: "Cute · Housewarming", name: <>Cozy <em>Home</em></>, meta: ["MOMO Mascot", "Pastel"], fav: true },
      { img: "timeline_gathering", badge: { text: "Timeline · Pro", kind: "pro" }, catTag: "Timeline · Menu", name: <>Home <em>Timeline</em></>, meta: ["시간별 진행", "메뉴 카드"] },
      { img: "hero_flatlay", badge: { text: "Free", kind: "free" }, catTag: "Dinner Party", name: <>Warm <em>Dinner</em></>, meta: ["Editorial", "Wine · Cream"] },
    ],
  },
  {
    id: "cat-sports",
    navLabel: "스포츠 배틀",
    iconName: "ic-ball",
    iconClass: "c-sports",
    eb: "Category 04",
    title: <>스포츠 <em>배틀</em></>,
    desc: "조기축구, 배드민턴, 테니스, 야구관람, 반대항 경기까지. VS 대결 구도의 재미있는 도전장.",
    templates: [
      { img: "battle_sports", badge: { text: "Battle", kind: "new" }, catTag: "Soccer · 조기축구", name: <>조기축구 <em>배틀</em></>, meta: ["VS Layout", "Team Roster"] },
      { img: "tmpl_badminton", badge: { text: "Free", kind: "free" }, catTag: "Badminton · 배드민턴", name: <>Shuttle <em>Battle</em></>, meta: ["2v2 · 개인전", "Bracket"] },
      { img: "tmpl_baseball", badge: { text: "Pro", kind: "pro" }, catTag: "Baseball · 야구", name: <>야구장 <em>관람</em></>, meta: ["좌석 정보", "응원 팀"] },
      { img: "tmpl_tennis", badge: { text: "Tennis" }, catTag: "Tennis · Golf", name: <>Match <em>Day</em></>, meta: ["Score Card", "Court Info"] },
      { img: "battle_sports", imgFilter: "hue-rotate(-15deg) saturate(0.9) brightness(1.05)", badge: { text: "반대항", kind: "new" }, catTag: "Company · 반대항", name: <>반대항 <em>매치</em></>, meta: ["팀 배지", "스코어보드"] },
    ],
  },
  {
    id: "cat-gaming",
    navLabel: "게이밍 · 롤",
    iconName: "ic-controller",
    iconClass: "c-gaming",
    eb: "Category 05",
    title: <>게이밍 · <em>롤</em></>,
    desc: "롤 빠른대전, 내전, 랭크 파티, 발로란트, 오버워치까지. 소환사명·티어·포지션 정보를 담은 게이밍 초대장.",
    templates: [
      { img: "tmpl_gaming", badge: { text: "New · LoL", kind: "new" }, catTag: "League of Legends · 롤", name: <>랭크 <em>파티</em></>, meta: ["티어 · 포지션", "Duo · Flex"] },
      { img: "tmpl_gaming", imgFilter: "hue-rotate(30deg) saturate(1.1)", badge: { text: "Free", kind: "free" }, catTag: "LoL · 빠른대전", name: <>빠대 <em>파티</em></>, meta: ["5인 파티", "ARAM · 노말"] },
      { img: "tmpl_gaming", imgFilter: "hue-rotate(-40deg) saturate(1.15)", badge: { text: "Pro · 내전", kind: "pro" }, catTag: "Custom · 내전", name: <>10인 <em>내전</em></>, meta: ["블루 vs 레드", "드래프트"] },
      { img: "tmpl_gaming", imgFilter: "hue-rotate(90deg) saturate(0.9)", badge: { text: "Valorant" }, catTag: "FPS · Valorant", name: <>Agent <em>Lock</em></>, meta: ["5v5", "에이전트 선택"] },
      { img: "developer_terminal", badge: { text: "Dev · Terminal", kind: "pro" }, catTag: "Game · e-Sports", name: <>$ moi <em>--invite</em></>, meta: ["Dark · Mono", "Tournament"] },
    ],
  },
  {
    id: "cat-outdoor",
    navLabel: "아웃도어",
    iconName: "ic-mountain",
    iconClass: "c-outdoor",
    eb: "Category 06",
    title: <>아웃도어 <em>모임</em></>,
    desc: "러닝, 등산, 캠핑, 피크닉, 여행/MT. 이동 경로, 준비물, 일정 공유가 필요한 모임.",
    templates: [
      { img: "tmpl_running", badge: { text: "New", kind: "new" }, catTag: "Running Club", name: <>Morning <em>Run</em></>, meta: ["페이스 · 거리", "루트 맵"] },
      { img: "tmpl_hiking", badge: { text: "Free", kind: "free" }, catTag: "Hiking Meet", name: <>Trail <em>Together</em></>, meta: ["난이도", "준비물"] },
      { img: "tmpl_camping", badge: { text: "Pro", kind: "pro" }, catTag: "Camping · 차박", name: <>Under <em>Stars</em></>, meta: ["사이트 정보", "담당표"] },
      { img: "tmpl_picnic", badge: { text: "Trending", kind: "new" }, catTag: "Picnic", name: <>Sunny <em>Picnic</em></>, meta: ["가져올 것", "공원 위치"] },
      { img: "tmpl_travel", badge: { text: "MT · Trip", kind: "pro" }, catTag: "MT · 여행", name: <>Trip <em>Together</em></>, meta: ["일별 일정", "비용 정산"], fav: true },
    ],
  },
  {
    id: "cat-hobby",
    navLabel: "취미 소모임",
    iconName: "ic-book",
    iconClass: "c-hobby",
    eb: "Category 07",
    title: <>취미 <em>소모임</em></>,
    desc: "스터디, 요가, 사진 출사, 반려동물, 카페 투어. 관심사로 모이는 작은 만남들.",
    templates: [
      { img: "tmpl_study", badge: { text: "Free", kind: "free" }, catTag: "Study Group", name: <>Study <em>Time</em></>, meta: ["주제 · 교재", "커리큘럼"] },
      { img: "tmpl_yoga", badge: { text: "New", kind: "new" }, catTag: "Yoga · Wellness", name: <>Slow <em>Flow</em></>, meta: ["레벨", "준비물"] },
      { img: "tmpl_pet", badge: { text: "Cute", kind: "new" }, catTag: "Pet Meetup", name: <>Furry <em>Friends</em></>, meta: ["견종·크기", "애견 카페"] },
      { img: "editorial_party", imgFilter: "hue-rotate(20deg) brightness(1.05) saturate(0.85)", badge: { text: "Pro", kind: "pro" }, catTag: "Photo Walk", name: <>Golden <em>Hour</em></>, meta: ["스팟 리스트", "장비 안내"] },
      { img: "tmpl_study", imgFilter: "hue-rotate(-20deg) saturate(0.9)", badge: { text: "Free", kind: "free" }, catTag: "Cafe · Foodie", name: <>Cafe <em>Hop</em></>, meta: ["코스", "추천 메뉴"] },
    ],
  },
  {
    id: "cat-party",
    navLabel: "파티 · 이벤트",
    iconName: "ic-confetti",
    iconClass: "c-party",
    eb: "Category 08",
    title: <>파티 · <em>이벤트</em></>,
    desc: "송년회, 브라이덜/베이비 샤워, 회사 행사, 세미나. 격식 있는 이벤트부터 캐주얼 파티까지.",
    templates: [
      { img: "editorial_party", badge: { text: "Featured", kind: "new" }, catTag: "Editorial Party", name: <>After <em>Hours</em></>, meta: ["Film Grain", "Magazine"] },
      { img: "tmpl_yearend", badge: { text: "Year-End" }, catTag: "Year-End · 송년회", name: <>Golden <em>Night</em></>, meta: ["Dark", "Ink · Gold"] },
      { img: "tmpl_bridalshower", badge: { text: "New", kind: "new" }, catTag: "Bridal Shower", name: <>Lavender <em>Fields</em></>, meta: ["Botanical", "Lavender"] },
      { img: "tmpl_seminar", badge: { text: "Pro", kind: "pro" }, catTag: "Seminar · Corporate", name: <>Modern <em>Assembly</em></>, meta: ["Formal", "Neutral"] },
    ],
  },
];

const navItems = categories.map((c) => ({ id: c.id, label: c.navLabel, iconName: c.iconName }));

export default function TemplateGalleryPage() {
  return (
    <div className="gallery">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <Link className="nav-logo" href="/">
            <Logo />
          </Link>
          <div className="nav-crumb">
            HOME · <span className="cur">TEMPLATES</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" size="sm">로그인</Button>
            <Button variant="primary" size="sm">무료로 시작하기</Button>
          </div>
        </div>
      </nav>

      {/* HEAD */}
      <div className="head">
        <div className="head-eyebrow">Templates · 8 Categories</div>
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
          SORT BY
          <select defaultValue="인기순">
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
