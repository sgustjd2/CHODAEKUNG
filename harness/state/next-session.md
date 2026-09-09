# 다음 세션 할 일 (Handoff) — CHODAE KUNG

작성: 2026-09-09. 새 세션은 이 파일 + `harness/state/remaining-phases.md`(로드맵) + `CLAUDE.md`을 먼저 읽으세요.

## 시작 전 참고 (환경 특성)
- **에디터(/editor)는 로그인 필수** — auth 게이트가 /login으로 리다이렉트. 로그인 없이는 에디터 UI를 화면으로 못 봄. 실기기/로그인된 크롬(claude-in-chrome)으로 확인하거나, 배포본에서 사용자가 확인.
- **인앱 브라우저(mcp__Claude_Browser__)가 /i/ 페이지에서 navigate 타임아웃/멈춤이 잦음** — 특히 방명록/참석자(클라이언트 fetch) 섹션이 있으면 networkidle에 안 도달. 우회: `javascript_tool`로 `location.href` 직접 세팅 후 `read_page`/`getComputedStyle`로 확인(계측이 스크린샷보다 신뢰도 높음). 포커스/클릭 테스트는 pane을 `tabs_select`로 FRONTED 상태로.
- **DB 검증**: `db-verification-workflow` 메모리 참고 — 서비스 키로 Supabase REST 직접 seed/clean(테스트 초대장 심고 지우기). `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 있음. 끝나면 반드시 정리.
- 스킬 사용 가능: `.claude/skills/`에 improve-ui / baseline-ui / fixing-accessibility / fixing-motion-performance / fixing-metadata / create-design-md / ui-skills-root 설치됨. `/improve-ui` 등으로 호출.

---

## P1 · 최근 변경 검증 (로그인/실기기 필요 — 사용자 도움 필요)
직전 세션들에서 코드는 넣고 화면 확인을 못 한 것들. 대부분 배포본(로그인 상태)에서 바로 티남.
- [ ] **헤더 계정 버튼** — 이니셜 원형 → `[아바타 + 닉네임 + ▾]` 필. 로그인 상태 랜딩/템플릿 상단에서 닉네임 전체 노출 확인. (`src/components/landing/account-menu.tsx`)
- [ ] **다크 테마 커스텀 액센트** — 배틀/게이밍/개발자 테마에서 스타일 탭 액센트(특히 어두운 색 `#2A2A3E` 등) 골랐을 때 아이브로우·D-day 문구·VS·타이틀 em이 잘 보이는지. (수학+라이브 계측은 통과: 1.2:1→5.75:1. `--wax-onpage` 방식)
- [ ] **배틀 타이틀 em / VS 워드 기본색** — `--wax-onpage` 기본값이 `--wax-deep(#C96A6A)`라 기존 `#C25C5C`보다 살짝 밝아짐. 기본(커스텀 액센트 없는) 배틀에서 어색하지 않은지 확인. 어색하면 tokens.css `--wax-onpage` 기본을 `var(--wax)`로.
- [ ] **에디터 카운트다운/인스펙터** — 카운트다운 섹션이 '목표 일시(날짜 선택)'로 바뀌었고, 왼쪽 섹션 클릭 시 오른쪽 인스펙터도 해당 섹션으로 스크롤됨. 로그인 에디터에서 클릭 확인(자동화로는 미확인).
- [ ] **게이밍·개발자·큐트·에디토리얼 뷰어** — 이번 감사에서 배틀·로맨틱만 렌더 확인. 나머지 테마 뷰어/에디터 프리뷰 육안 확인.
- [ ] **에디터 실파일 업로드** — 커버/갤러리 파일 피커 + ImageCropper (Phase A2 잔여, 실브라우저 파일 업로드 필요).

## P2 · UI/UX 감사 더 하기 (개발 가능, 스킬 활용)
improve-ui는 한 번에 top-3만 뽑음 — 이번엔 **에디터 표면**만 감사했음. 남은 표면:
- [ ] 대시보드(`/dashboard`), /new 마법사, 랜딩(`/`), `/rsvp`, `/settings`, `/media` 각각 `/improve-ui`.
- [ ] `/baseline-ui`로 전반 슬롭 점검(간격·타이포·계층).
- [ ] `/fixing-accessibility` (이번 감사에서 a11y는 스킬 규칙상 제외했음 — 별도로 필요).
- [ ] `/fixing-motion-performance` (뷰어 애니메이션/리빌).
- 참고: 라이트 테마(로맨틱/큐트/에디토리얼/미니멀/타임라인)는 이번에 소스+렌더로 깨끗하다고 판단.

