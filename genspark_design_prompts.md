# Genspark Design Prompts — 모바일 인터랙티브 초대장 웹앱

## 1. 전체 제품 UX/UI 디자인 프롬프트

당신은 시니어 Product Designer이자 Mobile-first SaaS UX 전문가다.

`모이레터(MOI LETTER)`라는 모바일 인터랙티브 초대장 제작 웹앱의 전체 UX/UI를 디자인하라.

제품 목적은 사용자가 디자인 지식 없이도 사진, 문구, 폰트, 색상, 장소, 일정, 갤러리, RSVP, 애니메이션을 조합해 모바일 초대장을 만들고 카카오톡이나 URL로 공유하게 하는 것이다.

이 서비스는 모바일 청첩장의 감성적인 경험을 결혼식에 한정하지 않고 생일, 집들이, 돌잔치, 브라이덜 샤워, 송년회, 동호회, 파티, 세미나, 회사 행사 등 모든 모임으로 확장한다.

### 핵심 UX 원칙
- Mobile-first
- 초보자가 10분 이내에 초대장 제작 가능
- Canva처럼 복잡한 자유 좌표 편집이 아니라 Section-based editor
- 제작 화면은 단순하고 도구적이며, 실제 초대장 화면은 감성적이고 몰입감 있게
- 사진이 주인공
- 한글 타이포그래피 품질을 중요하게 고려
- 카카오톡 인앱 브라우저에서도 자연스럽게 보여야 함
- 지나친 장식보다 whitespace, typography, photo, subtle motion으로 고급스럽게 표현

### Brand
- Brand name: 모이레터 / MOI LETTER
- Keyword: invitation, gathering, letter, moment, warm, playful, elegant
- Brand character: MOMO
- MOMO는 작은 봉투/카드 모양의 둥근 캐릭터이며 봉투 flap이 머리나 귀처럼 보인다.
- 얼굴은 작은 점 눈과 미소로 단순하게 표현한다.
- 너무 유아적이지 않고 20~40대도 사용할 수 있는 세련된 cute style.

### Visual direction
- Korean contemporary lifestyle app
- Editorial + warm minimal
- soft ivory / warm white base
- charcoal text
- peach, coral, lavender, sage 계열은 accent preset으로 활용
- radius 12~18px
- subtle shadow
- clean iconography
- generous spacing
- modern Korean typography
- minimal but emotional

### 반드시 디자인할 Desktop/Web 화면
1. Landing page
2. Template gallery
3. Login / onboarding
4. Dashboard invitation list
5. New invitation wizard
6. Desktop invitation editor
7. Theme / font selector
8. Section add modal
9. Image gallery manager
10. Publish & Share modal
11. RSVP dashboard
12. Pricing page
13. Settings

### Desktop Editor 핵심 구조
3-column layout:
- Left: section/page navigator
- Center: 390×844 mobile preview device
- Right: property inspector

Left panel:
- section cards
- drag handle
- show/hide
- duplicate
- delete
- Add section button

Center preview:
- 실제 모바일 초대장 실시간 preview
- Scroll / Story / Magazine mode toggle
- zoom control
- mobile/desktop preview toggle

Right inspector tabs:
- Content
- Style
- Layout
- Animation

Style controls:
- font family
- font size
- weight
- letter spacing
- alignment
- text color
- background
- overlay
- padding
- border radius

Animation controls:
- None
- Fade
- Fade Up
- Slide
- Zoom
- Blur Reveal
- Parallax

### 반드시 디자인할 Mobile App/PWA 화면
1. Mobile home/dashboard
2. Template selection
3. Quick creation wizard
4. Mobile editor
5. Bottom sheet style editor
6. Section reorder screen
7. Photo picker/gallery editor
8. Mobile preview
9. Publish screen
10. Share screen
11. RSVP responses

Mobile editor 구조:
- Top: back / invitation title / save state / preview
- Center: invitation live preview
- Bottom navigation: 내용 / 디자인 / 섹션 / 효과
- 선택 시 bottom sheet가 열려 속성을 편집

### 실제 초대장 Viewer 화면도 별도로 디자인
다음 종류를 각각 디자인하라.

A. Romantic Wedding
B. Minimal Birthday
C. Cute Housewarming
D. Editorial Party
E. Developer / Terminal themed invitation

Viewer의 기본 콘텐츠:
- Cover
- Invitation message
- Date & countdown
- Calendar
- Location
- Kakao Map / Naver Map buttons
- Gallery
- Schedule
- Notice
- RSVP
- Share
- Ending

### Viewer interaction
- Scroll mode
- Story mode with swipe and page progress
- Magazine mode with fullscreen section
- smooth section reveal
- parallax photo
- gallery fullscreen viewer
- bottom sticky share button is optional and non-intrusive

