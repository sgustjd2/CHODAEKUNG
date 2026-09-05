# 모바일 인터랙티브 초대장 웹앱 PRD

> Working title: **초대쿵 (CHODAE KUNG)**  
> Document version: v0.1  
> Product type: Mobile-first Web App / PWA  
> Primary market: Korea first, global-ready architecture

---

## 1. 제품 개요

### 1.1 한 줄 정의
사용자가 디자인 지식 없이도 사진, 문구, 폰트, 장소, 일정, 애니메이션을 조합해 **모바일에서 보기 좋은 인터랙티브 초대장**을 만들고 링크로 공유할 수 있는 웹앱.

### 1.2 해결하려는 문제
기존 모바일 청첩장 서비스는 결혼식에 특화되어 있거나, 템플릿의 자유도가 낮거나, 제작 과정이 복잡한 경우가 많다.

본 서비스는 다음 문제를 해결한다.

- 결혼식 외 일반 모임에는 예쁜 모바일 초대장 도구가 부족하다.
- 소모임·번개·정모·MT·대항전(배틀)처럼 일정 공유와 재미 요소가 중요한 모임을 위한 초대 도구가 없다.
- 디자인 툴을 다루지 못하는 사용자는 초대장을 직접 꾸미기 어렵다.
- 사진, 일정, 지도, 안내 문구, RSVP, 공유 기능이 여러 서비스로 분산된다.
- 일반 이미지 초대장은 링크 이동, 지도, 애니메이션, 참석 여부 확인 같은 상호작용을 제공하기 어렵다.
- 예쁜 페이지를 만들기 위해 개발자에게 별도 제작을 의뢰해야 하는 경우가 많다.

### 1.3 제품 목표

1. 초보 사용자가 10분 이내에 첫 초대장을 만들 수 있다.
2. 모바일 화면에서 감성적이고 고급스러운 초대 경험을 제공한다.
3. 초대 목적에 따라 페이지 구성과 테마를 쉽게 변경할 수 있다.
4. 카카오톡, 링크 복사, OS 공유 기능으로 즉시 배포할 수 있다.
5. PWA 기반으로 시작해 별도 앱 설치 없이 사용 가능하게 한다.
6. 향후 RSVP, 방명록, 유료 템플릿, 크리에이터 마켓으로 확장할 수 있는 구조를 만든다.

---

## 2. 핵심 타깃 사용자

### Persona A — 일반 사용자
- 생일 파티, 집들이, 송년회부터 러닝·배드민턴·등산·스터디 같은 소모임, 번개·정모·MT(여행), 반 대항 배틀 같은 대항전까지 준비한다.
- 디자인 툴 사용 경험이 거의 없다.
- 카카오톡으로 초대 링크를 보내고 싶다.
- 예쁘지만 제작이 복잡하지 않은 것을 원한다.

### Persona B — 행사 주최자
- 돌잔치, 브라이덜 샤워, 기업 행사, 세미나, 동호회 모임을 운영한다.
- 여러 정보를 한 페이지에 정리하고 싶다.
- 참석 여부를 확인하고 싶다.

### Persona C — 디자인 선호 사용자
- 사진, 폰트, 색상, 애니메이션을 직접 조절하고 싶다.
- 인스타그램 스토리처럼 감성적인 화면 전환을 선호한다.
- 다른 사람과 차별화된 초대장을 만들고 싶다.

---

## 3. 주요 사용 시나리오

### Scenario 1 — 생일 초대장
1. 사용자가 서비스에 접속한다.
2. `생일 파티` 템플릿을 선택한다.
3. 이름, 날짜, 시간, 장소를 입력한다.
4. 대표 사진과 갤러리 사진을 업로드한다.
5. 폰트, 배경색, 효과를 선택한다.
6. 미리보기에서 모바일 화면을 확인한다.
7. 공개 후 카카오톡으로 링크를 보낸다.