## P3 · 제품 방향 결정 필요 (사용자 입력 먼저 — CLAUDE.md §15, 임의로 만들지 말 것)
- [ ] **D1 결제(수익화)** — 현재 scaffold만(`entitlements.ts`, 실결제 없음). 남은 것:
  - 실제 체크아웃(국내 Toss Payments/PortOne, 해외 Stripe) — 사용자가 콘솔에 키 등록, 웹훅이 tier 전환.
  - **tier를 서버 권위(DB 컬럼)로** — 지금은 클라 편집 가능한 data 필드(scaffold용). 웹훅에서만 세팅되게.
  - 대시보드 고급 분석 게이트(차트/CSV) 실제 적용 — 체크아웃과 함께(그 전엔 무료 사용자 잠기지 않게).
  - **결정 필요: 참석 정원(마감) 기능을 무료로 둘지 프리미엄으로 올릴지.** 이번 세션에 정원(마감)을 무료로 출시함. 로드맵 D1의 "premium=capacity"는 사실 갤러리/저장 용량을 가리킴(`entitlements.ts:29`)이라 직접 충돌은 아님 — 그래도 RSVP 정원 관리를 유료로 할지 결정.
- [ ] **D2 마켓플레이스** — "크리에이터 템플릿 마켓 등록" 문구는 있으나 미구현. 발견/마켓 UI 방향 필요.

## P4 · 소소한 정리 / 기술 부채
- [ ] **카운트다운 편집 중복** — 카운트다운 섹션 편집기와 '캘린더' 그룹이 둘 다 `eventStart`(행사 일시)를 편집(동일 값). 하나로 합치거나 안내만 정리.
- [ ] **오래된 테스트 초대장 정리** — DB에 stale 데이터: `inv-g65de7ya`("DUEL NO. 001" 라벨 잔존 + eventStart 과거라 카운트다운 0/00/00/00), 기타 `inv-*` 테스트 행. 서비스 키로 정리하거나 사용자 대시보드에서 삭제. (현재 코드로 새로 만들면 문제 없음 — 순수 stale 데이터)
- [ ] **감사 플랜 #2** — `design-plans/common-sections-dark-theme.md`의 '카드 다크화'는 문서화된 의도(흰 카드 의도적, viewer.css:1033)와 충돌해 **보류**함. 만약 다크 테마에서 흰 카드가 어색하다고 판단되면 그때 제품 결정으로 재개(그 문서에 근거 정리돼 있음).

## P5 · 알려진 향후 한계 (낮은 우선순위, 로드맵 기재)
- [ ] 로그인 게스트의 **크로스 디바이스 RSVP 수정** — 서버 조회(유저 id/이전 응답 매칭) 필요. 지금은 localStorage 기반(같은 브라우저만).
- [ ] 마법사 basics → 비-date 테마(에디토리얼/타임라인 details, 배틀 matchInfo/countdown, 게이밍 gInfo) 자동 채움 — 커버+eventStart로 충분해 보류(로드맵 C1).
- [ ] (선택) Vercel에 `NEXT_PUBLIC_SITE_URL` 고정 — 커스텀 도메인 붙일 때만 필요.

---

## 직전 세션 요약 (이 핸드오프 직전에 배포된 것)
- 참석 정원(마감): `capacity` + 에디터 입력 + 뷰어 마감 CTA + 서버 초과 차단.
- 템플릿 갤러리 게이밍에 마인크래프트(Block Party) 카드.
- 에디터: 카운트다운 날짜 선택화, 섹션 클릭 시 인스펙터 스크롤.
- 헤더 계정 버튼 닉네임 표시, /templates 전면 한글화.
- ui-skills 설치 + improve-ui 감사 → 다크 테마 액센트 가독성 수정(`--wax-onpage`) + 빈 방명록 문구 다크 대응. 플랜은 `design-plans/`.
- 모두 `main`에 푸시됨(최신: 감사 플랜 상태 기록 커밋).
