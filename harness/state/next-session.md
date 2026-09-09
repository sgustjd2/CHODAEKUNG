# 다음 세션 할 일 (Handoff) — CHODAE KUNG

작성: 2026-09-09. 새 세션은 이 파일 + `harness/state/remaining-phases.md`(로드맵) + `CLAUDE.md`을 먼저 읽으세요.

## 시작 전 참고 (환경 특성)
- **에디터(/editor)는 로그인 필수** — auth 게이트가 /login으로 리다이렉트. 로그인 없이는 에디터 UI를 화면으로 못 봄. 실기기/로그인된 크롬(claude-in-chrome)으로 확인하거나, 배포본에서 사용자가 확인.
- **인앱 브라우저(mcp__Claude_Browser__)가 /i/ 페이지에서 navigate 타임아웃/멈춤이 잦음** — 특히 방명록/참석자(클라이언트 fetch) 섹션이 있으면 networkidle에 안 도달. 우회: `javascript_tool`로 `location.href` 직접 세팅 후 `read_page`/`getComputedStyle`로 확인(계측이 스크린샷보다 신뢰도 높음). 포커스/클릭 테스트는 pane을 `tabs_select`로 FRONTED 상태로.
- **DB 검증**: `db-verification-workflow` 메모리 참고 — 서비스 키로 Supabase REST 직접 seed/clean(테스트 초대장 심고 지우기). `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 있음. 끝나면 반드시 정리.
- 스킬 사용 가능: `.claude/skills/`에 improve-ui / baseline-ui / fixing-accessibility / fixing-motion-performance / fixing-metadata / create-design-md / ui-skills-root 설치됨. `/improve-ui` 등으로 호출.

---

## ⚠️ 사용자 액션 필요 (기능 활성화 블로커)
- [ ] **마이그레이션 `0006_admins.sql` 적용** (Supabase SQL editor / `supabase db push`) — 관리자 콘솔(/admin)의
  `public.admins` 테이블 생성 + 첫 관리자 시드(`sgustjd1234@gmail.com`, 스모크로 실제 로그인 유저 확인됨). 적용 전엔
  fail-safe로 /admin 접근이 전원 차단됨(정상). 다른 관리자 추가: `insert into public.admins (email) values ('x@y.com');`

## P1 · 최근 변경 검증 (로그인/실기기 필요 — 사용자 도움 필요)
- [ ] **관리자 콘솔 `/admin` (2026-09-09 신규)** — 0006 적용 + 관리자 로그인 후: 헤더 계정메뉴 '관리자 콘솔' 노출,
  탭(초대장/유저)·검색·지표, 초대장 공개중지/공개·삭제, 유저 프리미엄 부여·회수·정지·삭제 동작 확인(동작 후
  `router.refresh()`로 갱신). 서비스키 읽기 스모크는 통과(listUsers/초대장 카운트). 파괴적 동작은 실데이터라 신중히.
직전 세션들에서 코드는 넣고 화면 확인을 못 한 것들. 대부분 배포본(로그인 상태)에서 바로 티남.
- [ ] **헤더 계정 버튼** — 이니셜 원형 → `[아바타 + 닉네임 + ▾]` 필. 로그인 상태 랜딩/템플릿 상단에서 닉네임 전체 노출 확인. (`src/components/landing/account-menu.tsx`)
- [ ] **다크 테마 커스텀 액센트** — 배틀/게이밍/개발자 테마에서 스타일 탭 액센트(특히 어두운 색 `#2A2A3E` 등) 골랐을 때 아이브로우·D-day 문구·VS·타이틀 em이 잘 보이는지. (수학+라이브 계측은 통과: 1.2:1→5.75:1. `--wax-onpage` 방식)
- [ ] **배틀 타이틀 em / VS 워드 기본색** — `--wax-onpage` 기본값이 `--wax-deep(#C96A6A)`라 기존 `#C25C5C`보다 살짝 밝아짐. 기본(커스텀 액센트 없는) 배틀에서 어색하지 않은지 확인. 어색하면 tokens.css `--wax-onpage` 기본을 `var(--wax)`로.
- [ ] **에디터 카운트다운/인스펙터** — 카운트다운 섹션이 '목표 일시(날짜 선택)'로 바뀌었고, 왼쪽 섹션 클릭 시 오른쪽 인스펙터도 해당 섹션으로 스크롤됨. 로그인 에디터에서 클릭 확인(자동화로는 미확인).
- [ ] **게이밍·개발자·큐트·에디토리얼 뷰어** — 이번 감사에서 배틀·로맨틱만 렌더 확인. 나머지 테마 뷰어/에디터 프리뷰 육안 확인.
- [ ] **에디터 실파일 업로드** — 커버/갤러리 파일 피커 + ImageCropper (Phase A2 잔여, 실브라우저 파일 업로드 필요).
- [ ] **문구별 스타일 (2026-09-09 신규)** — 프리뷰에서 문구 클릭 → 플로팅 툴바 + 오른쪽 인스펙터 '문구 스타일'에서 크기·색·글꼴·굵기·기울임. 로그인 에디터에서 확인: (a) 클릭 시 툴바가 문구 아래 뜨고 스크롤 따라오는지, (b) 스타일이 프리뷰·발행본에 실제 적용되는지, (c) 글꼴 바꾸면 폰트 로드되는지, (d) '초기화'로 지워지는지. **모바일 편집 UI는 아직 없음**(데스크톱에서 지정한 스타일은 모바일 프리뷰/발행본엔 렌더됨) — 필요하면 모바일 바텀시트에도 `TextStyleControls` 추가.
- [ ] **인스펙터 섹션 카드 (2026-09-09)** — 오른쪽 패널의 각 섹션 편집기가 카드로 구분됨. 로그인 에디터에서 육안 확인(과하지 않은지).