### Scenario 2 — 집들이 초대장
1. `집들이` 템플릿을 선택한다.
2. 주소와 지도 링크를 등록한다.
3. 주차, 출입 방법, 준비물 안내 섹션을 추가한다.
4. 시간별 진행표(Timeline)와 메뉴 구성(Menu) 모듈을 추가한다. (예: 18:00 집들이 시작 → 19:00 저녁 → 20:00 보드게임 / 메뉴: 파스타·치킨·와인)
5. 페이지 이동 효과를 선택한다.
6. 링크를 가족/친구 단톡방에 공유한다.

### Scenario 3 — 모임/행사 초대장
1. `모임/행사` 템플릿을 선택한다.
2. 일정과 장소를 등록한다.
3. 프로그램/타임테이블 섹션을 추가한다.
4. RSVP를 활성화한다.
5. 참석자 수를 대시보드에서 확인한다.

### Scenario 4 — 소모임·번개·정모·MT(여행)
1. `소모임` 또는 `여행 모임(MT)` 템플릿을 선택한다.
2. 모임 일정과 장소(또는 여행 일자별 일정)를 등록한다.
3. Timeline / Menu / Trip Itinerary 모듈로 진행 순서·메뉴·준비물·회비를 공유한다.
4. RSVP와 참가자 명단(Roster)을 활성화한다.
5. 단톡방에 링크를 공유하고 참석 현황을 확인한다.

### Scenario 5 — 대항전(배틀) 신청
1. `대항전/배틀` 템플릿을 선택한다.
2. 우리 팀 vs 상대 팀 정보와 경기 일시·장소·규칙을 입력한다.
3. Versus Matchup 모듈로 매치업과 스코어보드형 카운트다운을 구성한다.
4. RSVP를 "배틀 수락 / 거절"로 설정한다.
5. 상대 팀·참가자에게 링크를 보내 수락을 받는다.

---

## 4. 제품 범위

## 4.1 MVP 포함

- 회원가입/로그인
- 초대장 생성
- 초대장 템플릿 선택
- 섹션 기반 초대장 편집기
- 사진 업로드 및 갤러리
- 텍스트 편집
- 폰트 변경
- 컬러/배경 설정
- 일정 입력
- 지도/장소 링크
- 섹션 순서 변경
- 전환/등장 애니메이션
- 실시간 모바일 미리보기
- 초대장 공개/비공개
- 공유 URL 생성
- 카카오톡 공유
- 링크 복사
- 모바일 OS 공유
- Open Graph 공유 이미지/메타데이터
- 초대장 복제
- 기본 RSVP
- PWA 아이콘/manifest

## 4.2 MVP 이후

- 방명록
- 댓글/축하 메시지
- 비밀번호 초대장
- 초대장 만료일
- 참석자별 개인 초대 링크
- QR 코드
- 참석자 명단 CSV 다운로드
- 커스텀 도메인
- 프리미엄 템플릿
- AI 문구 생성
- AI 사진 배치 추천
- AI 테마 자동 생성
- 음악/BGM
- 동영상 배경
- 방문 통계
- 크리에이터 템플릿 마켓
- 공동 편집
- 다국어 초대장
- 네이티브 앱 또는 Capacitor wrapper

---

## 5. 정보 구조

### Public
- `/` 랜딩
- `/templates` 템플릿 탐색
- `/i/{slug}` 공개 초대장
- `/pricing` 요금제
- `/login`

### Authenticated
- `/dashboard`
- `/dashboard/invitations`
- `/dashboard/invitations/new`
- `/editor/{invitationId}`
- `/editor/{invitationId}/theme`
- `/editor/{invitationId}/share`
- `/editor/{invitationId}/responses`
- `/settings`

---

## 6. 핵심 사용자 플로우

### 6.1 초대장 생성

`랜딩 → 템플릿 선택 → 기본 정보 입력 → 편집기 → 미리보기 → 공개 → 공유`

### 6.2 빠른 제작 모드

`템플릿 선택 → 이름/날짜/장소/사진 입력 → 자동 완성 → 공개`

목표: 디자인 편집을 하지 않는 사용자도 최소 정보만으로 완성된 결과를 얻을 수 있어야 한다.

### 6.3 자유 편집 모드

