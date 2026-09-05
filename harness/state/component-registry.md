# Component Registry

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4. Design system driven by
`src/app/tokens.css` (CSS variables + base classes). Primitives are thin React wrappers over those
classes so fidelity stays with the approved tokens; reuse these before creating new ones.

| Design component | Design source | Code component | Variants/states | Responsive / A11y | Status |
|---|---|---|---|---|---|
| Button | tokens.css `.btn` | `src/components/ui/button.tsx` | primary / wax / ghost / outline · sizes sm·md·lg · `:active` scale, `:hover` | `type="button"` default; native focus | done |
| Logo (lockup) | moi-symbols `#chodaekung-lockup` | `src/components/ui/logo.tsx` | ck-logo (sm/lg/xl via class) | `role="img"` + aria-label | done |
| Seal (wax) | tokens.css `.seal` | `src/components/ui/seal.tsx` | size/font via `style` | decorative | done |
| Icon (sprite) | moi-symbols.svg | `src/components/ui/icon.tsx` | any `#id` via `name` | `aria-hidden` | done |
| Inline 쿵 seal | tokens.css `.seal-kung` | (plain `<span class="seal-kung">`) | rest/hover press | decorative | reused as-is |

## Feature components

| Design source | Code component | Notes | Status |
|---|---|---|---|
| 03 gallery — template card | `src/components/templates/template-card.tsx` | client; favorite toggle (heart fill/outline), optional img filter, badge free/pro/new | done |
| 03 gallery — category quick-nav | `src/components/templates/category-nav.tsx` | client; scroll-spy active state + smooth scroll (-80 offset) | done |
| 03 gallery — custom event | `src/components/templates/custom-event.tsx` | client; banner + modal, name/mood/section inputs, live AI preview, create → `/new?event=` | done |
| 05 wizard | `src/components/new/new-invitation-wizard.tsx` | client; 4-step stepper, 34-event grid, custom panel (icon/mood/preview), controlled basic-info form, template picker, dynamic summary, `?event=` prefill via `window.location` | done |

## Invitation viewer + section renderer (CLAUDE.md §7.3)

Structured-data model in `src/lib/invitation/types.ts` (`Invitation` = `sections[]` + `theme`;
rich text as `Line`/`Run`, never HTML). `section.type` → one renderer via
`src/components/viewer/section-registry.ts`. `<InvitationViewer>` renders the themed root
(`iv t-<theme>`) + share pill; real published route is `/i/[slug]`.

| Piece | Code | Notes |
|---|---|---|
| Model + types | `src/lib/invitation/types.ts` | Invitation/Section union/Theme/Line |
| Theme registry | `src/components/viewer/section-registry.ts` | **theme → (type → renderer)**; per-theme renderer sets |
| Romantic renderers | `src/components/viewer/sections/*.tsx` | cover, message, date(+calendar/countdown), location, gallery, schedule, rsvp (client), ending |
| Minimal renderers | `src/components/viewer/sections/minimal/*.tsx` | own 8 renderers + numbered `MinimalHead` (structural, not a recolor) |
| Battle renderers | `src/components/viewer/sections/battle/*.tsx` | dark theme; adds section types **versus, matchInfo, countdown, rules, roster, accept** + battle cover/location/ending |
| Timeline renderers | `src/components/viewer/sections/timeline/*.tsx` | pastel schedule theme; adds types **details, timeline, menu, checklist, cost, route, dayPlan** (+ cover/location/cta(accept)/ending); checklist + MT day-tab interactivity |
| Rich text | `src/components/viewer/rich-text.tsx` | renders `Line[]`; `em` → weight+accent |
| Viewer shell | `src/components/viewer/invitation-viewer.tsx` | picks `themeRegistry[theme]`, passes `index`; themed root + fixed share pill |
| Theme: romantic | `viewer.css` `.iv.t-romantic` | serif, rose, calendar+countdown |
| Theme: minimal | `viewer.css` `.iv.t-minimal` | swiss editorial grid, B/W contrast, data grid + block rsvp |
| Theme: battle | `viewer.css` `.iv.t-battle` | dark; VS matchup, match info grid, countdown, rules+prize, roster, accept/decline CTA, stamp ending |
| Theme: timeline | `viewer.css` `.iv.t-timeline` | pastel; timeline (done/now), menu cards, checklist, cost split, MT route + day tabs; 3 scenario samples 집들이/번개/MT |

**Finding:** the 8 viewer themes are structurally different (different cover, section headers,
date presentation, rsvp, ending), not token recolors — so each theme ships its own renderer set.
A theme renders a **subset** of section types (`ThemeSet` is `Partial`; the viewer skips types a
theme doesn't provide). Battle added 6 new types (versus/matchInfo/countdown/rules/roster/accept).
Content stays a semantic superset (`types.ts`) so the same data can feed any theme (§7.1).

Sample data: `src/lib/invitation/sample-romantic.ts` + `samples.ts` (placeholder store until a
data layer exists). Modes: Scroll implemented; Story/Magazine pending (PRD §10).

## Page-CSS scoping convention
Each screen's ported CSS is wrapped under a unique root class via CSS nesting
(`.landing { … }`, `.gallery { … }`) so global class names (`.nav`, `.head`, …) never
collide across routes (Next App Router keeps visited routes' CSS in the document).
The page's root element carries that class. Shared bits stay in tokens.css / primitives.

## Reused base classes (from tokens.css, not yet wrapped)
`.chip`, `.card`, `.input`, `.input-label`, `.divider`, type classes (`.t-h1`…`.eyebrow`) — wrap into
React primitives when the first screen that needs them is built.

## Pending primitives (create when first needed)
Input/Textarea, Select, Checkbox/Radio/Switch, Tabs/SegmentedControl, Dialog, BottomSheet, Toast,
Card, TemplateCard, ShareDialog, RSVPForm, section renderer registry (viewers).