## P2 · UI/UX 감사 (진행 상황)
- ✅ **2026-09-09 감사 완료**: `/new` 마법사·`/rsvp`·`/settings`·`/media` improve-ui(소스 기반, 병렬).
  - `/settings` 깨끗. 수정 3건 배포: `/media` PhotoUpload 미스타일(→globals.css로 이전), `.input:focus`
    구 버건디 링(→코럴), `/rsvp` 브레드크럼 통일. 상세·거짓양성 근거는 `implementation-log.md`(2026-09-09)
    + `design-plans/{media,rsvp,new-wizard}.md`(각 RESOLUTION 헤더).
  - ⚠️ 교훈: 감사 에이전트에 **Genspark 목업 경로(`design/NN_*.html`, `design/assets/tokens.css`)를 꼭 주기.**
    이번에 안 줬더니 rsvp 2건(CSV 라벨/뱃지색)이 목업과 일치하는데 "불일치"로 잡힘(거짓양성). copy/색 findings는
    반드시 목업 대조 후 적용.
- [ ] 남은 표면: **대시보드(`/dashboard`) populated 상태**(빈 상태만 감사됨 — 실데이터 필요), 랜딩(`/`)은
      UX-06(푸터 터치타깃 <44px)만 열림.
- [ ] `/baseline-ui` 전반 슬롭 점검, `/fixing-accessibility`(a11y는 improve-ui 규칙상 제외됨), 
      `/fixing-motion-performance`(뷰어 애니메이션).
- 참고: 라이트 테마(로맨틱/큐트/에디토리얼/미니멀/타임라인)는 이전에 소스+렌더로 깨끗 판단.

## P3 · 제품 방향 결정 (2026-09-09 결정됨 — 지금은 코드 작업 없음)
- ✅ **D1 결제(수익화) → 실결제 보류.** 스캐폴드(`entitlements.ts`) 유지, 트래픽/수요 생기기 전엔 결제 인프라
  안 만듦. 프로바이더 미정. (착수 시 남는 것: 실체크아웃 국내 Toss/PortOne·해외 Stripe → 웹훅이 tier 전환,
  **tier를 서버 권위 DB 컬럼으로**(지금은 클라 편집 가능 data 필드), 대시보드 고급분석 게이트 실적용 — 체크아웃과
  함께 해서 무료 사용자 안 잠기게.)