`섹션 추가/삭제 → 드래그 정렬 → 테마 변경 → 폰트 변경 → 배경 설정 → 효과 설정 → 미리보기`

---

## 7. 초대장 섹션 시스템

초대장은 고정 HTML이 아니라 `sections[]` 기반 JSON 구조로 관리한다.

### 기본 섹션

1. **Cover**
   - 대표 사진
   - 이벤트 제목
   - 날짜
   - 짧은 서브 카피

2. **Invitation Message**
   - 초대 문구
   - 강조 문구

3. **Host / Profile**
   - 주최자 프로필
   - 사진
   - 소개

4. **Date & Time**
   - 날짜
   - 시간
   - D-Day
   - 달력
   - 캘린더 추가

5. **Location**
   - 장소명
   - 주소
   - 지도 미리보기
   - 카카오맵 링크
   - 네이버지도 링크
   - 주소 복사
   - 주차/대중교통 안내

6. **Gallery**
   - Grid
   - Masonry
   - Carousel
   - Fullscreen viewer

7. **Schedule / Timeline (시간별 진행표)**
   - 행사 프로그램 / 타임라인
   - 시간대별 진행 순서 (예: 18:00 도착·환영 → 19:00 저녁 → 20:00 게임 → 21:00 마무리)
   - 집들이·번개·정모·파티 진행 안내에 활용

8. **Notice**
   - 준비물
   - 드레스 코드
   - 주차 안내
   - 기타 공지

9. **RSVP**
   - 참석 / 불참 / 미정
   - 이름
   - 동반 인원
   - 선택 메모

10. **Guestbook** — Post-MVP 또는 Feature Flag

11. **CTA / Share**
   - 카카오톡 공유
   - 링크 복사
   - OS 공유

12. **Ending**
   - 감사 문구
   - 대표 이미지

### 카테고리별 확장 섹션 (선택형 모듈)

초대 종류에 따라 켜고 끄는 선택형 섹션. `sections[]`에 추가·재정렬한다.

13. **Menu / Food (메뉴 구성)**
   - 오늘의 메뉴 / 음식 리스트
   - 포트럭·준비물 분담

14. **Trip Itinerary (여행·MT 일정)**
   - Day 1 / Day 2 일자별 일정
   - 이동·숙소·활동, 준비물, 회비

15. **Versus Matchup (대항전·배틀)**
   - 우리 팀 vs 상대 팀 (이름/로고/컬러)
   - 경기 일시·장소·규칙, 스코어보드형 카운트다운
   - RSVP를 "배틀 수락 / 거절"로 대체

16. **Attendee / Roster (참가자 명단)**
   - 참석 인원
   - 역할·준비물 분담

### 사용자 정의 섹션

- 제목
- 본문
- 이미지
- 버튼
- Divider
- Quote

---

## 8. 편집기 요구사항

### 8.1 Desktop Editor

3-column 구조를 기본으로 한다.

- 좌측: 페이지/섹션 리스트
- 중앙: 모바일 디바이스 프리뷰
- 우측: 선택 요소 속성 패널

### 좌측 패널

- 섹션 목록
- 섹션 추가
- 드래그 앤 드롭 정렬
- 표시/숨김
- 복제
- 삭제

### 중앙 프리뷰

- 390×844 기준 모바일 프레임
- 실제 스크롤
- 페이지 모드 미리보기
- 전환 효과 즉시 반영
- Desktop / Mobile Preview 전환

### 우측 속성 패널

탭:

- Content
- Style
- Animation
- Layout

설정 예:

- 텍스트
- 폰트
- 크기
- 굵기
- 정렬
- 글자 간격
- 색상
- 배경색
- 배경 이미지
- 여백
- border radius
- opacity
- overlay
- animation type
- animation duration

### 8.2 Mobile Editor

- 상단: 뒤로가기 / 저장 상태 / 미리보기
- 중앙: 실제 초대장 미리보기
- 하단: `내용 / 디자인 / 섹션 / 효과`
- Bottom Sheet로 속성 편집

---

## 9. 템플릿 시스템

