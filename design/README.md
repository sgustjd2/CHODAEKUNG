# Handoff: 초대쿵 (CHODAEKUNG) — Mobile Invitation Web App

## Overview

**초대쿵 (CHODAEKUNG)** is a mobile-first interactive invitation web app that lets users create, customize, and share invitations for every kind of gathering — from weddings and first-birthday parties to housewarmings, morning-soccer battles, League of Legends parties, and hiking meetups. The brand's identity is the "wax seal stamp" (실링왁스): users press a big "쿵" seal onto their invitation and share it via KakaoTalk.

The design set covers the full product surface: brand system, landing, template gallery, dashboard, invitation wizard, desktop & mobile editors, publish/share modal, RSVP dashboard, and **8 distinct invitation viewer themes**.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. Each `.html` file is a self-contained, statically-rendered mockup that references a shared design-token CSS file (`assets/tokens.css`) and an SVG icon sprite (`assets/moi-symbols.svg`).

**The task is to recreate these HTML designs in the target codebase's existing environment** (React, Vue, SwiftUI, Flutter, native, etc.) using its established patterns and libraries. If no environment exists yet, choose the most appropriate stack for the project (the PRD recommends **Next.js + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + Prisma + PostgreSQL**, hosted on Vercel with images on Cloudflare R2/Supabase Storage — see PRD §22).

## Fidelity

**High-fidelity (hifi).** These are pixel-precise mockups with final:
- Colors (exact hex values in tokens)
- Typography (Pretendard Variable + Manrope + DM Mono, with defined weights/sizes/line-heights/letter-spacing)
- Spacing (4px scale)
- Border radii (8/12/16/20/24/32/100 scale)
- Shadow system (6 tiers, ink-tinted)
- Interactions (hover states, transitions, checked states)
- Copy (exact Korean UX text)

Recreate them pixel-perfectly using the target codebase's libraries. Photos are AI-generated placeholders — the product will accept user uploads.

---

## Screens / Views

The 18 mockups fall into 4 groups. Below is a summary; per-screen implementation notes are inline.

### Group A — Brand & Marketing

| # | File | Screen | Purpose |
|---|---|---|---|
| 00 | `00_index.html` | Index Hub | Deliverable navigation (design-only, not in product) |
| 01 | `01_brand_system.html` | Brand System Board | Design tokens reference (design-only, not in product) |
| 02 | `02_landing.html` | Landing Page | Public marketing site — hero, template preview, 3-step flow, Kakao share demo, FAQ, pricing |

### Group B — App Product Screens

| # | File | Screen | Purpose |
|---|---|---|---|
| 03 | `03_template_gallery.html` | Template Gallery | Browse 40+ templates across 8 categories, filter by event/style/plan, custom-event creation |
| 04 | `04_dashboard.html` | User Dashboard | My invitations list, status filters, view/RSVP stats, quick actions |
| 05 | `05_new_invitation_wizard.html` | New Invitation Wizard | 4-step onboarding: Event → Basic Info → Template → Ready |
| 06 | `06_editor_desktop.html` | Desktop Editor | 3-column live editor: section list · mobile preview · property inspector |
| 07 | `07_editor_mobile.html` | Mobile Editor | Mobile in-app editor with bottom sheet property panel |
| 08 | `08_publish_share.html` | Publish & Share Modal | Visibility settings, OG preview, Kakao/QR/native share |
| 09 | `09_rsvp_dashboard.html` | RSVP Dashboard | Response stats, guest list, filters, CSV export |

### Group C — Invitation Viewers (8 themes)

Each viewer is a **live invitation as guests would see it**. All are shown inside a mobile phone frame with a Scroll/Story/Magazine mode toggle. Guests view these on their phone after receiving the share link.