- ✅ **RSVP 참석 정원(마감) → 무료 유지.** 소규모 모임 기본 기대 기능. 프리미엄은 갤러리/저장 용량 + 고급분석.
- ✅ **D2 마켓플레이스 → 현상 유지.** "크리에이터 템플릿 마켓 등록" 문구·미구현 상태 그대로 두기. 발견/마켓 UI
  방향은 나중에 재검토.

## P4 · 소소한 정리 / 기술 부채
- [ ] **카운트다운 편집 중복** — 카운트다운 섹션 편집기와 '캘린더' 그룹이 둘 다 `eventStart`(행사 일시)를 편집(동일 값). 하나로 합치거나 안내만 정리.
- [ ] **오래된 테스트 초대장 정리** — DB에 stale 데이터: `inv-g65de7ya`("DUEL NO. 001" 라벨 잔존 + eventStart 과거라 카운트다운 0/00/00/00), 기타 `inv-*` 테스트 행. 서비스 키로 정리하거나 사용자 대시보드에서 삭제. (현재 코드로 새로 만들면 문제 없음 — 순수 stale 데이터)
- [ ] **감사 플랜 #2** — `design-plans/common-sections-dark-theme.md`의 '카드 다크화'는 문서화된 의도(흰 카드 의도적, viewer.css:1033)와 충돌해 **보류**함. 만약 다크 테마에서 흰 카드가 어색하다고 판단되면 그때 제품 결정으로 재개(그 문서에 근거 정리돼 있음).

## P5 · 알려진 향후 한계 (낮은 우선순위, 로드맵 기재)
- [ ] 로그인 게스트의 **크로스 디바이스 RSVP 수정** — 서버 조회(유저 id/이전 응답 매칭) 필요. 지금은 localStorage 기반(같은 브라우저만).
- [ ] 마법사 basics → 비-date 테마(에디토리얼/타임라인 details, 배틀 matchInfo/countdown, 게이밍 gInfo) 자동 채움 — 커버+eventStart로 충분해 보류(로드맵 C1).
- [ ] (선택) Vercel에 `NEXT_PUBLIC_SITE_URL` 고정 — 커스텀 도메인 붙일 때만 필요.

---

## 직전 세션 요약 (2026-09-09 — 이 핸드오프 직전)
- P2 감사(미감사 표면 4종) + 수정 3건: `/media` 업로드 컨트롤 미스타일 루트원인 수정(공유 CSS를 editor.css
  → globals.css로 이전, 단일 정의), 앱 전역 `.input:focus` 구 버건디 링 → 코럴 tint-ring, `/rsvp` 브레드크럼
  통일. rsvp CSV라벨·뱃지색 2건은 목업과 일치라 거짓양성으로 반려.
- P3 제품 결정 3건 받음: D1 결제 보류, RSVP 정원 무료 유지, D2 마켓 현상 유지(위 P3 참조).
- 검증: eslint 0 errors, `next build --webpack` 통과(worktree라 Turbopack 빌드 불가 — 아래 환경 주의 참고).
- 이 브랜치(`claude/p2-uiux-audit-p3-review-f0c7a4`)에 커밋. main 병합/푸시는 사용자 확인 후.

### 환경 주의 (worktree 빌드)
- 이 worktree엔 `node_modules`가 없음(공유 안 됨). `next build`(Turbopack 기본)는 worktree 밖을 가리키는
  node_modules 심링크를 거부함. 검증 시: 메인(`E:\workspace\moiletter\node_modules`)로 junction 걸고
  `npx next build --webpack`(webpack은 심링크 따라감) → 끝나면 junction/`.next` 제거.
