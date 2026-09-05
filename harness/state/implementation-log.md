# Implementation Log

Use this only for material decisions, discrepancies, or migrations. Do not log routine code edits.

### 2026-09-05 — Project scaffold + Landing (first slice)

- Scope: Bootstrapped the app and implemented the Landing page as the first vertical slice
  (foundation: tokens → primitives → screen).
- PRD reference: §1, §11 (design system), §19 (landing), §22 (stack).
- Genspark/design reference: `design/02_landing.html`, `design/assets/tokens.css`, `design/README.md`.
- Decisions:
  - Stack from create-next-app latest: **Next 16 App Router, React 19, Tailwind v4, TS** (README/PRD
    recommended Next 14+; used current stable). npm (pnpm not installed).
  - **tokens.css reused directly** as the design system (imported in `globals.css`), rather than
    re-expressing every token in a Tailwind theme. Tailwind kept for utilities/future shadcn; its
    preflight is layered so unlayered tokens.css wins on overlap.
  - Fonts (Pretendard via jsDelivr, Manrope + DM Mono via Google) loaded with `@import url()` at the
    top of `globals.css`; removed the same imports from the bundled `src/app/tokens.css` because the
    bundler inlines it mid-file and remote @imports there are a CSS parse error (500). Design
    `design/assets/tokens.css` left pristine.
  - SVG sprite + photos copied to `public/assets/`; referenced via `/assets/...`. External
    `<use href="/assets/moi-symbols.svg#id">` works (sprite + all photos serve 200).
  - Landing built as a **Server Component** (no client JS needed; FAQ uses native `<details>`).
    Page-specific CSS ported to `src/app/landing.css` (scoped under `.landing`); shared bits are the
    Button/Logo/Seal/Icon primitives + tokens.css classes.
  - Used plain `<img>` for placeholder photos (eslint-disabled) — swap to `next/image` + real upload
    pipeline later (PRD §13).
- Deviation: create-next-app clobbered our `CLAUDE.md` with a `@AGENTS.md` pointer and added
  `AGENTS.md`/`README.md`; restored `CLAUDE.md` from git and removed the scaffold files.
- Verified: `tsc --noEmit` clean; dev server `GET / 200`; hero/templates render with correct
  pastel tokens, Pretendard, logo lockup, wax seal, float cards.
- Follow-up required: yes — `next/image` migration; wrap remaining base classes as primitives;
  next screens (gallery/wizard/editor/viewers); decide `design_handoff_chodaekung.zip` tracking.

### 2026-09-05 — Template Gallery (screen 03)

- Scope: Implemented `/templates` — 8 category sections (35 template cards), quick-nav,
  search/sort, custom-event banner + modal, bottom CTA.
- PRD reference: §9 (template system / event categories), §1 (scope).
- Genspark/design reference: `design/03_template_gallery.html`.
- Decisions:
  - **Page-CSS scoping**: landing.css and templates.css are each wrapped under a root class
    (`.landing` / `.gallery`) via CSS nesting to stop global class collisions (`.nav`, `.head`)
    across routes — Next App Router retains visited routes' global CSS. Verified nesting compiles
    (Lightning CSS) incl. nested `@media`.
  - Server/client split: page + cards structure render on the server; only interactive pieces are
    client components (`TemplateCard` fav toggle, `CategoryNav` scroll-spy, `CustomEvent` modal).
  - Custom-event "이 이벤트로 시작" and bottom CTA route to `/new?event=…` (wizard, screen 05,
    not built yet — links 404 until then).
- Verified: `tsc` clean; 8 sections / 35 cards / 8 nav pills render; head-title 60px/800; icons
  from sprite; modal opens with reactive mood toggle + live AI preview (opacity→1, ink heading).
- Follow-up required: yes — build wizard (`/new`) so gallery CTAs resolve.

### 2026-09-05 — New Invitation Wizard (screen 05)