| # | File | Theme | Use Case |
|---|---|---|---|
| 10 | `10_viewer_romantic.html` | Romantic Wedding | Serif elegance, blush + ivory, dried florals |
| 11 | `11_viewer_minimal.html` | Minimal Birthday | Swiss editorial grid, bold Pretendard, high contrast |
| 12 | `12_viewer_cute.html` | Cute Housewarming | MOMO mascot, pastel cards, playful copy |
| 13 | `13_viewer_editorial.html` | Editorial Party | Magazine grid, film grain, rooftop-party mood |
| 14 | `14_viewer_developer.html` | Developer / Terminal | Dark UI, DM Mono, JSON-like data blocks, ANSI colors |
| 15 | `15_viewer_battle.html` | Sports Battle / 도전장 | VS matchup, team roster, morning-soccer / 반대항 |
| 16 | `16_viewer_timeline.html` | Timeline / 일정 공유형 | 3 scenarios in tabs — 집들이 · 번개/정모 · MT/여행. Time-slot schedule, menu cards, cost split, checklists |
| 17 | `17_viewer_gaming.html` | Gaming / 롤 파티 | 3 scenarios in tabs — 빠른대전 · 10인 내전 · 랭크 파티. Summoner name + tier + lane roster, champion pool |

### Group D — Shared Assets

- `assets/tokens.css` — the single source of truth for all design tokens. **Every screen imports this.**
- `assets/moi-symbols.svg` — SVG sprite containing MOMO mascot poses, brand lockup, and 40+ utility icons. Referenced via `<use href="assets/moi-symbols.svg#icon-id"/>`.
- `assets/photos/` — 24 AI-generated pastel-toned photographs (placeholders for user uploads).

---

## Per-Screen Implementation Notes

### 02_landing.html — Landing Page

**Layout**: single-column, sticky nav bar at top, alternating full-width sections. Max content width 1280px, centered.

**Sections (top to bottom)**:
1. **Nav** — sticky, 90% opacity paper background + backdrop-blur(20px). Logo lockup left, nav links center, login + CTA buttons right. Mobile: hides links, collapses to logo + CTA only.
2. **Hero** — 2-column grid (1.1fr 1fr): headline left, dreamy invitation flat-lay photo right. Photo has 2 floating cards: "Draft · Saved" (top-left) and "Ready to share" with wax seal (bottom-right).
3. **Templates preview** — 5-card horizontal row of featured templates on card-white background (`--card`), with photo thumbnails 3:4 aspect.
4. **How it works** — 3-step cards on `--card` background with top/bottom `--line` borders. Each card: large numbered "01./02./03.", h3 title, description, meta strip.
5. **Kakao share feature** — 2-column: left column has heading + 3 bullet points (each with a wax-seal numbered circle). Right column has an actual KakaoTalk chat mockup with a shared invitation card inside.
6. **FAQ** — accordion with 6 `<details>` items. Chevron rotates via CSS pseudo-element `+` / `−`.
7. **Pricing** — 3 pricing cards (Free / Plus [featured] / Pro). Featured card has dark `--ink` background + scale(1.03).
8. **Final CTA** — center-aligned, MOMO running SVG + big serif headline + button.
9. **Footer** — dark `--ink` background, 4-column grid (brand + Product + Company + Support), bottom bar.

**Key components**:
- `.btn` (primary/wax/ghost/outline, .btn-lg/.btn-sm variants)
- `.hero-title` — 84px Pretendard 500, letter-spacing -0.035em, line-height 0.98
- `.kakao-mock` — reproduces KakaoTalk chat with `#B2C7D9` background, avatar circles, bubble + shared card

**Responsive**: single column below 900px, hero photo aspect changes, footer becomes 2-col then 1-col.

---

### 03_template_gallery.html — Template Gallery

**Layout**: sticky nav → head → category quick-nav (sticky-ish, horizontal-scroll) → search bar → **custom event banner + modal** → 7 category sections (each with grid) → bottom CTA.

**Categories** (8 sections, each with 3-5 templates):
1. 결혼 · 기념일 (Wedding · Anniversary) — 4 templates
2. 생일 · 돌잔치 (Birthday · Doljanchi) — 4
3. 집들이 · 홈파티 (Housewarming) — 3
4. 스포츠 배틀 (Sports Battle) — 5
5. 게이밍 · 롤 (Gaming · LoL) — 5
6. 아웃도어 (Outdoor) — 5
7. 취미 소모임 (Hobby) — 5
8. 파티 · 이벤트 (Party · Event) — 4

**Category header pattern** (`.cat-header`):
- Left: round color-tinted icon (60×60, radius 18px) + eyebrow "Category NN" + h2 title + description
- Right: NO count number (removed per user feedback)