### 이벤트 카테고리

- 결혼식
- 생일
- 돌잔치
- 집들이
- 브라이덜 샤워
- 베이비 샤워
- 송년회
- 동호회
- 소모임(러닝·배드민턴·등산·스터디)
- 번개/정모
- 여행 모임(MT)
- 스포츠 관람
- 대항전/배틀
- 세미나
- 회사 행사
- 파티
- 커스텀

### 스타일 카테고리

- Romantic
- Minimal
- Editorial
- Film
- Polaroid
- Pastel
- Dark
- Retro
- Y2K
- Botanical
- Korean Modern
- Cute Character
- Developer
- Terminal
- Sports
- Versus

### 템플릿 구성

템플릿은 다음 데이터를 가진다.

- theme tokens
- default sections
- section ordering
- typography preset
- color preset
- animation preset
- sample content
- cover ratio

사용자는 템플릿 적용 후 모든 콘텐츠를 수정할 수 있다.

---

## 10. 페이지/전환 방식

사용자가 초대장 경험 방식을 선택할 수 있도록 한다.

### Mode A — Scroll
일반 모바일 청첩장 방식.

- 세로 스크롤
- 섹션 진입 시 reveal animation
- 가장 안정적인 기본 모드

### Mode B — Story
Instagram Story 같은 한 화면 단위 경험.

- 세로 또는 가로 swipe
- 한 페이지씩 snap
- 페이지 progress indicator
- 이미지 중심 템플릿에 적합

### Mode C — Magazine
에디토리얼/앨범 느낌.

- full viewport section
- parallax
- large typography
- photo transition

### Animation Presets

- None
- Fade
- Fade Up
- Slide Left
- Slide Right
- Zoom In
- Blur Reveal
- Scale Reveal
- Parallax
- Page Swipe

### 접근성

`prefers-reduced-motion` 사용자는 애니메이션을 최소화하거나 제거한다.

---

## 11. 디자인 시스템

### 11.1 기본 철학

- Mobile first
- 콘텐츠가 디자인보다 우선
- 사진이 주인공
- 감성적이되 편집 UI는 최대한 단순하게
- 제작 화면과 초대장 화면의 시각 언어를 분리

### 11.2 Editor UI

- Neutral background
- 8pt spacing system
- Radius 12~16px
- 카드 기반
- 강한 border보다 subtle separator
- 충분한 whitespace

### 11.3 Invitation UI

테마별 토큰으로 완전히 변경 가능.

기본 팔레트 방향:
- 밝고 경쾌한 파스텔 + 아이보리/웜 화이트 베이스를 기본으로 한다.
- 어둡고 무거운 실링왁스/버건디/딥 마룬 톤은 기본 테마에서 지양하고, 다크 모드나 Dark/Developer/Terminal 스타일에서만 사용한다.
- accent 예시: peach, coral, blush, lavender, sky blue, mint, sage, butter yellow (모두 밝은 파스텔 채도)

```ts
ThemeTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  sectionBackgrounds,
  animationPreset
}
```

---

## 12. 폰트

### 요구사항

- 폰트 변경 즉시 preview
- 한글/영문 폰트 구분
- 제목/본문 별도 지정 가능
- 사용 가능한 폰트를 whitelist 방식으로 제공
- 웹폰트 로딩 실패 시 fallback 지정

### 초기 폰트 분류 예시

- Sans
- Serif
- Handwriting
- Rounded
- Display

성능을 위해 한 초대장에 동시에 로드되는 웹폰트 패밀리를 제한한다.

---

## 13. 이미지 시스템

### 업로드

- JPG
- PNG
- WebP
- HEIC 입력 시 서버 또는 클라이언트 변환 검토

### 처리

- 최대 업로드 크기 제한
- resize
- thumbnail 생성
- WebP/AVIF 변환
- EXIF metadata 제거
- blur placeholder 생성

### UX

- Drag & Drop
- 모바일 사진 선택
- 이미지 crop
- focal point 선택
- 갤러리 순서 변경

---

## 14. 장소/지도

### 입력 정보

