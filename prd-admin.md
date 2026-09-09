# PRD — 관리자 페이지 (Admin Console)

작성: 2026-09-09. 본 문서는 `prd.md`의 부속 PRD로, 운영자가 유저와 초대장을 관리하는 관리자 콘솔을 정의한다.
`CLAUDE.md` §14(기존 auth/데이터 경계 우회 금지) 준수 — 관리자 기능은 서버에서만 권한을 확인하고, 관리자 전용
서버 액션을 통해서만 경계를 넘는다.

## 1. 배경 & 목표

현재 유저는 Supabase `auth.users`, 초대장은 `public.invitations`(owner_id FK)로 저장된다. 운영자가 전체 유저와
초대장을 들여다보고 관리(부적절 초대장 내리기/삭제, 유저 상태 관리)할 수단이 없다. 이 PRD는 **단일 관리자 콘솔
(`/admin`)** 을 추가해 다음을 가능케 한다:

- **유저 관리**: 전체 유저 목록/검색, 가입일·최근 로그인·보유 초대장 수 확인, (결정 범위에 따라) 티어 부여/정지/삭제.
- **초대장 관리**: 전체 초대장 목록/검색, 소유자·공개상태·조회수 확인, 뷰어로 열기, 공개중지(takedown), 삭제.
- **운영 지표**: 총 유저/초대장/공개중/총 조회수 요약.

비목표(v1 제외): 감사 로그 UI, 역할 세분화(여러 관리자 등급), 대량 일괄작업, CSV 내보내기, 결제/환불 처리.

## 2. 권한 모델 (보안 핵심)

- 관리자는 **서버에서만** 판별한다. 클라이언트로 관리자 여부나 관리자 데이터가 새지 않는다.
- **관리자 지정 방식 — 결정됨(2026-09-09): 별도 DB 테이블 `public.admins`(이메일 키).** 재배포 없이 행 추가/삭제로 관리자 관리.
  - `getAdminUser()` = `getCurrentUser()`의 이메일(소문자)이 `admins` 테이블에 있으면 유저 반환, 아니면 null.
  - `admins`는 RLS on + **공개 정책 없음** → 서버(service role)만 읽음. 첫 관리자는 마이그레이션에서 시드(운영 이메일로 교체).
  - 관리자 추가/삭제는 v1에선 DB 직접(SQL/서비스키) — 관리자 관리 UI는 비목표.
- 모든 관리자 서버 액션은 호출 시작부에서 `requireAdmin()`으로 재확인(페이지 게이트만 믿지 않음).
- 관리자 데이터 접근은 전적으로 **service-role 클라이언트**(`getServiceClient()`, RLS 우회)와 Supabase
  **Admin API**(`auth.admin.listUsers()` 등)를 통한다. 새 RLS 정책은 추가하지 않는다(경계를 넓히지 않기 위해).

## 3. 페이지 & 라우트

- `/admin` — 서버 컴포넌트. `getAdminUser()`; null이면 로그인 안 된 경우 `/login`, 로그인했지만 관리자가
  아니면 `/dashboard`로 리다이렉트(관리자 콘솔의 존재를 비관리자에게 드러내지 않음: 404 대신 조용한 이탈).
  초기 데이터(유저 목록 + 초대장 목록 + 지표)를 서버에서 로드해 `AdminClient`에 전달.
- 헤더 계정 메뉴(`account-menu.tsx`)에는 **관리자일 때만** "관리자" 링크 노출(서버에서 주입).

## 4. 기능 상세

### 4.1 초대장 관리 (core — 논쟁 여지 적음, 기본 포함)
- 목록: slug, 제목, 테마, 소유자(이메일), 공개상태(draft/unlisted/published), 조회수, 수정일. 최신순.
- 검색: 제목/slug/소유자 이메일 부분일치(서버 필터 또는 클라 필터, v1은 로드 후 클라 필터 + 페이지네이션).
- 행 동작:
  - **열기**: `/i/{slug}` 새 탭(공개) 또는 `/preview`(초안)로 확인.
  - **공개중지(takedown)**: visibility → `draft` (게시 취소). **복구**: 다시 `published`.
  - **삭제**: 초대장 + 해당 RSVP + 방명록 행 삭제. 2단계 확인(window.confirm 또는 모달).