**Category quick-nav** (`.cat-nav`): sticky horizontal pill-scroll. Each link has a small round `.ic-wrap` icon badge (28×28) beside text. Active state: wax-color pill with white icon.

**Template card** (`.tpl`):
- 3:4 photo thumbnail
- Category badge (top-left, backdrop-blur pill)
- Favorite heart toggle (top-right, circle button with SVG use)
- Info block: cat-tag (uppercase) + name (bold with rose accent on emphasized word) + meta strip

**Custom Event Banner** (`.custom-event-banner`): full-width pastel wax-tint block above categories with a `+` sparkle icon and CTA "커스텀 이벤트 만들기" that opens the `.ce-modal`.

**Custom Event Modal** (`.ce-modal` + backdrop):
- Event name input with 8 suggestion pills (캠핑장 봄맞이, 반려동물 생일, 이사 인사, etc.)
- 8-item mood grid (color swatches × labels)
- 8-item section checklist
- AI recommendation preview card (updates on interaction)
- Cancel + "이 이벤트로 시작 →" (redirects to wizard with `?event=` URL param)

---

### 05_new_invitation_wizard.html — New Invitation Wizard

**Layout**: top bar (logo + step counter + close) → stepper (4 dots + connecting lines + labels) → step panel body → sticky bottom nav (prev / next / finish).

**Step 1 — Event Type**:
- 34-card grid, 5 columns desktop / 4 tablet / 3 mobile / 2 phone
- Each card: SVG icon (32×32 wax-deep color) + name + hint
- Selected state: wax-tint background, wax border, wax check pill top-right
- Categories include Wedding/Birthday/Doljanchi/Housewarming + all sports + all hobby + LoL/Valorant + Custom
- **The "직접 입력" (Custom) card** at the end: dashed wax-soft border, wax-tint gradient background. Selecting it opens the `.custom-event-panel` inline below the grid.

**Custom Event Panel** (`.custom-event-panel`):
- Name input (defaults to "캠핑장 봄맞이 모임" for demo)
- 10 suggestion pills with emoji + Korean labels
- 12-icon grid — click updates both the panel preview and the custom card icon
- 6-mood pill row
- Live preview card at bottom showing chosen icon + name

**Steps 2-4**: Basic info form (title, subtitle, date, time, location, cover photo upload), Template picker (6 style cards), Complete summary card + "에디터로 이동" CTA.

**URL parameter support**: `?event=이름` pre-fills the custom event name and auto-opens the panel.

---

### 06_editor_desktop.html — Desktop Editor (3-column, live interactive)

**Layout**: fixed top bar + 3 columns (280px sections / flex preview / 320px inspector).

**Top bar**: logo + crumb + editable title input + save indicator (green dot + "Saved · 방금 전") + Scroll/Story/Magazine mode toggle + Mobile/Desktop device toggle + Preview button + Publish rose CTA.

**Left column** (`.col-sections`): section list with drag handle, icon, name/type, hide/duplicate/delete actions. Selected section has wax-tint background + wax border.

**Center column** (`.col-preview`): mobile device frame (390×780 with notch) centered on ambient background with rose/sage radial glows. Live preview inside — clicking sections or editing inspector updates preview in real time via inline JS.

**Right column** (`.col-inspector`): 4 tabs (Content/Style/Layout/Animation). Each tab shows form fields, color swatches, sliders, radio button groups, toggle switches. Interactive:
- Text inputs bind to preview text via `oninput`
- Color swatch clicks update `--rose` CSS variable
- Cover image thumbnail clicks update preview background
- Sliders show live values (e.g. "40px", "65%")

Bottom footer: 되돌리기 + 저장 buttons.

---

### 07_editor_mobile.html — Mobile Editor with Bottom Sheet

**Layout**: standalone phone frame on a soft ambient background, with left-side context panel explaining the flow.

**Inside phone**: top toolbar (back + title + preview + publish) → live invitation preview → bottom tab bar (내용 / 디자인 / 섹션 / 효과 — 4 tabs).

**Bottom sheet** (`.bsheet`): slides up from bottom when a tab is tapped, with rounded top corners, handle bar, and title/close. Contains scrollable panels matching each tab. Live bindings edit the preview above.

---

### 10-17 — Invitation Viewers