- 장소명
- 주소
- 상세 위치
- latitude
- longitude
- 주차 안내
- 교통 안내

### 버튼

- 카카오맵 열기
- 네이버지도 열기
- 주소 복사

초기 MVP에서는 지도 SDK를 깊게 통합하기보다 **장소 검색 + 외부 지도 링크** 중심으로 구현해 복잡도를 낮춘다.

---

## 15. 공유 기능

### 기본 공유

- 카카오톡 공유
- 링크 복사
- Web Share API
- QR 코드(Post-MVP 가능)

### 카카오톡

웹에서는 Kakao JavaScript SDK의 `Kakao.Share` 모듈 사용을 기본으로 한다.

공유 카드에는 다음 정보가 표시되어야 한다.

- 대표 이미지
- 초대장 제목
- 날짜
- 장소 또는 짧은 설명
- `초대장 보기` CTA

주의:

- 카카오 개발자 앱 설정 필요
- JavaScript Key 사용
- JavaScript SDK 도메인 등록 필요
- 공유 메시지 링크에 사용하는 웹 도메인은 Product Link 설정과 일치하도록 관리

공식 문서:
- https://developers.kakao.com/docs/ko/kakaotalk-share/js-link
- https://developers.kakao.com/docs/ko/message-template/default

### 일반 링크 공유

각 공개 페이지는 Open Graph 메타데이터를 제공한다.

- `og:title`
- `og:description`
- `og:image`
- `og:url`

초대장별 대표 이미지를 OG 이미지로 사용하거나 동적 OG 이미지를 생성한다.

---

## 16. RSVP

### 게스트 입력

- 이름
- 참석 여부
- 동반 인원
- 메시지(선택)

### 제작자 화면

- 총 응답 수
- 참석
- 불참
- 미정
- 예상 참석 인원

### 개인정보

- 초대장 제작자가 RSVP 수집 여부를 명확히 활성화해야 한다.
- 공개 페이지에서 참석자 명단은 기본적으로 노출하지 않는다.
- 삭제/보관 정책을 제공한다.

---

## 17. 공개 상태

### Draft
제작자만 접근 가능.

### Unlisted
URL을 아는 사용자만 접근 가능.

### Public
검색 노출을 허용하는 공개 상태.

MVP 기본값은 `Unlisted`이며 검색 엔진 `noindex`를 권장한다.

---

## 18. 사용자 대시보드

### 카드 정보

- Cover thumbnail
- 초대장 제목
- 행사 날짜
- 상태
- 마지막 수정일
- 조회수(Post-MVP 가능)

### Action

- 편집
- 미리보기
- 공유
- 복제
- 삭제

---

## 19. 랜딩 페이지

### Hero

Headline 예시:

> 초대하는 순간까지, 예쁘게.

Subcopy:

> 사진과 문구만 넣으면 완성되는 나만의 모바일 초대장.

CTA:

- 무료로 만들기
- 템플릿 구경하기

### Section

1. 실제 초대장 mockup
2. 카테고리별 템플릿
3. 3-step 제작 과정
4. 사진/폰트/효과 편집 기능
5. 카카오톡 공유 preview
6. 사용 예시
7. Pricing
8. FAQ

---

## 20. 브랜드/캐릭터 방향

### 추천 Working Brand

**초대쿵 / CHODAE KUNG**

의미:
- `초대`를 보내는 순간
- `쿵`은 설레는 심장 소리이자 임팩트 있게 도착하는 초대장의 느낌
- 결혼식에 한정되지 않고 모든 초대에 확장 가능

### Mascot Concept

이름: **모모 (MOMO)**

형태:
- 작은 봉투/카드 모양의 둥근 캐릭터
- 봉투 flap이 머리 또는 귀처럼 보임
- 얼굴은 dot eyes + 작은 smile
- 상황별 스티커처럼 활용 가능

상태:

- 기본
- 초대장 만드는 모모
- 편지를 들고 뛰는 모모
- 카메라를 든 모모
- 지도 핀을 든 모모
- 파티 모자를 쓴 모모
- 축하 꽃가루 모모