- Scope: Implemented `/new` — 4-step wizard (event type → basic info → template → ready),
  34-event grid, custom-event panel, dynamic completion summary.
- PRD reference: §6.1/§6.2 (creation + quick mode), §9 (categories/templates).
- Genspark/design reference: `design/05_new_invitation_wizard.html`.
- Decisions:
  - Single client component `NewInvitationWizard` holds all wizard state; page CSS scoped under
    `.wizard` (nesting), consistent with landing/gallery convention.
  - Step-2 basic-info inputs are controlled so Step-4 summary reflects real values; event + template
    selections also feed the summary.
  - **`?event=` prefill**: `useSearchParams()` returned empty at effect time under Next 16 even
    though `location.search` had the param, so read `window.location.search` in a mount effect
    instead. This also removed the `<Suspense>` requirement. Verified prefill selects the custom
    card, opens the panel, and fills the name (gallery → wizard flow now works end-to-end).
  - Finish → `/editor` and top-bar close/logo → `/` (editor/dashboard screens not built yet).
- Verified: `tsc` clean; 34 cards, stepper done/active states correct, step nav + scroll,
  custom panel icon/mood/preview reactive, summary dynamic.
- Follow-up required: yes — build editor (`/editor`, screen 06) and dashboard (`/dashboard`, 04).

### 2026-09-05 — Invitation viewer + section renderer (screen 10, Romantic)

- Scope: Established the structured invitation model + section-renderer registry, and implemented
  the Romantic Wedding viewer at `/i/[slug]`.
- PRD reference: §7 (section system), §7.2/§7.3 (viewer separation + registry), §10 (page modes), §11.3.
- Genspark/design reference: `design/10_viewer_romantic.html`.
- Decisions:
  - The mockup's phone frame + info panel + theme-tokens table are **design presentation** ("not
    shown to end users"); the product is the invitation itself. Built the real full-screen,
    mobile-first viewer (centered mobile column on desktop, ambient bg), dropping the fake status bar
    and its scroll-color logic.
  - Architecture (CLAUDE.md §7.3): `Invitation = sections[] + theme` (structured data, rich text as
    `Line`/`Run`, never HTML) → `sectionRegistry[type]` → renderer → themed via CSS under
    `.iv.t-<theme>`. 8 renderers (cover/message/date/location/gallery/schedule/rsvp/ending); only
    `rsvp` is a client island (selection). Viewer + sections are otherwise server components.
  - Theme look lives entirely under `.iv.t-romantic`; adding a viewer theme = new `.iv.t-<id>` block
    reusing the same renderers (structurally-different themes like battle/gaming may add section types later).
  - Countdown/calendar are static demo values (target date is in the past vs. today) — wire real
    computation with the data layer.
- Verified: `tsc` clean; `/i/jisoo-minjun` renders 8 sections in order from data; computed styles
  correct (cover 700px+photo, calendar today=wax, tint sections, schedule/signature accents,
  rsvp default-selected); share pill 3 buttons.
- Follow-up required: yes — Story/Magazine modes; remaining 7 viewer themes; real data layer +
  countdown; Kakao/link share wiring on the pill.

### 2026-09-05 — Minimal viewer (screen 11) + theme-registry refactor

- Scope: Implemented the Minimal Birthday viewer at `/i/appa-60` and generalized the viewer to
  support multiple structurally-different themes.
- PRD reference: §7.3 (registry), §9/§11.3. Genspark: `design/11_viewer_minimal.html`.
- **Finding / decision:** viewers are NOT token recolors — minimal has a different cover (swiss grid),
  numbered section headers, a data grid instead of calendar/countdown, a 3-col schedule, asymmetric
  gallery, block RSVP, and a "THANK YOU." ending. So the registry moved from `type → renderer` to
  `theme → (type → renderer)`; each theme ships its own renderer set under `sections/<theme>/*` and
  its own `.iv.t-<theme>` CSS. Section content stays a semantic superset (added cover header/title
  lines/subtitle, date bigDate/dataGrid, schedule duration, rsvp optionSubs, ending huge/below) so
  one invitation's data can feed any theme (§7.1). `InvitationViewer` now passes section `index`
  (minimal uses it for 01–06 numbering).