Each viewer follows a similar shell:
- **Left info panel** (design context, not shown to end users): eyebrow + h1 name + description + Scroll/Story/Magazine mode toggle + theme-tokens table
- **Phone frame** with status bar + viewport containing the actual invitation content + sticky share-pill at bottom

**Share pill contract** (all viewers): `position: absolute; bottom: 20px`, dark backdrop-blur pill with 3 buttons: 카톡, 링크, primary CTA (참석 답장 / 도전 응답 / 참전 / 응답). Each button has `white-space: nowrap` — never wraps.

**Multi-scenario viewers (16 & 17)**: extra scenario-tab UI in the left panel that swaps between 3 pre-built invitation contents (집들이/번개/MT for 16, 빠대/내전/랭크 for 17).

**Theme details in-file** — each viewer file defines its complete theme within its `<style>` block, using tokens from `tokens.css` plus theme-specific overrides.

---

## Interactions & Behavior

### Global patterns
- **Buttons**: `transition: transform 150ms ease-out, background 150ms, box-shadow 200ms`. Active: `scale(0.97)`. Hover: darken 1 tier or raise shadow.
- **Cards**: `transition 200ms ease-out`. Hover: `translateY(-2px)` + shadow raises `--shadow-xs` → `--shadow-md`.
- **Chips / radio buttons**: no wrap (`white-space: nowrap; flex-shrink: 0`). Active: solid dark or wax background.
- **Wax seal (`.seal-kung`)**: `transform: rotate(-5deg)` at rest. `a:hover .seal-kung` → `rotate(-5deg) scale(0.94)`.
- **Fade in on step change**: `@keyframes fadeIn { from opacity: 0; transform: translateY(8px) → 0 }`.

### Custom event modal (03 gallery)
- Backdrop opens with 250ms fade-in
- Modal transforms `translate(-50%, -48%) scale(0.98)` → `translate(-50%, -50%) scale(1)` with cubic-bezier(0.34, 1.56, 0.64, 1) — subtle bounce
- Escape/backdrop click closes
- On "이 이벤트로 시작 →" click: `location.href = '05_new_invitation_wizard.html?event=' + encodeURIComponent(name)`

### Wizard (05)
- Custom card selection opens custom panel via slide-in animation
- Icon grid click updates panel preview AND custom card icon simultaneously
- URL param `?event=name` auto-selects custom + opens panel + fills name

### Editor (06 desktop, 07 mobile)
- Live text bindings: every input `oninput` updates a matching element in the preview
- Cover thumbnails: click updates `.inv-cover` background-image
- Color swatch: click updates root CSS variable `--rose` → cascades throughout preview
- Overlay slider: sets `--ov` variable used in cover gradient overlay

### Viewers (10-17)
- **Mode toggle** (Scroll/Story/Magazine): CSS class swap on viewport. Currently visual-only — production should implement:
  - Scroll: default vertical scroll
  - Story: full-viewport-height snap points, swipe navigation
  - Magazine: full-bleed sections with parallax hero photo
- **Scenario tabs** (16, 17): swap `.scenario.active` class, reset viewport scroll to top
- **Day tabs** (16 MT): swap `.day-content` visibility inside scoped section
- **Checklist**: click toggles `.checked` class + inserts/removes checkmark SVG
- **RSVP buttons**: click sets `.selected` on chosen option (single-select)
- **Slot open** (17 gaming): click on empty roster slot fills it with placeholder — production should open user profile picker

### Status bar color (viewers)
Some viewers change status-bar text color on scroll:
```js
vp.addEventListener('scroll', () => {
  if (vp.scrollTop < 400) sb.classList.add('light');
  else sb.classList.remove('light');
});
```

---

## State Management

Below is what a production implementation would need. The mockups use inline `oninput` for demonstration only.

### Global app state
- Auth: current user, plan (Free/Plus/Pro)
- Draft invitations: list of user's invitations with status (Draft/Unlisted/Published/Past)
- Templates catalog: fetched from server, cached client-side
- Current editing session: which invitation, current section, unsaved changes

### Wizard state (05)
```ts
{
  step: 1 | 2 | 3 | 4,
  eventType: string,          // 'wedding' | 'birthday' | ... | 'custom'
  customEvent: {              // only if eventType === 'custom'
    name: string,
    iconId: string,           // e.g. 'ic-camping'
    moods: string[],          // ['warm', 'nature']
  },
  basicInfo: {
    title: string,
    subtitle: string,
    date: string,             // ISO
    time: string,
    location: { name: string, address: string, lat?: number, lng?: number }
  },
  templateId: string,
}
```