### 4.2 유저 관리
- 목록: 이메일, 닉네임(user_metadata.name), 가입일, 최근 로그인, 보유 초대장 수.
- 검색: 이메일/닉네임 부분일치.
- 행 동작 — **범위 결정 필요(§7 Q2)**. 항상 포함: 보기(해당 유저의 초대장 목록으로 필터). 선택 항목:
  - **프리미엄 티어 부여/회수**: 해당 유저의 초대장 `data.tier` 설정(D1 scaffold 연동). ※ D1에서 tier는 추후
    서버권위 컬럼으로 이전 예정이므로, 이 동작은 scaffold 한정이며 결제와 무관한 수동 부여로 표기.
  - **계정 정지(ban)**: `auth.admin.updateUserById(id, { ban_duration })`. 해제 가능.
  - **계정 삭제**: `auth.admin.deleteUser(id)` + 해당 유저 초대장/RSVP/방명록 삭제. 비가역 — 강한 확인.

### 4.3 운영 지표 (상단 요약)
- 총 유저 수, 총 초대장 수, 공개중(published) 수, 총 조회수 합.

## 5. 데이터 접근 (구현 매핑)
신규 `src/lib/db/admin.ts`(게이트) + `src/lib/invitation/admin-store.ts`(쿼리) + admin 서버 액션.
- `listAllInvitations()` — service-role select 전체 + RSVP 카운트 + 소유자 이메일 매핑(`auth.admin.listUsers()`로 id→email 맵).
- `adminDeleteInvitation(slug)` / `adminSetVisibility(slug, v)` — 소유자 검사 없이(관리자) 수행.
- `listAllUsers()` — `auth.admin.listUsers()` → {id, email, name, createdAt, lastSignInAt, invitationCount}.
- (범위에 따라) `adminSetInvitationTier` / `adminBanUser` / `adminDeleteUser`.
- 각 쓰기 액션은 `requireAdmin()` 선행.

## 6. UI/디자인
- 기존 디자인 시스템 재사용(`tokens.css`, 대시보드/미디어의 sticky top + wrap 레이아웃, `.btn`/`.card`/테이블 스타일).
- 새 시각 언어 도입 금지(CLAUDE.md §4). 탭(초대장/유저) = 기존 `SegmentedControl`/탭 패턴 재사용.
- 파괴적 동작(삭제/정지)은 확인 단계 + `--danger`/`--wax-deep` 톤. 접근성: 포커스·라벨·키보드(§10).
- 반응형: 데스크톱 테이블 → 모바일 카드/스크롤.

## 7. 결정 (2026-09-09 확정)
- **Q1. 관리자 지정 방식** → **별도 DB 테이블 `public.admins`(이메일 키).**
- **Q2. 유저 관리 동작 범위** → **전부 포함**: 목록 보기 + 프리미엄 티어 부여/회수 + 계정 정지(ban) + 계정 삭제(비가역).
  - 티어는 모델상 초대장 단위이므로 "유저 프리미엄 부여/회수"는 그 유저의 **모든 초대장** `data.tier` 일괄 설정으로 구현.
  - 계정 삭제는 owner_id가 `on delete set null`이라, 유저 삭제 전 그 유저 초대장부터 삭제(→ rsvps·guestbook cascade)한 뒤 `auth.admin.deleteUser`.

## 8. 검증
- `tsc` + `eslint` + `next build`(worktree는 `--webpack`). 관리자 게이트 단위 확인(비관리자→리다이렉트,
  액션이 requireAdmin으로 차단). 서비스키 REST로 seed한 테스트 유저/초대장으로 목록·takedown·삭제 동작 확인 후 정리
  (`db-verification-workflow` 메모리).
- 보안 확인: service key·관리자 목록이 클라이언트 번들에 없는지(service key/admins 조회는 서버 전용 모듈).
- **구현 결과(2026-09-09)**: tsc + eslint 0 + `next build --webpack` 통과. 서비스키 읽기 스모크 — `auth.admin.listUsers()`
  정상, 초대장 6건, `admins` 테이블 미적용 상태에서 fail-safe(관리자 접근 차단) 확인. 시드 이메일이 실제 로그인
  유저임을 확인. 남은 것: 사용자가 마이그레이션 0006 적용 후 로그인 상태에서 인터랙티브 동작 확인.