- Verified: `tsc` clean; `/i/appa-60` renders t-minimal (swiss cover, 06.15 big date, 4-cell grid,
  01–06 numbered sections, block RSVP default-selected, THANK YOU.); `/i/jisoo-minjun` romantic
  unchanged (regression pass: couple, 49 calendar cells, 8 sections).
- Follow-up required: yes — 6 remaining themes (cute/editorial/developer/battle/timeline/gaming);
  battle/timeline/gaming add new section types (versus matchup, roster, schedule tabs).

### 2026-09-05 — Battle viewer (screen 15) + section-type expansion

- Scope: Implemented the Battle / 도전장 viewer at `/i/jogi-battle` (dark, dramatic, competitive).
- PRD reference: §7.3; product's differentiated "versus battle" invites. Genspark: `design/15_viewer_battle.html`.
- Decisions:
  - Battle needed 6 **new section types** — `versus` (home/away matchup with W/D/L), `matchInfo`
    (editorial 2×2 info grid), `countdown` (dark cells), `rules` (numbered + prize box), `roster`
    (home/away player groups), `accept` (accept/decline CTA = battle's RSVP) — plus battle-specific
    cover/location/ending. Added to the `Section` union + content types.
  - `ThemeSet` is now `Partial<{ [type]: Renderer }>` — a theme renders only the section types it
    supports; `InvitationViewer` skips a type with no renderer for the active theme. This is the
    clean way to let themes diverge structurally while sharing the model + registry.
  - Battle renderers in `sections/battle/*` output `ivb-*` classes styled under `.iv.t-battle`
    (dark `.iv-doc`, dark ambient); reuses the shared fixed share pill (dark override).
- Verified: `tsc` clean; `/i/jogi-battle` renders 9 sections (VS 2 teams, 4 info cells, 4 countdown,
  4 rules, 7 roster players, accept/decline, stamp ending); dark doc, home flag + title accent = wax.
  Regression: romantic (8 sections, calendar) and minimal unaffected by the Partial/guard change.
- Follow-up required: yes — cute/editorial/developer viewers; timeline/gaming (scenario tabs) add
  more section types; real RSVP/accept submission + countdown; Kakao/link share.

### 2026-09-05 — Timeline viewer (screen 16) — 집들이 · 번개 · MT

- Scope: Implemented the Timeline / 일정 공유형 theme + all 3 scenarios as separate invitations
  (`/i/jibdeuli`, `/i/beongae`, `/i/yangyang-mt`). Largest viewer so far.
- PRD reference: §7 modules (timeline/menu/itinerary/roster), §9. Genspark: `design/16_viewer_timeline.html`.
- Decisions:
  - The design's scenario tabs are a presentation device; in-product each scenario is its own
    invitation of the `timeline` theme (3 samples), so no scenario switcher ships.
  - Added 7 section types — `details` (info grid + party avatars), `timeline` (done/now states +
    tags), `menu` (category cards), `checklist` (client toggle), `cost` (split card + info grid),
    `route` (MT stops), `dayPlan` (client day tabs, reuses the timeline list) — reusing
    `cover`/`location`/`accept`(as CTA)/`ending` with a few added optional cover/ending fields.
  - Shared helpers `TlSection` and `TimelineList` keep the modules DRY (dayPlan reuses TimelineList).
- Verified: `tsc` clean. jibdeuli: 8 sections, hw gradient cover, 6 timeline items, 3 menu cards,
  4 checklist, party avatars. yangyang-mt: route (4 stops) + day tabs switch (Day 2 → 새벽 낚시),
  cost. beongae: cost split bold. All three `t-timeline`.
- Follow-up required: yes — remaining viewers (cute/editorial/developer/gaming); real
  submission/persistence; countdown/day computation from dates.