### Editor state (06, 07)
```ts
{
  invitation: {
    id: string,
    title: string,
    sections: Section[],      // ordered array
    theme: ThemeTokens,
    animationPreset: string,
    pageMode: 'scroll' | 'story' | 'magazine',
    visibility: 'draft' | 'unlisted' | 'public'
  },
  selectedSectionId: string,
  inspectorTab: 'content' | 'style' | 'layout' | 'animation',
  saveState: 'saving' | 'saved' | 'error',
  lastSavedAt: Date,
}
```

Auto-save: debounce 800-1500ms after last edit, POST to `/api/invitations/:id`.

### Viewer state (10-17)
Read-only for guests:
```ts
{
  mode: 'scroll' | 'story' | 'magazine',
  rsvpResponse: 'attend' | 'decline' | 'maybe' | null,
  scenarioTab: string,       // for 16/17 with tabs
  dayTab: 1 | 2 | 3,          // for 16 MT
  checklist: { [itemId]: boolean }
}
```

Guest submits RSVP → POST to `/api/invitations/:id/rsvp` with `{ name, response, plusOne, message }`.

---

## Design Tokens

Full source: **`assets/tokens.css`** (copy this file directly into the project as a CSS custom-properties reference or convert to a Tailwind theme config / design-tokens JSON).

### Colors — Pastel Sealing Wax Palette

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#2A2A3E` | Primary text, dark surfaces |
| `--ink-2` | `#4A4A5E` | Secondary text |
| `--ink-3` | `#6E6E82` | Tertiary text, meta |
| **`--wax`** | **`#E38B8B`** | **Primary brand color — light coral wax** |
| `--wax-deep` | `#C96A6A` | Hover/active states |
| `--wax-light` | `#F5B5B0` | Light peach accent |
| `--wax-soft` | `#FCE0DC` | Soft blush surface |
| `--wax-tint` | `#FEF6F4` | Subtle background tint |
| `--peach` | `#F5C4A1` | Peach accent (birthday, doljanchi) |
| `--peach-soft` | `#FCE7D5` | Peach background |
| `--gold` | `#F5D896` | Pastel gold highlight (was "butter") |
| `--gold-light` | `#FCECC4` | Gold background |
| `--sage` | `#B5CAB2` | Nature accent (hiking, outdoor) |
| `--sage-deep` | `#8AA588` | Deep sage |
| `--sage-light` | `#DCE7DA` | Sage background |
| `--sky` | `#B5D0DE` | Sky blue accent (running, sports) |
| `--sky-soft` | `#DFEBF2` | Sky background |
| `--lilac` | `#D5C4E3` | Lilac accent (study, gaming) |
| `--lilac-soft` | `#ECE4F3` | Lilac background |
| `--paper` | `#FFFFFF` | Base surface (white) |
| `--paper-2` | `#FAFAFC` | Subtle section-divider gray |
| `--paper-3` | `#F2F2F5` | Slightly darker cool gray |
| `--line` | `rgba(42,42,62,0.06)` | Standard border |
| `--line-strong` | `rgba(42,42,62,0.12)` | Emphasized border |

**Legacy aliases** for backward compatibility (map to new values): `--rose`, `--rose-deep`, `--rose-soft`, `--rose-mist`, `--rose-tint`, `--butter`, `--butter-deep`, `--lavender`.

### Typography

- **Korean primary**: `Pretendard Variable` (via jsDelivr) — weights 400/500/600/700/800/900
- **Latin partner**: `Manrope` (Google Fonts) — weights 400/500/600/700/800
- **Monospace**: `DM Mono` (Google Fonts) — weights 400/500 (developer/terminal viewer only)