앱 아이콘:

- rounded square
- 중앙에 봉투 형태 모모 얼굴
- 작은 sparkle 또는 heart seal
- 매우 작은 크기에서도 인식 가능한 단순한 실루엣

---

## 21. 이름 후보

> 아래 이름은 아이디어 후보이며, 실제 사용 전 상표/도메인/앱스토어 중복 검토가 필요하다.

| 이름 | 영문 | 방향 |
|---|---|---|
| 초대쿵 | CHODAE KUNG | 초대 + 쿵(설레는 임팩트), 짧고 기억하기 쉬움 |
| 모이모이 | MOIMOI | 귀엽고 캐릭터화 쉬움 |
| 초대해 | CHODAEHAE | 한국어 직관성 |
| 모이링 | MOIRING | 모임 + 연결되는 느낌 |
| 인바이티 | INVITEE | 글로벌하고 직관적 |
| 메리데이 | MERRYDAY | 즐거운 날/이벤트 중심 |
| 디어데이 | DEARDAY | 감성적, 편지 같은 브랜드 |
| 온리데이 | ONLYDAY | 특별한 하루 강조 |
| 모먼트카드 | MOMENT CARD | 사진/기록 중심 |
| 데이레터 | DAY LETTER | 행사 초대 편지 느낌 |
| 모이카드 | MOI CARD | 간결한 제품명 |
| 위드데이 | WITHDAY | 함께하는 날이라는 의미 |

### 추천 순위

1. **초대쿵 (CHODAE KUNG)** — 짧고 기억하기 쉽고 초대의 설렘을 직관적으로 전달
2. **디어데이 (DEARDAY)** — 감성형 프리미엄 디자인에 적합
3. **모이모이 (MOIMOI)** — 캐릭터/IP 확장에 가장 유리

---

## 22. 기술 아키텍처 권장안

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui 또는 자체 디자인 시스템
- Motion / Framer Motion 계열 애니메이션
- dnd-kit: 섹션 drag & drop
- React Hook Form + Zod

### Backend

- Next.js Server Actions / Route Handlers 또는 별도 API
- PostgreSQL
- Prisma 또는 Drizzle ORM

### 권장 인프라

- Vercel: Web/App Hosting
- Neon PostgreSQL 또는 Supabase PostgreSQL
- Cloudflare R2 / Supabase Storage / S3-compatible storage: 이미지

Vercel 런타임의 로컬 파일 시스템에 사용자 이미지를 영구 저장하지 않는다.

### Authentication

초기:
- Email magic link 또는 Google

확장:
- Kakao Login
- Apple

카카오톡 공유는 Kakao Login과 분리해서 구현 가능하다.

### Analytics

- 기본 이벤트 로그
- PostHog / GA4 검토

---

## 23. 데이터 모델 초안

### User

```text
id
email
name
avatarUrl
createdAt
updatedAt
```

### Invitation

```text
id
userId
title
slug
eventType
status
coverImageUrl
eventDate
venueName
address
latitude
longitude
themeId
viewMode
seoIndexable
publishedAt
createdAt
updatedAt
```

### InvitationSection

```text
id
invitationId
type
order
isVisible
contentJson
styleJson
animationJson
```

### Asset

```text
id
userId
invitationId
type
originalUrl
optimizedUrl
thumbnailUrl
width
height
size
createdAt
```

### RSVPResponse

```text
id
invitationId
name
status
guestCount
message
createdAt
```

### Theme

```text
id
name
category
thumbnailUrl
tokensJson
defaultSectionsJson
isPremium
```

---

## 24. API 초안

```text
POST   /api/invitations
GET    /api/invitations
GET    /api/invitations/:id
PATCH  /api/invitations/:id
DELETE /api/invitations/:id

POST   /api/invitations/:id/publish
POST   /api/invitations/:id/duplicate

POST   /api/invitations/:id/sections
PATCH  /api/sections/:sectionId
DELETE /api/sections/:sectionId
POST   /api/invitations/:id/sections/reorder

POST   /api/assets/upload
DELETE /api/assets/:assetId

POST   /api/invitations/:id/rsvp
GET    /api/invitations/:id/rsvp
```

