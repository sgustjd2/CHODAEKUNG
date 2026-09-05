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

### 2026-09-05 — Desktop editor (screen 06), first cut

- Scope: Implemented `/editor` — the 3-column authoring shell with a live preview.
- PRD reference: §7.2 (editor/viewer separation), §8.1 (desktop editor). Genspark: `design/06_editor_desktop.html`.
- Decisions:
  - **Center preview renders the real `<InvitationViewer contained>`** over the editor's `draft`
    invitation, instead of porting the mockup's inline preview markup — editing data or theme
    re-renders through the same section registry (§7.2/§7.3). Added a `contained` prop to the viewer
    (fills the device box, hides the fixed share pill).
  - Section list is fully interactive: select (highlight), hide (editor-local Set → filtered from
    preview), duplicate, delete, add (appends a message section), and HTML5 drag-reorder.
  - Inspector Content edits cover/message/location (like the mockup's fixed groups) and writes
    immutably into the draft → live preview. Rich `title` edits fall back to plain text (emphasis
    lost) for now. Style tab: theme preset (Romantic/Minimal live re-theme — both support the same 8
    section types; Editorial/Cute disabled), accent color via inline `--wax` override, cover-bg
    swap. Layout/Animation are faithful stubs.
  - This closes the create flow: landing → gallery → wizard → **editor** → viewer (wizard's
    finish → `/editor` no longer 404s). Publish (`/publish`) still pending.
- Verified: `tsc` clean; `/editor` renders 3 columns + 8 sections; typing Cover eyebrow updates the
  live preview; switching theme Romantic→Minimal re-renders the same data (`.iv t-minimal`).
- Follow-up required: yes — per-section-type Content editors bound to selection; real Layout/
  Animation wiring; mobile editor (07); persistence + autosave.

### 2026-09-05 — Publish & Share dialog (screen 08)

- Scope: Implemented the publish/share modal, opened from the editor's "발행 · 공유" button.
- PRD reference: §15 (share), §17 (visibility). Genspark: `design/08_publish_share.html`.
- Decisions:
  - Built as a `PublishDialog` client component opened from the editor (the real flow) rather than a
    standalone route. Styles live in `editor.css` under a `.pub-overlay` scope.
  - OG / Kakao / QR previews are data-driven from the invitation (cover image, editor title, derived
    date+location subtitle, slug). Visibility radios (Draft/Unlisted/Public) with state.
  - Wired copy-link (`navigator.clipboard`) and OS share (`navigator.share` with copy fallback);
    Kakao (needs SDK) and QR download are stubs for now.
  - Closes the core loop: create → edit → **publish/share** → view. `/publish` route intentionally
    not created (dialog is the product surface).
- Verified: `tsc` clean; dialog opens from editor, renders visibility + OG card (title/desc/url from
  data) + share grid; platform tabs (OG/Kakao/QR) and visibility select work; screenshot confirms
  full render. (`getComputedStyle().opacity` reads 0 mid-transition via the tool but the modal is
  visibly open — measurement artifact, not a bug.)
- Follow-up required: yes — Kakao JS SDK + real OG route/metadata; QR PNG generation; persist
  chosen visibility.

### 2026-09-05 — Dashboard (screen 04)

- Scope: Implemented `/dashboard` — sidebar + management home (stats, filters, invitation cards).
- PRD reference: §18 (dashboard). Genspark: `design/04_dashboard.html`.
- Decisions:
  - `DashboardClient` (client) holds tab + search state. Cards are a mock array; preview links to
    `/i/[slug]` where a real sample viewer exists (jisoo-minjun/appa-60/jibdeuli/jogi-battle), edit
    to `/editor`. Stat totals are static demo aggregates; tab counts are computed from the cards.
  - Sidebar nav: 템플릿 → `/templates`, 새 초대장 → `/new`, rest are stubs; scoped CSS under `.dash`.
- Verified: `tsc` clean; sidebar + 4 stats (1 featured) + 6 cards + empty card render; status tabs
  filter (Draft → 2) and title search (생신 → 1) work.
- Follow-up required: yes — list view toggle, real data/counts, per-card ⋯ menu actions.

### 2026-09-05 — RSVP dashboard (screen 09)

- Scope: Implemented `/rsvp` — response stats, charts, and a filterable guest table.
- PRD reference: §16 (RSVP). Genspark: `design/09_rsvp_dashboard.html`.
- Decisions:
  - `RsvpClient` (client): 4 stat cards + progress bars, line-trend + donut charts (inline SVG,
    static demo), and a response table (9 mock rows) with chip filter (전체/참석/불참/미정/신랑측/
    신부측), name search, and **working CSV export** (Blob download, UTF-8 BOM for Excel Korean).
  - Chip counts are the full-dataset demo numbers (table is a page of 247); table filters the 9
    sample rows. Closes the RSVP loop (viewer accept/rsvp → this dashboard).
- Verified: `tsc` clean; 4 stats + charts render; 참석 filter → 6 rows (all yes), name search → 1 row.
- Follow-up required: yes — real response data + pagination; bulk actions on selected rows;
  per-invitation switching (currently the wedding sample).

### 2026-09-05 — Gaming viewer (screen 17, 롤 파티)

- Scope: Implemented the Gaming theme at `/i/[slug]` — LoL party invitations for 빠른대전 / 내전 / 랭크.
- PRD reference: §2 (fun/versus + small-group scope). Genspark: `design/17_viewer_gaming.html`.
- Decisions:
  - New theme `gaming` (dark #14101E + neon-pastel glow). Added 4 section types
    **gInfo, lanes, tierChart, champions**; reused cover/countdown/rules/accept/ending by
    extending their content (cover `imgFilter` for per-scenario hue tint; countdown/rules gained
    optional section-header fields `eyebrow`/`title`/`titleLine`).
  - Renderers under `sections/gaming/` share a `GSection` shell (neon eyebrow + gradient-accent
    heading). `em` runs map to gradient-clip text via `.iv.t-gaming` CSS (mockup used `.accent`).
  - Lane roster models open slots (`open: true` → dashed slot + "모집" empty tier) and tier badges
    via `tierClass` (iron…master). Summoner+tag kept as one string (tag dimming is cosmetic-only).
  - 3 samples in `sample-gaming.ts` (lol-quick/scrim/rank), spread into `samples.ts`.
- Verified: `tsc` clean; all 3 scenarios render at `/i/lol-quick|scrim|rank` (cover tint differs per
  scenario, roster open slots, tier chart 7-col, champion pool picked-glow, gradient CTA). Earlier
  console errors were stale HMR buffer (globals.css imports are at top; tsc confirms TS clean).
- Follow-up required: yes — join-slot interaction is visual-only in the mockup; wire to RSVP later.

### 2026-09-05 — Cute viewer (screen 12, MOMO 집들이)

- Scope: Implemented the Cute theme at `/i/[slug]` — warm pastel housewarming with the MOMO mascot.
- PRD reference: §2 (birthday/housewarming/baby everyday-celebration scope). Genspark:
  `design/12_viewer_cute.html`.
- Decisions:
  - New theme `cute` (pastel gradient doc, rounded 20–28px cards, bounce-animated MOMO mascot).
    Added 1 section type **notice** (icon+title+desc list w/ per-item tone). Reused
    cover/date/location/gallery/rsvp/ending by extending content: cover `mascot`, date `pill`,
    location `photo`+`address`.
  - `CCard` shell (colored eyebrow pill + heading + body). Eyebrow color is theme styling, so it's
    fixed per cute renderer (date=butter, location/gallery=sage, notice=lav, rsvp=rose) rather than a
    data field — add a content field only if a sample needs to override.
  - Mascot is a defining feature (per-invitation), so kept as data (`cover.mascot`, default
    momo-party); ending mascot momo-card is constant → hardcoded in `CuteEnding`.
  - Share pill reuses the theme-agnostic base (already dark + `--wax` primary = mockup spec).
  - 1 sample `sample-cute.ts` (cozy-home) — mockup has a single scenario.
- Verified: `tsc` clean; `/i/cozy-home` renders cover (mascot/floating shapes/rose-em title/butter
  pill/D-42), location (photo+address+buttons), notice (4 toned icons), 3-col gallery, tinted RSVP
  (갈게요 selected+heart, click switches), MOMO ending. Reset viewport after.
- Follow-up required: yes — more cute samples (birthday/baby/돌잔치) + a birthday mascot variant;
  RSVP selection is local-only (wire to backend later).

### 2026-09-05 — Editorial viewer (screen 13, 매거진 파티)

- Scope: Implemented the Editorial theme at `/i/[slug]` — magazine/film party invite.
- PRD reference: §2 (party/celebration scope, distinct visual direction). Genspark:
  `design/13_viewer_editorial.html`.
- Decisions:
  - New theme `editorial` (film-grain cover overlay, serif Fraunces + italic, big Manrope section
    numbers, magazine grid). Added 1 section type **quote**; everything else reuses shared types via
    small optional additions: cover `coverSub`; message `num`/`dropCap`/`twoCol` (→ `EditorialArticle`);
    details/location/gallery/rsvp `num` (+ location `photoCap`, gallery `caption`, rsvp `innerTitle`);
    ending `colophon`. This is the superset model (§7.1) at its clearest — a `message`/`location`/
    `gallery`/`rsvp` section is renderable by any theme; editorial just reads a few more fields.
  - `ESection` shell (section number + label + serif headline). Drop-cap = first paragraph's first
    char split into data (`dropCap`) so the paragraph text flows around it. Mag gallery span layout
    (p1–p5) is applied by index in the renderer (CSS), no per-image layout data.
  - Location action buttons reuse the global `.btn`/`.btn-outline`/`.btn-primary` tokens.
  - Share pill reuses the theme-agnostic base (dark + `--wax` = mockup spec).
  - 1 sample `sample-editorial.ts` (after-hours).
- Verified: `tsc` clean; `/i/after-hours` renders all 8 section types — grain cover w/ issue no. +
  split footer, drop-cap article, bordered details table, full-bleed location photo+caption+buttons,
  rose serif-italic pull quote (decorative quote marks), magazine grid gallery, dark RSVP box (YES
  selected, click switches), oversized SEE YOU/after hours ending + colophon. Reset viewport after.
- Follow-up required: yes — RSVP selection local-only; Story/Magazine reading modes still pending.