**Type scale** (all sizes are ~15-20% larger than mobile-app defaults for readability):

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Display 1 | 112px | 800 | 0.94 | -0.045em |
| Display 2 | 84px | 800 | 0.98 | -0.035em |
| H1 | 48px | 700 | 1.08 | -0.028em |
| H2 | 36px | 700 | 1.15 | -0.022em |
| H3 | 26px | 700 | 1.28 | -0.018em |
| H4 | 20px | 700 | 1.32 | -0.015em |
| Body Large | 19px | 500 | 1.62 | — |
| Body | 16px | 500 | 1.65 | — |
| Body Small | 14px | 500 | 1.55 | — |
| Caption | 12px | 500 | 1.5 | — |
| Label (eyebrow) | 12px | 700 | — | 0.2em, UPPERCASE |

**Body default**: `font-family: var(--font-ko)`, `font-size: 16px`, `line-height: 1.65`, `letter-spacing: -0.01em`, `-webkit-font-smoothing: antialiased`.

**No italic anywhere** — Pretendard doesn't ship a true italic. All `<em>`/`<i>` are rendered as **bold-weight accent color** (weight 700) via a global rule:
```css
em, i,
[style*="font-style: italic"] {
  font-style: normal !important;
  font-weight: 700;
}
```
Emphasized text uses **weight + color** (usually `--wax`), never slant.

### Spacing (4px base)

| Token | px |
|---|---|
| `--sp-1` | 4 |
| `--sp-2` | 8 |
| `--sp-3` | 12 |
| `--sp-4` | 16 |
| `--sp-5` | 20 |
| `--sp-6` | 24 |
| `--sp-8` | 32 |
| `--sp-10` | 40 |
| `--sp-12` | 48 |
| `--sp-16` | 64 |
| `--sp-20` | 80 |
| `--sp-24` | 96 |

### Border Radius

| Token | px | Use |
|---|---|---|
| `--r-xs` | 8 | Tiny chips |
| `--r-sm` | 12 | Small buttons, inputs |
| `--r-md` | 16 | Cards, action buttons |
| `--r-lg` | 20 | Larger cards, sheets |
| `--r-xl` | 24 | Hero cards |
| `--r-2xl` | 32 | Full-bleed hero blocks |
| `--r-pill` | 100px | Pills, chips |
| `--r-full` | 9999px | Full circle |

### Shadow (ink-tinted, soft)

| Token | Value | Use |
|---|---|---|
| `--shadow-xs` | `0 1px 2px -1px rgba(42,42,62,0.06)` | Rest state |
| `--shadow-sm` | `0 4px 10px -3px rgba(42,42,62,0.08)` | Small cards |
| `--shadow-md` | `0 8px 24px -8px rgba(42,42,62,0.10)` | Floating cards, chips, FAB |
| `--shadow-lg` | `0 14px 40px -10px rgba(42,42,62,0.14)` | Bottom sheets, hover |
| `--shadow-xl` | `0 30px 60px -20px rgba(42,42,62,0.18)` | Hero elements, device mockups |
| `--shadow-wax` | `0 8px 20px -6px rgba(227,139,139,0.35)` | Primary CTA glow |

### No gradients (per user request)

Gradients were largely removed to reduce "AI-designed feel." **Only 3 exceptions remain**:
1. **Wax seal radial gradients** — real wax glossiness on `.seal-kung` and the SVG logo (essential to the brand)
2. **Photo hero dark overlays** — `linear-gradient(180deg, transparent 40%, rgba(42,42,62,0.75))` for text legibility on hero photos
3. **Text clip gradients** on gaming viewer (17) accent text — pastel neon effect

Everything else uses flat colors.

---

## Brand Logo — CHODAEKUNG Lockup

The primary brand logo is a **horizontal lockup**: MOMO envelope character (left) + "초대" text (center) + wax seal with "쿵" (right, tilted -6°).

**SVG source**: `assets/moi-symbols.svg#chodaekung-lockup` (viewBox 400×140).

**Usage**:
```html
<svg class="ck-logo" viewBox="0 0 400 140">
  <use href="assets/moi-symbols.svg#chodaekung-lockup"/>
</svg>
```

**Sizes** (aspect ratio locked):
- `.ck-logo` — 44px × 126px (default)
- `.ck-logo-sm` — 32px × 91px
- `.ck-logo-lg` — 64px × 183px
- `.ck-logo-xl` — 96px × 274px

**Character design (MOMO)**:
- White envelope body, pink-peach flap
- Dot eyes + small smile
- Cheek blush circles
- Black 3px stroke throughout for crisp silhouette