---

## 25. 자동 저장

- 편집 변경은 debounce 800~1500ms 후 자동 저장
- 저장 상태 표시
  - Saving…
  - Saved
  - Error
- 네트워크 오류 시 local draft 보존
- 사용자가 페이지를 닫기 전 미저장 상태가 있으면 보호

---

## 26. 성능 요구사항

초대장 수신자는 대부분 카카오톡 인앱 브라우저 또는 모바일 브라우저에서 접속한다고 가정한다.

### 목표

- 초기 JS 최소화
- 이미지 lazy loading
- 첫 화면 이미지 priority loading
- AVIF/WebP 제공
- dynamic import
- animation bundle 최소화
- 모바일 저사양 기기에서도 부드러운 스크롤

### Web Vitals 목표

- LCP: 2.5초 이하를 목표
- CLS: 0.1 이하
- INP: 200ms 이하를 목표

네트워크 상태에 따라 degraded experience를 허용하되 핵심 콘텐츠는 반드시 표시되어야 한다.

---

## 27. 접근성

- 충분한 color contrast
- 이미지 alt 입력 가능
- keyboard focus
- semantic HTML
- button/link 역할 명확화
- 폰트 최소 크기 가이드
- `prefers-reduced-motion` 지원
- 텍스트가 이미지에만 존재하지 않도록 구성

---

## 28. 개인정보/보안

- 초대장 기본 `noindex`
- 초대장 삭제 시 연결된 업로드 asset 정리
- 이미지 EXIF 제거 권장
- 업로드 MIME/type 검증
- rate limiting
- RSVP endpoint abuse 방지
- guestbook 도입 시 spam filter
- 공개 초대장에 전화번호 등 개인정보를 넣을 경우 사용자 경고
- 비밀번호 보호 기능 Post-MVP

---

## 29. 요금제 아이디어

### Free

- 초대장 1개 활성화
- 기본 템플릿
- 기본 폰트
- 이미지 수 제한
- 서비스 워터마크

### Plus

- 초대장 여러 개
- 프리미엄 템플릿
- 워터마크 제거
- 고급 애니메이션
- 추가 갤러리
- RSVP 관리

### Pro / Creator

- 커스텀 URL
- 커스텀 브랜드
- 통계
- 템플릿 판매
- 이벤트 운영 기능

MVP 출시 전 결제는 제외하고 모든 핵심 제작 기능을 무료 베타로 운영하는 것도 권장한다.

---

## 30. 핵심 이벤트 분석

```text
landing_view
signup_start
signup_complete
template_view
template_select
invitation_create
section_add
photo_upload
preview_open
publish_complete
share_kakao
share_copy_link
share_native
rsvp_submit
```

### 주요 Funnel

`Landing → Template Select → Create → Preview → Publish → Share`

---

## 31. MVP 성공 지표

- 초대장 생성 시작 대비 Publish 전환율 ≥ 50%
- 첫 초대장 제작 중앙값 ≤ 10분
- Published invitation의 공유 실행률 ≥ 70%
- 초대장 모바일 오류율 < 1%
- 제작 세션 중 자동 저장 실패율 < 0.5%

초기 베타에서는 숫자 자체보다 이탈 단계 파악을 우선한다.

---

## 32. MVP 우선순위

### P0 — 반드시 필요

- Auth
- Dashboard
- Template select
- Invitation editor
- Text editing
- Photo upload
- Font/theme
- Date/time
- Location/link
- Section reorder
- Mobile preview
- Publish
- Public invitation
- Link copy
- Kakao share
- OG metadata

### P1 — 출시 품질

- Animations
- RSVP
- Duplicate
- PWA
- image optimization
- autosave recovery

### P2 — 출시 후

- Guestbook
- analytics dashboard
- password
- QR
- premium plans
- AI generation

---

## 33. 개발 단계 제안

### Phase 1 — Foundation

- 프로젝트 세팅
- DB schema
- Auth
- Dashboard
- Invitation CRUD