### States
각 주요 화면에 대해 다음 상태를 함께 디자인하라.
- empty
- loading
- saving
- saved
- upload progress
- error
- published

### Deliverables
- Sitemap
- User flow
- Information architecture
- Design tokens
- Typography system
- Color system
- Component library
- Desktop wireframes
- Mobile wireframes
- High-fidelity key screens
- Responsive behavior notes
- Interaction notes
- Empty/error/loading states
- Character usage examples

결과물은 단순 예쁜 목업이 아니라 개발자가 바로 구현할 수 있도록 spacing, component hierarchy, state, interaction까지 명확하게 보여줘.

---

## 2. 캐릭터 디자인 프롬프트

Design an original mascot character named `MOMO` for a Korean mobile invitation web app called `MOI LETTER`.

MOMO is a tiny rounded envelope / invitation card creature.
The envelope flap subtly works like hair or ears.
Use tiny dot eyes and a small warm smile.
The character should feel friendly, tasteful, modern and emotionally warm, not childish or overly cartoonish.

Style:
- contemporary Korean lifestyle brand mascot
- simple geometric silhouette
- soft rounded shapes
- minimal facial features
- flat vector style
- subtle paper texture optional
- scalable from 24px UI sticker to large marketing illustration
- easy to animate

Create a consistent character sheet with:
1. default standing MOMO
2. MOMO holding an invitation card
3. MOMO running while delivering a letter
4. MOMO holding a camera
5. MOMO holding a location pin
6. MOMO wearing a party hat
7. MOMO celebrating with confetti
8. MOMO saying thank you
9. MOMO waiting for RSVP
10. MOMO peeking from behind a mobile phone

Also provide:
- front view
- side view
- simplified icon version
- monochrome version
- sticker variations
- expression set

Avoid copying existing messaging app mascots or famous character IP.
Make the silhouette distinct enough to become a recognizable standalone brand asset.

---

## 3. 앱 아이콘 디자인 프롬프트

Create an app icon for `MOI LETTER`, a mobile invitation creator.

Use the MOMO mascot as the central symbol.
MOMO is a tiny rounded envelope creature with a simple smile.

Icon requirements:
- rounded-square app icon
- extremely simple silhouette
- recognizable at 32px
- minimal envelope shape
- small heart seal or sparkle accent
- no text inside icon
- modern Korean lifestyle app aesthetic
- sophisticated rather than childish
- suitable for iOS, Android PWA, favicon and social avatar

Generate 6 variations:
1. ivory background + coral MOMO
2. coral background + ivory MOMO
3. lavender accent
4. sage accent
5. monochrome black/white
6. premium dark mode version

Also show the selected icon as:
- iOS home screen icon
- Android/PWA icon
- favicon
- social profile avatar

---

## 4. 초대장 템플릿 디자인 프롬프트

Create five visually distinct mobile invitation templates for `MOI LETTER` while using exactly the same information architecture.

Common sections:
Cover → Invitation Message → Date → Countdown → Calendar → Location → Gallery → Schedule → Notice → RSVP → Share → Ending.

Template 1 — Romantic
- elegant serif typography
- large portrait photography
- ivory / blush
- subtle floral detail
- soft fade animations

Template 2 — Minimal
- Swiss/editorial grid
- bold Korean typography
- black / white / neutral
- strong whitespace
- restrained animation

Template 3 — Cute
- MOMO mascot accents
- warm pastel colors
- rounded cards
- playful but premium

Template 4 — Film / Editorial
- analog film frame
- grain texture
- photo captions
- magazine typography
- fullscreen image transitions

Template 5 — Developer / Terminal
- dark interface
- monospace typography
- command line inspired copy
- calendar/countdown visualized as system UI
- still polished enough for a real invitation

For every template, design both Scroll Mode and Story Mode.
Keep all important information easy to read on a 390px-wide mobile viewport.

---

## 5. 저해상도 와이어프레임 전용 프롬프트

Create LOW-FIDELITY grayscale wireframes only. Do not add branding, decorative illustration or final colors.

Product: mobile-first invitation builder web app.

Focus on structure and UX hierarchy.

Screens:
1. Landing
2. Template gallery
3. Dashboard
4. New invitation wizard
5. Desktop editor
6. Mobile editor
7. Section add
8. Theme/font picker
9. Media manager
10. Preview
11. Publish/share
12. RSVP dashboard
13. Public invitation viewer

Desktop editor must use three columns:
left section navigator / center phone preview / right properties.

Mobile editor must use:
top app bar / live preview / bottom editing navigation / bottom sheet editor.

For each screen annotate:
- primary action
- secondary action
- navigation
- scroll behavior
- sticky elements
- modal/bottom sheet behavior
- empty state
- error state

Use realistic Korean labels in the wireframe.