**Wax seal "쿵"** (the critical readability element):
- Irregular wax-edge silhouette (not perfect circle — has drip marks)
- Radial gradient `#7A2D2E → #A04547 → #C96A6A`
- Inner embossed ring (dashed white + solid dark inner)
- Top glossy sheen ellipse
- **"쿵" text**: Pretendard 900, 42px, white fill + `#3D1113` stroke + drop-shadow — designed for maximum contrast on burgundy wax

An inline text version `<span class="seal-kung">쿵</span>` is also provided in tokens.css for use inline within text runs — uses the same visual style at ~1.55em with `text-shadow` and `-webkit-text-stroke` for pixel-level readability.

---

## Assets

### CSS
- **`assets/tokens.css`** — 428 lines. Design tokens + `.btn` / `.chip` / `.input` / `.seal` / `.seal-kung` / `.ck-logo` base components. **Import this file into the project** as the token source.

### SVG Sprite
- **`assets/moi-symbols.svg`** — single sprite with symbols referenced via `<use href="...svg#id"/>`.

**Brand symbols**:
- `#momo-front` — default standing MOMO
- `#momo-card` — MOMO holding an invitation
- `#momo-run` — MOMO running (delivery)
- `#momo-party` — MOMO with party hat + confetti
- `#momo-peek` — MOMO peeking from behind a phone
- `#momo-icon` — small compact MOMO for UI
- `#moi-mark` — envelope-only mark
- `#kung-seal` — standalone wax seal (large)
- `#chodaekung-lockup` — **primary logo lockup** (use this)
- `#chodaekung-stacked` — vertical variant
- `#app-icon` — app icon composition

**Utility icons** (2px stroke, 24×24 viewBox, currentColor — matches Lucide style):
Section icons: `ic-cover`, `ic-message`, `ic-host`, `ic-clock`, `ic-pin`, `ic-grid`, `ic-info`, `ic-heart`, `ic-heart-fill`, `ic-share`, `ic-arrow-up-right`, `ic-link`, `ic-copy`, `ic-chat`, `ic-eye`, `ic-eye-off`, `ic-check`, `ic-users`, `ic-user-group`, `ic-qr`, `ic-plus`, `ic-x`, `ic-duplicate`, `ic-drag`, `ic-sparkle`

Event category icons: `ic-ring`, `ic-cake`, `ic-balloon`, `ic-house`, `ic-flower`, `ic-baby`, `ic-glass`, `ic-confetti`, `ic-book`, `ic-target`, `ic-briefcase`, `ic-swords`, `ic-trophy`, `ic-ball`, `ic-controller`, `ic-basketball`, `ic-tennis`, `ic-golf`, `ic-baseball`, `ic-badminton`, `ic-run`, `ic-mountain`, `ic-bike`, `ic-swim`, `ic-yoga`, `ic-camping`, `ic-picnic`, `ic-travel`, `ic-study`, `ic-coffee`, `ic-food`, `ic-music`, `ic-camera`, `ic-pet`, `ic-shirt`, `ic-car`, `ic-cat`, `ic-cookie`

### Photos (placeholders — replace with real user uploads / stock in production)
All in `assets/photos/`, roughly 1024×1365 (3:4 aspect), pastel color-graded, ~200-800KB each:

**Wedding & anniversary**: `romantic_wedding.jpg`, `wedding_gallery_1.jpg`, `wedding_gallery_2.jpg`, `hero_flatlay.jpg`

**Birthday & doljanchi**: `minimal_birthday.jpg`, `tmpl_doljanchi.jpg`, `cute_housewarming.jpg`

**Home & party**: `timeline_gathering.jpg`, `editorial_party.jpg`, `tmpl_yearend.jpg`

**Sports**: `battle_sports.jpg`, `tmpl_badminton.jpg`, `tmpl_baseball.jpg`, `tmpl_tennis.jpg`

**Gaming**: `tmpl_gaming.jpg`, `developer_terminal.jpg`

**Outdoor**: `tmpl_running.jpg`, `tmpl_hiking.jpg`, `tmpl_camping.jpg`, `tmpl_picnic.jpg`, `tmpl_travel.jpg`

**Hobby**: `tmpl_study.jpg`, `tmpl_yoga.jpg`, `tmpl_pet.jpg`