### Phase 2 — Editor Core

- Section architecture
- Mobile preview
- Theme tokens
- Drag & Drop
- Text/style editing
- Autosave

### Phase 3 — Media & Place

- Image upload
- Gallery
- Image optimization
- Location
- Date/time

### Phase 4 — Viewer

- Public invitation route
- Scroll/Story mode
- animation
- responsive QA
- OG metadata

### Phase 5 — Sharing & RSVP

- Kakao Share
- Web Share
- Link copy
- RSVP

### Phase 6 — Launch QA

- Mobile Safari
- Android Chrome
- Kakao in-app browser
- performance
- accessibility
- security

---

## 34. MVP 상세 Acceptance Criteria

### 초대장 생성

- [ ] 사용자가 템플릿을 선택하고 새 초대장을 생성할 수 있다.
- [ ] 생성된 초대장은 Draft 상태로 저장된다.

### 편집

- [ ] 제목/본문/날짜/장소를 수정할 수 있다.
- [ ] 사진을 업로드하고 제거할 수 있다.
- [ ] 섹션 순서를 drag & drop으로 변경할 수 있다.
- [ ] 섹션을 표시/숨김할 수 있다.
- [ ] 최소 5종 이상의 폰트 preset을 제공한다.
- [ ] 색상 preset을 적용할 수 있다.
- [ ] 변경 사항이 자동 저장된다.

### 효과

- [ ] 최소 5개 animation preset을 제공한다.
- [ ] 사용자가 animation을 None으로 설정할 수 있다.
- [ ] reduced motion 환경에서 과도한 animation을 비활성화한다.

### 공개

- [ ] Publish 시 고유 slug가 생성된다.
- [ ] 모바일 브라우저에서 초대장이 정상 표시된다.
- [ ] 초대장 기본 상태는 noindex이다.

### 공유

- [ ] 링크 복사가 동작한다.
- [ ] 지원 환경에서 Web Share API가 동작한다.
- [ ] 카카오톡 공유 버튼이 동작한다.
- [ ] 공유 카드에 이미지/제목/CTA가 표시된다.

### RSVP

- [ ] 방문자가 참석 상태와 이름을 제출할 수 있다.
- [ ] 제작자가 응답 목록과 총 인원을 볼 수 있다.

---

## 35. MVP에서 의도적으로 하지 않을 것

- Canva 수준의 자유 좌표 편집
- 임의 SVG/path 편집
- 복잡한 timeline video editor
- 다중 사용자 실시간 공동 편집
- 네이티브 iOS/Android 앱 동시 개발
- 자체 지도 엔진
- 템플릿 marketplace

초기 제품은 **섹션 기반 편집**으로 제한해 모바일 품질과 제작 속도를 확보한다.

---

## 36. 레퍼런스에서 가져갈 UX 원칙

참고한 모바일 청첩장 데모는 다음처럼 정보를 순차적으로 보여준다.

- Hero / Cover
- 초대 문구
- 주인공 정보
- 행사 일시
- 장소와 길찾기
- 갤러리
- 안내
- 축하/응답
- 마무리

또한 동일한 콘텐츠를 파스텔/개발자/터미널처럼 전혀 다른 시각 스타일로 표현할 수 있다는 점이 핵심 아이디어다.

우리 제품에서는 이 개념을 일반화해 **콘텐츠 구조는 유지하고 Theme Token + Typography + Motion Preset만 바꿔 완전히 다른 초대장으로 보이게 하는 구조**를 채택한다.

Reference:
- https://wedding-demo.eunice1497.workers.dev/

---

## 37. 최종 제품 원칙

> **쉽게 만들고, 예쁘게 보여주고, 바로 초대한다.**

제품 우선순위는 다음 순서로 판단한다.

1. 제작이 쉬운가?
2. 모바일에서 예쁜가?
3. 공유가 쉬운가?
4. 페이지가 빠른가?
5. 사용자가 원하는 만큼 커스터마이징 가능한가?

MVP에서는 자유도보다 **완성도 높은 결과를 빠르게 만드는 것**을 우선한다.