**Bridal/misc**: `tmpl_bridalshower.jpg`, `tmpl_seminar.jpg`

Production: replace with user-uploaded photos processed via the image pipeline described in PRD §13 (resize, WebP/AVIF conversion, EXIF strip, blur placeholder generation).

---

## Files in This Handoff Bundle

All 18 HTML mockups are included in this bundle. Reference them directly for exact markup and styles.

- `00_index.html` — Design set index (for navigation only)
- `01_brand_system.html` — Design system reference board
- `02_landing.html` — Public landing page
- `03_template_gallery.html` — Template gallery with custom event modal
- `04_dashboard.html` — User dashboard
- `05_new_invitation_wizard.html` — 4-step invitation creation wizard
- `06_editor_desktop.html` — Desktop 3-column editor
- `07_editor_mobile.html` — Mobile editor with bottom sheet
- `08_publish_share.html` — Publish/share modal with Kakao/QR/OG preview
- `09_rsvp_dashboard.html` — RSVP response dashboard with stats
- `10_viewer_romantic.html` — Romantic Wedding viewer
- `11_viewer_minimal.html` — Minimal Birthday viewer
- `12_viewer_cute.html` — Cute Housewarming viewer
- `13_viewer_editorial.html` — Editorial Party viewer
- `14_viewer_developer.html` — Developer/Terminal viewer
- `15_viewer_battle.html` — Sports Battle / 도전장 viewer
- `16_viewer_timeline.html` — Timeline / 일정 공유형 viewer (3 scenarios)
- `17_viewer_gaming.html` — Gaming / 롤 파티 viewer (3 scenarios)

Shared assets:
- `assets/tokens.css` — design token CSS variables + base components
- `assets/moi-symbols.svg` — SVG icon + mascot sprite
- `assets/photos/*.jpg` — 24 placeholder photos

---

## Implementation Recommendations

Based on the PRD (§22-24), the recommended production stack is:

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS — convert `tokens.css` into `tailwind.config.ts` theme extend
- shadcn/ui — for accessible primitives
- Framer Motion — for section reveal animations
- dnd-kit — for section reordering in editor
- React Hook Form + Zod — for wizard/editor forms

**Backend**
- Next.js Server Actions / Route Handlers
- PostgreSQL (Neon or Supabase)
- Prisma or Drizzle ORM
- Cloudflare R2 or Supabase Storage for images

**Auth**
- Email magic link + Google + Kakao Login + Apple (via NextAuth or Supabase Auth)

**Kakao Share**
- Kakao JavaScript SDK (`Kakao.Share`)
- Configure JavaScript Key in Kakao Developers
- Register share domain in Kakao app settings
- Docs: https://developers.kakao.com/docs/ko/kakaotalk-share/js-link

**Performance targets** (per PRD §26): LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms.

**Accessibility** (per PRD §27): color contrast, image alt text, keyboard focus, semantic HTML, `prefers-reduced-motion` support (already respected in the mockups).

**Privacy/Security** (per PRD §28): default `noindex` on invitations, EXIF stripping on uploads, rate limiting on RSVP endpoint.

---

## What NOT to copy directly

- **Inline `<script>` blocks in each HTML file** — these are demo interactions (input-to-preview bindings, class toggles). Rewrite as proper React state + effects.
- **Hard-coded Korean UX copy** — extract to i18n resource files if multi-language is planned.
- **Photo URLs** — the `/assets/photos/*.jpg` are placeholders. Wire up an image upload pipeline.
- **`data-om-*` attributes** if any remain — these are design-tool artifacts; ignore them.
- **Cache-busting query strings** like `tokens.css?v13` — replace with your bundler's asset pipeline.

---

## Questions worth clarifying with the product owner

1. **Custom event templates** — how much AI recommendation is expected? Full LLM-generated copy? Or curated template variants?
2. **Kakao SDK integration** — does the team already have a registered Kakao app, or will this need new developer account setup?
3. **Multi-language** — Korean-only for MVP, or i18n from day 1?
4. **Payment integration** — Plus/Pro plan billing (Toss? Portone? Kakao Pay?) — outside the design scope, needed for pricing page CTA implementation.
5. **Custom domain** (Pro plan) — subdomain like `yourname.chodaekung.com` or full custom domain support?
