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

### 2026-09-05 — Developer viewer (screen 14, 터미널) — viewer set COMPLETE

- Scope: Implemented the Developer/Terminal theme at `/i/[slug]`. This completes all 8 viewer themes
  (romantic, minimal, cute, editorial, developer, battle, timeline, gaming).
- PRD reference: §2 (dev meetup / study-group meetup scope). Genspark: `design/14_viewer_developer.html`.
- Decisions:
  - New theme `developer` (dark #0D0F0A, DM Mono, ANSI palette, CRT scanlines on `.iv-doc::before`).
    **Added zero new section types** — the strongest proof of the superset model (§7.1): the standard
    cover/date/location/schedule/gallery/rsvp/ending sections re-render as a terminal session.
  - Small optional field additions only: cover `from`+`json` (syntax-highlighted payload), date
    `subLabel` (bigDate/countdown/dataGrid already existed), location `rows` (Kv output lines),
    rsvp `progress` (ASCII bar). Section badges (D-32, "4 items") are derived from data or constant
    per section; titlebar + ASCII banner + colophon are theme chrome hardcoded in cover/ending.
  - `DSection` shell ("# name" + optional badge). RSVP options are `[✓]`/`[ ]` div-buttons with
    keyboard handlers; progress bar built with ▓/░ from `progress.filled/total`.
  - Share pill reuses base (dark + `--wax`), with green icon tint for flavor.
  - 1 sample `sample-developer.ts` (dev-meetup).
- Verified: `tsc` clean; `/i/dev-meetup` renders titlebar, colored command lines, MOI LETTER ASCII
  banner, JSON block (gold keys / green str+date+bool / blue num), datetime ASCII + table, location
  output + `$` buttons, schedule table, hue-filtered ASCII gallery, `[✓]` RSVP + progress bar, share
  buttons, echo ending + colophon. Reset viewport after.
- Follow-up required: yes — RSVP/actions are local-only stubs; wire share/copy/cal + RSVP to backend.

### 2026-09-05 — Mobile editor (screen 07) + CSS keyframes bug fix

- Scope: Implemented the mobile editor (bottom-sheet model) at `/editor`, sharing ONE state with the
  desktop editor (CLAUDE.md §7.4: mobile must use bottom-sheet nav, not a shrunk desktop inspector).
- PRD reference: §12 (editor), §7.4. Genspark: `design/07_editor_mobile.html`.
- Decisions:
  - `/editor` is now responsive: `EditorClient` owns all editing state/actions and renders BOTH
    `.ed-desktop` (existing 3-col) and `<MobileEditor>` (`.ed-mobile`), toggled by a `@media
    (max-width: 960px)` breakpoint. State is shared by passing an `EditorApi` bag to MobileEditor —
    no duplicated reducer logic (§5/§14). Shared constants/helpers extracted to `editor-shared.ts`.
  - Mobile layout: sticky top bar (back/title+saved/preview/publish) + live `<InvitationViewer
    contained>` (flex:1 scroll) + 4 bottom tabs → bottom sheet with content/design/sections/anim
    panels. Real phone frame chrome (notch/statusbar/home-indicator) dropped — in a real mobile
    browser the app IS the screen.
  - Verified live editing drives the shared draft: switching theme (Romantic↔Minimal) re-renders the
    preview (`.iv t-minimal`), accent sets preview `--wax` (#F5D896), cover/sections/mode share the
    same handlers. Sheet sub-tabs (Cover/Message/… , Theme/Color/…) are decorative jump pills as in
    the mockup (its JS only toggles active, no filtering).
- **Latent CSS bug found + fixed**: a `@keyframes` nested INSIDE a style rule makes Lightning CSS
  drop that rule's *own* declarations (not just the keyframes). This silently dropped
  `.editor-page { height:100vh; overflow:hidden }` (pulse-dot) — which broke the mobile fixed-height
  shell — and the direct declarations of `.iv.t-cute`/`.iv.t-gaming`/`.iv.t-timeline` (c-bounce/
  g-pulse/tl-pulse). Hoisted all these keyframes to top level. Also scoped the desktop editor's
  tablet fallback `@media` to `(min-width:961px) and (max-width:1024px)` so it no longer fights the
  mobile shell below 960px. Build now compiles the editor/viewer CSS without keyframes warnings.
- Verified: `tsc` clean; `next build` succeeds (all routes); desktop editor unchanged (grid
  `280px 1fr 320px`, overflow hidden); mobile editor renders at 375px with working sheet + live edits.
- Follow-up required: yes — (1) `wizard.css` still has 2 nested `@keyframes` (wiz-fade-in,
  cep-slide-in) with the same latent bug — spawned as a separate task. (2) Mobile Layout/Animation
  timing controls are stubs; overlay slider is visual-only. (3) Save/publish still stubbed.

### 2026-09-05 — Editor content editing expansion (desktop)

- Scope: Expanded the desktop editor's Content tab from cover/message/location to also edit
  **date, schedule, gallery, rsvp** (the romantic invitation's full section set). User picked
  "에디터 편집 확장" as the next lane.
- Decisions:
  - Reused the existing `find`/`patch`/`Field` pattern; added `date`/`gallery`/`schedule`/`rsvp`
    finds. Editors: date (eyebrow/title/D-day countdown days), schedule (eyebrow/title + per-item
    time/title/desc with **add + remove**), gallery (eyebrow/title; image upload deferred), rsvp
    (title/body/options — one per line). Also added a title field to the message editor.
  - Rich titles collapse to plain text on edit (existing first-cut behavior; `plainTitle` +
    `[[v]]`), consistent with the location editor. Schedule item add/remove mutate `content.items`
    via `patch`, re-rendering the live preview.
  - Small inspector CSS added (`.insp-subitem`/`.insp-subitem-head`/`.insp-add`).
- Verified: `tsc` clean; at 1280px the Content tab shows all 7 groups; editing schedule item #1
  title shows live in preview, "+ 일정 추가" adds a 5th item (visible in preview), RSVP options
  textarea rewrites the preview's options (new options in, 미정 out). Reset viewport after.
- Follow-up required: yes — mirror these editors in the mobile `ContentPanel` (next increment);
  gallery image upload/reorder; rich-text (em) editing without collapsing.

### 2026-09-05 — Editor content expansion (mobile) — matches desktop

- Scope: Mirrored the desktop Content editors into the mobile bottom-sheet Content panel, so both
  editors edit the same full section set. Extended `EditorApi` with date/gallery/schedule/rsvp and
  passed them from `EditorClient` (still one shared state).
- Decisions: mobile `ContentPanel` now renders message(title+body), location(name+addr),
  date(eyebrow/title/D-day), schedule(eyebrow/title + per-item time/title/desc with add·remove),
  gallery(eyebrow/title), rsvp(title/body/options) using `MField` + `.m-subitem`/`.m-add` styling.
  Desktop and mobile keep separate JSX (different `Field`/`MField` + styling) but share all state
  and `patch` logic — no duplicated reducer.
- Verified: `tsc` clean; mobile 내용 sheet shows all 7 groups + 4 schedule item editors + add;
  editing a schedule item title reflects live in the mobile preview. Reset viewport after.
- Follow-up required: gallery image upload/reorder; rich-text (em) editing; wire save/publish.

### 2026-09-05 — Editor: Ending editing (desktop + mobile) — romantic fully editable

- Scope: Added the Ending section editor (맺음말/서명) to both editors. With this, all 8 sections
  of the romantic invitation (cover/message/date/location/gallery/schedule/rsvp/ending) are editable.
- Decisions: `EndingContent` signature/names via `Field`/`MField` + `patch`; `ending` added to
  `EditorApi` and the fallback "nothing editable" condition. Same shared-state pattern.
- Verified: `tsc` clean; desktop Content tab shows all 8 groups, editing 맺음말 → "with love & joy,"
  reflects live in preview; mobile 내용 sheet also lists all 8 groups incl. Ending. Reset viewport.
- Note: git index had been corrupted by an interrupted commit; rebuilt via `rm .git/index && git reset`
  (working tree preserved) before committing.
- Follow-up: gallery image swap/upload; Layout/Animation config (needs viewer support); wire save/publish.

### 2026-09-05 — Editor draft persistence (localStorage autosave)

- Scope: Editor edits now survive a page refresh; the "Saved" badge is backed by real writes.
- Decisions: `EditorClient` loads `{draft,title,hidden,accent}` from `localStorage` on mount
  (SSR renders the sample, a client effect swaps in the saved draft — no hydration mismatch) and
  autosaves on every change once hydrated. 저장 button flushes explicitly; 되돌리기 resets to the
  sample (autosave then persists that). All reads/writes wrapped in try/catch (private mode / quota).
  Marked `// ponytail: localStorage draft store — swap for a real backend when multi-device/sharing lands`.
  Both editors share the state, so mobile persists too.
- Verified: `tsc` clean; at 1280px edited cover 이름1 → "지수TEST", it persisted to localStorage,
  and after a full reload the input + live preview both showed "지수TEST". Cleared the test value.
- Ceiling: per-browser only — a shared invitation URL opened by a guest won't see the creator's
  draft. Real cross-device persistence + sharing needs the backend lane.

### 2026-09-05 — Editor loads any invitation by slug (all 8 themes)

- Scope: The editor previously always loaded the romantic sample. Now it resolves `?slug=` on mount
  and edits that invitation; dashboard "edit" links pass the slug. Persistence is per-slug.
- Decisions: mount effect reads `?slug=` (via `window.location`, like the wizard), loads
  `getInvitation(slug)` (sample) or the per-slug saved draft; `keyFor(slug)` namespaces localStorage;
  `defaultTitleFor` derives the title from cover names, else the slug. 되돌리기 resets to that slug's
  sample; 저장 writes that slug's key. No `?slug=` → romantic (unchanged).
- Value: all 8 themes now open in the editor — live preview renders the real theme, section list
  supports select/reorder/hide/dup/delete, and common sections (cover/message/location/…) are editable.
  Theme-specific section editors (versus/roster/lanes/menu/…) still show the "순차적으로 추가" note.
- Verified: `tsc` clean; `/editor?slug=jogi-battle` → `iv t-battle`, 9 sections (커버/매치업/경기 정보/
  카운트다운/규칙/…); `/editor` (no slug) → `iv t-romantic`, title "지수 · 민준". Reset viewport.
- Follow-up: editors for the remaining theme-specific section types; nicer default titles.

### 2026-09-05 — Editor: versus/countdown/rules/accept editors (desktop)

- Scope: Added desktop Content editors for the shared types countdown/rules/accept (help battle,
  gaming AND timeline) plus battle-specific versus. Battle invitations are now substantially editable
  (cover/location/versus/countdown/rules/accept/ending).
- Decisions: same `find`/`patch`/`Field` pattern. versus edits home/away name+meta; countdown per-cell
  n+l; rules title + per-rule t/d with add/remove; accept title/sub/accept/decline. Fallback condition
  extended. Reuses `.insp-subitem`/`.insp-add`.
- Verified: `tsc` clean; `/editor?slug=jogi-battle` Content tab shows Cover/Location/Versus/Countdown/
  Rules/CTA/Ending; editing versus 홈팀 이름 → "우리동네 FC" live in preview. Cleared test value.
- Follow-up: mirror these in mobile ContentPanel; matchInfo + roster editors; remaining theme types
  (gInfo/lanes/tierChart/champions, timeline/menu/checklist/cost/route/dayPlan/details, notice, quote).

### 2026-09-05 — Editor: timeline/checklist/details editors (desktop)

- Scope: Desktop Content editors for timeline (진행 순서), checklist (준비물), details (정보) — the core
  집들이/번개/MT content. Each supports item add/remove.
- Verified: `tsc` clean; `/editor?slug=jibdeuli` → `iv t-timeline`, Content shows Cover/Location/CTA/
  Timeline/Checklist/Details/Ending; editing a timeline item title → "집들이 시작!" live in preview.
- Follow-up: menu/cost/route/dayPlan (timeline), matchInfo/roster (battle), gInfo/lanes/tierChart/
  champions (gaming), notice (cute), quote (editorial); + mobile parity for all editors added since
  the romantic set.

### 2026-09-05 — Editor: notice/quote/lanes editors (desktop)

- Scope: Desktop editors for notice (cute), quote (editorial), lanes (gaming 라인업). notice items
  add/remove; lanes edits per-player name/summoner/tier.
- Verified: `tsc` clean; lol-quick shows Lanes (editing a player name → "김프로" live); cozy-home shows
  Notice; after-hours shows Quote (+ Details from the prior increment). Cleared test value.
- Follow-up remaining: menu/cost/route/dayPlan (timeline), matchInfo/roster (battle),
  gInfo/tierChart/champions (gaming); + mobile parity for all editors beyond the romantic set.

### 2026-09-05 — Editor: gInfo/tierChart/cost editors (desktop)

- Scope: Desktop editors for gInfo (gaming 매치 정보, cells add/remove), tierChart (gaming 티어 분포),
  cost (timeline 비용 — total/split/eyebrow).
- Verified: `tsc` clean; lol-rank shows 매치 정보 + 티어 분포; yangyang-mt shows Cost · 비용.
- Remaining desktop editors: menu, route, dayPlan (timeline, nested), roster (battle, nested),
  matchInfo (battle, nested value parts), champions (gaming, emoji) — lower value / nested; + mobile
  parity for all editors beyond the romantic set.

### 2026-09-05 — Editor: route/roster/menu/dayPlan editors (desktop section editing ~complete)

- Scope: Desktop nested-list editors for route (MT 이동경로), roster (battle 명단, groups→players
  w/ add·remove), menu (집들이 메뉴, cards→items w/ add·remove), dayPlan (MT 일별, days→items w/ add·remove).
- Verified: `tsc` clean; yangyang-mt shows Route + Day Plan (editing a route stop → "양양 도착!" live);
  jogi-battle shows Roster; jibdeuli shows Menu. Cleared test value.
- Status: desktop Content editing now covers **every section type except** matchInfo (battle, nested
  {k, v:[{t,u?}]} value parts — awkward as plain fields) and champions (gaming, emoji picker — low value).
- Follow-up: those two remaining types; mobile ContentPanel parity for all editors beyond the romantic set.

### 2026-09-05 — Editor: extract shared ContentEditors → full mobile parity (no duplication)

- Scope: Extracted the entire desktop Content-tab editor set into `content-editors.tsx`
  (`<ContentEditors draft patch>`), and pointed BOTH the desktop inspector and the mobile bottom
  sheet at it. Mobile now edits every section type the desktop can (versus/roster/menu/dayPlan/lanes/
  gInfo/etc.), not just the romantic subset. One source of truth — no drift.
- Decisions: ContentEditors computes its own `find` from `draft` + uses `patch`; emits `.insp-*`
  markup, already styled under `.editor-page` so it works in the mobile sheet with no new CSS.
  Slimmed `EditorApi` (removed message/location/date/gallery/schedule/rsvp/ending; kept `cover` for
  the Design panel). Removed the now-dead `Field` (editor-client) and `MField` (mobile). Mobile
  content sub-tab chips now derive from the invitation's actual sections (deduped) instead of a fixed
  wedding list.
- Verified: `tsc` clean; desktop `/editor` (romantic) renders all 8 editors + edit flows ("리팩터OK");
  mobile `/editor?slug=jogi-battle` content sheet shows Cover/Location/Versus/Countdown/Rules/CTA/
  Roster/Ending and versus edit flows ("모바일FC"). Cleared test values.
- Remaining: matchInfo + champions editors (low value); gallery image upload; Layout/Animation config.

### 2026-09-05 — Backend foundation: Supabase (anonymous/link MVP), code-first

- Scope: Data layer for the backend lane. User chose Supabase + anonymous/link ownership + start
  code-first (activates when keys are added). This slice = schema + server client + store + wire the
  public viewer read; editor publish + RSVP UI wiring come next.
- Decisions:
  - Ownership without login: each invitation has a secret `edit_token` (link-based). All writes go
    through Next server code using the **service role** (bypasses RLS) and verifies the token; the
    service key has no NEXT_PUBLIC_ prefix so Next keeps it off the client. RLS is ON with two anon
    policies (read live invitations, insert RSVP to live) — proper auth (Kakao) + owner column can
    layer on later.
  - Graceful fallback: `isDbEnabled()` false (no keys) → the store returns bundled samples, so the
    app runs unchanged today and "turns on" when `.env.local` is filled. `getPublishedInvitation`
    only returns published/unlisted rows.
  - `@supabase/supabase-js` added (needed now + for Auth/Storage later). `.env.example` added;
    `.gitignore` keeps real `.env*` out but un-ignores `.env.example`.
- Verified: `tsc` clean; `npm run build` passes (`/i/[slug]` now ƒ dynamic); `/i/jisoo-minjun` still
  renders the romantic sample via fallback (no keys), no errors.
- Next: publish Server Action + wire editor 발행 (create/edit → DB, store edit_token per slug in
  localStorage, return public URL); then RSVP submit (viewer) + host list (dashboard); then Storage
  (gallery upload); then Kakao auth. Pre-existing non-fatal warning: nested @keyframes in wizard.css.

### 2026-09-05 — Backend: publish flow wired (editor → DB)

- Scope: 발행 now persists. `publishInvitationAction` (server action) → `upsertInvitation`.
- Decisions: new invitation (no editToken) → server mints a fresh unique slug (`inv-xxxx`) so it never
  clobbers a sample/other row, inserts, returns {slug, editToken, url}. Editor stores editToken in
  localStorage (`chodaekung:editor:token:<slug>`), switches its slug to the published one, so
  re-publish updates the owned row. PublishDialog maps visibility (draft/unlisted/public→published),
  shows real origin-based URL + status; copy/share use the live URL.
- Verified: `tsc` + `npm run build` clean; in dev without keys, 발행하기 shows the graceful
  "백엔드가 아직 설정되지 않았어요" status (no crash). Real persistence activates when keys are set.
- Next: RSVP submit (viewer) + host list (dashboard).

### 2026-09-05 — Backend: RSVP guest submit (viewer)

- Scope: Guests can now RSVP. Replaced the static share pill with `<ShareBar>` (client): 카톡/링크 copy
  + primary CTA opens a theme-agnostic RSVP form (name + options) → `submitRsvpAction` → DB.
- Decisions: one submit path for all themes (avoids wiring every theme's RSVP renderer). Options come
  from the invitation's rsvp section (else accept CTA, else 참석/미정/불참). Modal CSS is base-level
  (theme-agnostic) in viewer.css; hidden in editor preview via existing `.iv-contained .share-pill`.
- Verified: `tsc` clean; `/i/jisoo-minjun` → primary CTA opens modal with 참석/미정/불참; submit without
  keys shows graceful "백엔드가 아직 설정되지 않았어요". Inserts for real when keys + a published row exist.
- Next: host RSVP list — wire `/rsvp` dashboard to `listRsvps(slug, editToken)`.

### 2026-09-05 — Backend: RSVP host list (dashboard) — RSVP loop complete

- Scope: `/rsvp` reads real responses when opened as `/rsvp?slug=<slug>` and the owner token is in
  localStorage (`listRsvpsAction` → `listRsvps`, edit_token verified). Otherwise the mock demo shows
  (no regression). Chip counts / table header / footer reflect live data when live.
- Decisions: mapped `RsvpRow` → the existing table Row (response label → yes/no/maybe, guests → +N,
  relative time); `side` is "—" (simple schema has no bride/groom split). Stats cards + charts remain
  illustrative demo. RSVP loop now closed: guest submits via ShareBar → DB → host sees it here.
- Verified: `tsc` + `npm run build` clean; `/rsvp` (no slug) still renders the 9-row demo, no errors.

### 2026-09-05 — Auth slice 1: sign-up/login (Supabase Auth, email/password)

- Scope: Account creation + login. User asked for 회원가입 + managing one's own invitations. Chose
  email/password (self-contained; Kakao later — needs a Kakao dev app). Two slices: this = auth
  foundation + UI; next = owner_id + dashboard.
- Added: `@supabase/ssr`; `supabase-browser.ts` (createBrowserSupabase/authEnabled) for client auth;
  `supabase-server.ts` (createServerSupabase/getCurrentUser) reads the session from cookies;
  `src/middleware.ts` refreshes the session cookie; `/login` page (client) — combined login/signup with
  email confirm handling, errors, mode toggle; `login.css`.
- Gotcha: adding `middleware.ts` needs a dev-server restart (Next compiles middleware at boot) — 500
  "Cannot find the middleware module" until restarted.
- Verified: `tsc` + `npm run build` clean; `/login` renders (WELCOME BACK / 로그인), email+password
  inputs wired, toggle → 회원가입. (Did NOT create a test account — user will do the real sign-up.)
- Follow-up: Next 16 deprecates `middleware` → `proxy` file convention (still works; rename later).
  Slice 2: owner_id migration + RLS, publish sets owner, dashboard lists the user's invitations + logout.

### 2026-09-05 — Logo spacing fix + remove pricing + wire landing nav

- Logo (`#chodaekung-lockup` sprite): pushed "초대" right (x115→130) for breathing room from the MOMO
  mascot, and pulled the 쿵 wax seal left (translate 285→272) so 초대쿵 reads as one wordmark; moved
  the sparkle to follow.
- Removed the pricing section + `plans` data + `#pricing` nav link (user isn't using pricing);
  dropped "Pricing" from the footer Product column.
- Wired landing navigation with next/link: logo→/, 로그인→/login, 무료로 만들기→/new (nav/hero/final),
  템플릿 구경/전체 템플릿 보기→/templates. (Buttons → styled Links; Button import removed.)
- Verified: `tsc` + `build` clean; logo renders with corrected spacing.

### 2026-09-05 — Auth slice 2b: dashboard manages the user's own invitations

- `/dashboard` is now login-gated (server: getCurrentUser → redirect /login if none) and lists the
  signed-in user's invitations from DB (listMyInvitations → cards). Stats/tabs/counts derived from
  real data; sidebar shows the user's name+email with a logout button (signOut → /login). RSVP nav
  → /rsvp. Empty state for new accounts.
- Verified: `tsc` + `build` clean (/dashboard now ƒ dynamic); unauthenticated `/dashboard` redirects
  to `/login`. (Authed data path verified by logic + patterns; user will sign up to see live cards —
  I don't create accounts.)
- Note: card analytics show "—" placeholders (view/RSVP counts per card = future queries).

### 2026-09-05 — Live on Vercel verified + re-publish fix

- Verified https://chodaekung.vercel.app live: landing (logo/nav/no-pricing), anonymous publish →
  DB row (inv-wzry1x5b), `/i/<slug>` renders from DB, RSVP submit works. Env + DB + migration 0002
  all live on Vercel; auto-deploy from GitHub push confirmed.
- Bug fixed: re-publish used the draft/sample slug + a now-set editToken, creating a duplicate row
  (and a stray `jisoo-minjun` DB row). PublishDialog now re-publishes against `publishedSlug ??
  invitation.slug`, so re-publish updates the created row. (User can delete the stray test rows
  inv-*/jisoo-minjun in Supabase Table Editor.)
- Auth sign-up/dashboard live path is the user's to verify (I don't create accounts/enter passwords).

### 2026-09-05 — OG/Kakao share cards for /i/[slug]

- `generateMetadata` on the invitation route builds og:title (cover names/title), og:description
  (date · location), og:image (cover photo), + twitter summary_large_image. `metadataBase` in the
  root layout (NEXT_PUBLIC_SITE_URL → VERCEL_URL → localhost) makes image URLs absolute.
- Verified locally: /i/inv-h0buf4qe head has og:title "지수 · 민준", og:description
  "2026. 05. 24 … · 성수 가든", absolute og:image. KakaoTalk link previews show the card.
- Note: set NEXT_PUBLIC_SITE_URL=https://chodaekung.vercel.app on Vercel so OG image URLs point at the
  stable domain (not the per-deploy VERCEL_URL).

### 2026-09-05 — Dashboard real view/RSVP counts

- Migration 0003: `invitations.views` + `increment_views(slug)` RPC (security definer). `bumpViewAction`
  (service role) is fired from `<ViewPing>` on the live viewer only (not the editor preview).
- `listMyInvitations` now returns `views` + `rsvpCount` (rsvp rows counted per slug); resilient — if
  the `views` column isn't there yet it falls back (views=0), so the dashboard never breaks pre-0003.
  Dashboard cards show real Views/RSVP instead of "—".
- Verified: `tsc` + `build` clean; viewer renders with ViewPing (RPC no-ops until 0003). Count display
  is login-gated (dashboard) — verified by logic; user sees it after login.
- Requires migration 0003 for view counts to accrue (RSVP counts work already).

### 2026-09-05 — Gallery photo upload (Supabase Storage)

- Migration 0004: public `invite-photos` bucket + read/insert policies.
- `src/lib/photo.ts` `photoUrl(src)` — full URL passthrough (uploaded) or bundled asset by name;
  applied to all 5 gallery renderers (romantic/minimal/cute/editorial/developer) so uploaded images
  render. `src/lib/db/upload.ts` uploads via the browser client (5MB/image limit) → public URL.
- ContentEditors gallery section: thumbnail grid with per-image remove + "+ 사진 업로드" (PhotoUpload),
  appends the uploaded URL to gallery.images. Works in desktop + mobile editors.
- Verified: `tsc` + `build` clean; gallery editor shows thumbs + upload input. Actual upload needs
  migration 0004 run (bucket). (Cover-photo upload can reuse the same mechanism later.)

### 2026-09-05 — Editor: no auto-filled default values (user preference)

- Per "기본값은 자동으로 넣지말아줘": adding items/sections no longer inserts placeholder text
  (새 일정/새 규칙/새 항목/새 인원/새 메뉴/새 경유지/New Section). New rows/sections start with empty
  strings (structural icon defaults like ic-info/ic-pin kept). Applies across schedule/timeline/
  dayPlan/rules/checklist/details/gInfo/notice/route/roster/menu + addSection.
- Sample invitations (templates) are left as-is. Open question surfaced to user: whether a brand-new
  invitation should also start blank (no romantic sample) vs. as a template.

## Cover layout variants (GenericCover)
- Added CoverContent.layout ("theme" | photo-bottom | photo-center | split | text). "theme" (default)
  keeps each theme's own cover renderer untouched; the others render a shared, theme-agnostic
  GenericCover (src/components/viewer/sections/generic-cover.tsx) intercepted at the single dispatch
  point in invitation-viewer.tsx (s.type==="cover" && layout && layout!=="theme").
- Rationale: each of the 8 themes has its own cover root class (.iv-cover/.ivm-cover/.g-cover/…), so a
  cross-theme CSS modifier isn't possible. GenericCover sits at top level in viewer.css and inherits the
  enclosing .iv.t-<theme> tokens (--wax accent, --wax-deep panel, --font-serif/-en), so one component
  themes correctly under any theme (verified romantic + gaming). Labels: 클래식/히어로/스플릿/미니멀.
- Editor picker (radio-group / m-radios) added to the Cover Section on both desktop (content-editors)
  and mobile (mobile-editor DesignPanel); live preview updates via InvitationViewer contained.

## Add-section palette = theme's own sections + mobile type-change
- addableTypes was ADDABLE_SECTIONS (7 generic types) ∩ theme, so theme-specific themes showed almost
  nothing in the "+" menu (gaming = 장소/엔딩 only). Now addableTypes = Object.keys(themeRegistry[theme])
  minus "cover" — the theme's full section palette in its natural order (gaming = 9). ADDABLE_SECTIONS
  removed (dead).
- blankSection expanded from 7 cases to every SectionType (details/timeline/menu/checklist/cost/route/
  dayPlan/quote/notice/versus/matchInfo/countdown/rules/roster/accept/gInfo/lanes/tierChart/champions),
  each an empty shell (empty rows/arrays per "no auto default values"); default still → message.
- Section type-change added to the MOBILE editor (was desktop-only): each m-sec row is now a
  m-sec-type-select; EditorApi gained changeSectionType. Type-change options on both editors =
  ["cover", ...addableTypes] so any section (incl. cover) can convert and it's reversible.
- Limitation: converting between theme-specific types works only within a theme that renders both;
  a type the theme doesn't render is simply not offered.

## Theme-aware blankInvitation + wizard mood → theme/accent
- blankInvitation(theme) now builds the theme's OWN section set (THEME_DEFAULT_SECTIONS via
  blankSection per type) + a theme-appropriate cover photo (THEME_COVER), instead of always the
  romantic section set. romantic default is unchanged (backward compatible). Fixes blank-start for
  non-romantic themes (previously unsupported sections rendered null).
- The /new wizard's custom-event mood picker (따뜻하게/재미있게/…) was collected but discarded. It now
  maps (MOOD_THEME) to a starting theme + accent, passed through the wizard→editor sessionStorage seed
  (WizardSeed gained theme/accent); the editor applies them on a blank start. Verified: custom + a mood
  opens the editor in that theme with the accent and the theme's section set.
- blankSection ids gained a random suffix (batch-built sections can't collide).

## Add to calendar (.ics)
- Invitation gained a canonical `eventStart` (ISO YYYY-MM-DD all-day, or YYYY-MM-DDTHH:mm), separate
  from the cover's decorative dateLabel. src/lib/calendar.ts builds a universal .ics (iOS/Android/
  Apple/Outlook native, Google-importable) via downloadIcs(eventStart, title, location, details).
- Set from the /new wizard (native date/time → eventStart in the seed) and from an editor field
  ("행사 일시 (캘린더 추가용)", datetime-local, Content tab) so template-started invitations get it too.
- ShareBar shows a "캘린더" button (in the pill) only when eventStart exists; InvitationViewer passes
  eventStart + the location section's title. Verified: preview shows the button, .ics has correct
  DTSTART/SUMMARY, pill doesn't overflow.

## "마음 전하기" (account) section — copy-to-clipboard bank accounts
- New section type `account` (AccountContent: eyebrow/title/note + accounts[{side,bank,number,holder}]) —
  the near-universal Korean invitation feature (축의금/부조금 계좌).
- One theme-agnostic renderer (src/components/viewer/sections/account.tsx): a neutral info card with a
  per-account "복사" button (navigator.clipboard). Registered for ALL themes via a `common` spread in
  section-registry (also makes future shared sections easy). Styled top-level in viewer.css (.iv-account).
- Editor: content editor (add/edit/remove accounts) mirroring the rules-list pattern; SECTION_META entry
  (마음 전하기 / ic-heart) so it shows in the add menu + type-change for every theme. blankSection covers it.
- Verified: offered in add menu, adds, editor edits, viewer renders the card + copy button with correct text.

## D-Day countdown (dday) section
- New `dday` section: a live countdown (일/시/분/초, 1s tick) to the invitation's canonical eventStart.
  Theme-agnostic renderer (src/components/viewer/sections/dday.tsx), registered via the `common` spread.
- Target comes from invitation.eventStart (set by the wizard's date/time or the editor "행사 일시"), so it
  reuses the single canonical datetime (also used by add-to-calendar). InvitationViewer special-cases the
  dday render to inject target (registry renderers only receive `content`).
- State starts null → no SSR/hydration mismatch; renders nothing when eventStart is unset (editor hints to
  set 행사 일시). SECTION_META + blankSection cover it. Verified: ticks live, correct numbers, graceful when unset.

## 방명록 (guestbook) section — guest congratulatory messages (DB-backed)
- New `guestbook` section (GuestbookContent = eyebrow/title/note header; messages live in the DB).
- Persistence mirrors RSVP: migration 0005_guestbook.sql (guestbook table + FK + anon insert & public-read
  policies gated to live invitations). store: submitGuestbookEntry / listGuestbook (service role, gated by
  isLiveInvitation). actions: submitGuestbookAction / listGuestbookAction (both public).
- Viewer GuestbookSection (client): fetches messages on the live page, posts new ones, optimistic append.
  slug optional + `noDb` guard so preview/editor (and the registry render path) stay DB-free and previewable.
  Registered via `common` spread; InvitationViewer special-cases the render to pass slug + preview(||contained).
- Editor: header content editor + SECTION_META (방명록 / ic-message). blankSection covers it.
- USER STEP: run supabase/migrations/0005_guestbook.sql for the guestbook to persist live (like 0003/0004).
- Verified (client/preview path): addable, renders form + empty state, optimistic message card on submit.

## Live 참석자 roster (attendees) — names fill from 참석 RSVPs in real time
- New `attendees` section: shows the names of everyone who RSVP'd 참석, filling live on the invitation.
- Reads the EXISTING rsvps table (no new migration): store.listAttendees(slug) → names where response="참석",
  gated to live + service-role (only the NAME is exposed; full RSVP stays owner-only). action listAttendeesAction.
- AttendeesSection (common section, special-cased in InvitationViewer for slug/preview): fetches on the live
  page, polls every 12s, and refetches instantly on the "chodaekung:rsvp" window event that ShareBar fires on
  a successful RSVP → near-real-time on the same page.
- ShareBar: pre-fills the name from the signed-in account (logged-in guests show their real name); shows a
  consent note ("'참석' 선택 시 이름이 명단에 표시돼요") when the invitation has an attendees section (hasAttendees).
- Editor: header content editor + SECTION_META (참석자 명단 / ic-users). Verified: addable, renders, empty
  state, consent note appears in the preview RSVP form.

### 2026-09-09 — P2 UI/UX audit (untouched surfaces) + P3 product decisions

- Scope: extended the `improve-ui` audit to the four surfaces never given a dedicated pass — `/new` wizard,
  `/rsvp`, `/settings`, `/media` (prior passes covered landing/login/viewer/editor/dashboard). Source-based
  (all login-gated). Ran 4 parallel audit agents; then validated every candidate against the authoritative
  Genspark mockups (`design/09_rsvp_dashboard.html`, `design/05_...`, `design/assets/tokens.css`) before acting.
- Audit yield: `/settings` clean. `/media` 1, `/rsvp` 3, `/new` 2 candidates. Plans in `design-plans/`
  (each carries a RESOLUTION header).
- Applied (3):
  - **`/media` PhotoUpload unstyled — FIXED (root cause).** `PhotoUpload` renders `.insp-add`/`.insp-photos`/
    `.insp-photo`, defined only inside `editor.css`'s `.editor-page {}` nesting — but `editor.css` is imported
    only by `src/app/editor/page.tsx`, so it never loads on `/media`. Moved those 6 rules (verbatim, un-nested)
    from `editor.css` → `globals.css` (root-layout-loaded, global) and removed from `editor.css`. Single
    definition; editor + `/media` both styled. (The audit's own "de-nest inside editor.css" remedy was wrong —
    would not have loaded on `/media`.)
  - **`/new` (+ app-wide) `.input:focus` ring — FIXED.** `tokens.css:311` hardcoded `rgba(123,45,46,0.15)`
    (=#7B2D2E burgundy), orphaned by the coral `--wax` rework (UX-04, precedence #1): matches neither current
    `--wax` #C25C5C nor Genspark `--wax` #E38B8B. → `rgba(227,139,139,0.15)`, the app's live wax-tint-ring idiom
    (10+ uses; identical spec at `templates.css:268`). Vendored `design/assets/tokens.css` still carries the
    stale burgundy — live token file is deliberately ahead of it.
  - **`/rsvp` breadcrumb — FIXED.** Non-live branch showed `DASHBOARD · RSVP`, live branch `DASHBOARD ·
    INVITATIONS · RSVP` (same element flickers across load states). Unified to the fuller text
    (`rsvp-client.tsx:152`), confirmed by mockup `design/09` line 319.
- Rejected/skipped (3) — recorded to prevent re-work:
  - **`/rsvp` CSV label "unify":** REJECTED. Mockup uses two labels ON PURPOSE — `CSV 내보내기` top bar
    (design/09:322) vs `CSV 다운로드` at the table (design/09:476). Code matches the mockup; unifying = deviation.
  - **`/rsvp` maybe-badge color:** REJECTED. Mockup `.badge-tag.maybe` uses the same slate `rgba(110,122,147,…)`
    (design/09:262); the slate "pending/neutral" tint is deliberate, not drift.
  - **`/new` event-card checkmark SVG→glyph:** SKIPPED. Both render a checkmark; SVG is font-independent, a
    `content:'✓'` glyph could regress cross-platform. Low value.
- Verified: `eslint` 0 errors (pre-existing set-state-in-effect warnings only); **production build passes**
  (`next build --webpack`, all routes incl. /media,/new,/rsvp,/editor). Note: `next build` (Turbopack default)
  cannot run in a git worktree — Turbopack rejects a node_modules symlink pointing outside the worktree root;
  used the `--webpack` builder against a temporary junction to main's node_modules (removed after).
- **P3 product decisions (user, 2026-09-09):** D1 monetization → **defer real checkout, keep scaffold**
  (no provider chosen). RSVP capacity (정원/마감) → **stays FREE**. D2 creator marketplace → **status quo**
  (leave copy + unbuilt). No code changed for P3; see `remaining-phases.md`.

### 2026-09-09 — Per-field text styling + inspector section cards (user request)

- **Inspector section separation** (`editor.css` `.insp-group`): each section's editor is now its own
  card (white surface, `--line-strong` border, `--r-md` radius, wax accent bar on the `h5` header)
  instead of a thin divider — sections read as clearly separated blocks in the right panel.
- **Per-field text styling** (문구마다 크기·색·글꼴·굵기·기울임). Granularity + placement chosen by user:
  **per-field** (not per-run rich text), controls in **both** the inspector and a preview floating toolbar.
  - Data model: `TextStyle` + `SectionStyle.text?: Record<path, TextStyle>` (`types.ts`), keyed by the
    field's `Editable` `path`. `size` is a theme-relative `em` multiplier (scales with each theme's base).
  - Pure logic in `src/lib/invitation/text-style.ts`: `textStyleCss` (style → CSS), `mergeTextStyle`
    (merge + normalize away no-ops, single source of truth for an edit), `isEmptyTextStyle`, `TEXT_SIZE_STEPS`.
  - Rendering: `<Editable>` reads a new `TextStyleContext` and applies the style — in the editor AND on the
    public page (public wraps a section only when it has styles → zero overhead otherwise). `invitation-viewer`
    provides the context per section and loads any per-field Google fonts via extra `<FontLink>`s.
  - Editor: `selectedField {secId,path}` set on field focus (via `onSelectField` through the viewer →
    EditContext). Shared `TextStyleControls` drives both surfaces; `patchTextStyle` writes via `mergeTextStyle`.
    Floating toolbar (`.ts-float`) is `position:fixed` (viewport coords, recomputed on scroll/resize) so the
    preview's `overflow:hidden` never clips it.
  - SCOPE (v1): desktop editor only for EDITING styles; mobile bottom-sheet editor keeps working (styles still
    RENDER in its preview + public page) but has no per-field style UI yet — follow-up if wanted.
- Verified: `tsc --noEmit` clean, `eslint` 0 errors (only the repo's existing set-state-in-effect warnings),
  `next build --webpack` passes (all routes). Interactive editor is login-gated → the WYSIWYG toolbar/inspector
  UX needs a hands-on check on a logged-in session (project norm; see next-session.md).

### 2026-09-09 — 관리자 콘솔 (/admin) — 유저 + 초대장 관리 (신규 기능, prd-admin.md)

- PRD: `prd-admin.md`. 결정(user): 관리자 지정 = **별도 DB 테이블 `public.admins`(이메일 키)**; 유저 관리 범위 =
  프리미엄 티어 부여/회수 + 계정 정지(ban) + 계정 삭제(비가역) 전부.
- **권한 모델(서버 전용)**: `src/lib/db/admin.ts` — `isAdminEmail`(admins 테이블 조회, service role), `getAdminUser`
  (로그인 유저가 admins에 있으면 반환), `requireAdmin`(모든 admin 액션 선행). admins 테이블은 RLS on + **공개 정책
  없음** → 서버만 읽음. 테이블 미존재 시 전부 false(fail-safe: 마이그레이션 전엔 관리자 없음, 크래시 없음).
- **마이그레이션 `0006_admins.sql`** (⚠️ 사용자가 적용해야 함): admins 테이블 생성 + 첫 관리자 이메일 시드
  (`sgustjd1234@gmail.com` — 스모크로 실제 로그인 유저임을 확인, 적용 즉시 권한 부여됨).
- **데이터 계층** `src/lib/invitation/admin-store.ts` (service role, RLS 우회 + `auth.admin` API):
  `loadAdminData`(유저 `auth.admin.listUsers` 페이지네이션 + 전체 초대장 + RSVP 카운트 + 소유자 이메일 매핑 + 지표),
  `adminDeleteInvitation`(rsvps·guestbook FK cascade), `adminSetVisibility`(공개중지/공개), `adminSetUserTier`(그 유저
  모든 초대장 data.tier 일괄 — 티어는 초대장 단위라), `adminBanUser`(ban_duration), `adminDeleteUser`(초대장 먼저
  삭제→cascade, 그 다음 auth 유저; owner_id가 on-delete-set-null이라 순서 중요).
- **액션** `admin-actions.ts`: 각 액션 `requireAdmin` 재확인; 본인 계정 정지/삭제 차단.
- **UI**: `/admin`(서버 게이트 — 비관리자는 대시보드/로그인으로 조용히 리다이렉트, `robots noindex`) →
  `AdminClient`(탭 초대장/유저, 검색, 지표 4카드, 행 동작 + window.confirm, 성공 시 `router.refresh()`).
  `admin.css`는 대시보드/미디어 레이아웃 패턴 재사용. 헤더 `AccountMenu`에 `isAdmin`일 때만 '관리자 콘솔' 링크
  (landing + templates 페이지에서 주입).
- 검증: tsc + eslint 0 + `next build --webpack` 통과. 서비스키 읽기 스모크: `listUsers` OK(유저 3+), 초대장 6,
  admins 테이블 미적용(=fail-safe 확인). 인터랙티브(테이블 동작)는 0006 적용 + 로그인 후 사용자 확인 필요.

### 2026-09-09 — 관리자 콘솔 공개중지(takedown) 버그 수정 — unlisted 초대장 포함

- 0006 마이그레이션은 이미 적용됨(admins 테이블 + 시드 `sgustjd1234@gmail.com` REST로 확인). backend-state 메모리 갱신.
- **버그**: `AdminClient` 초대장 행의 `공개중지` 버튼이 `visibility === "published"`일 때만 노출됐음. 그러나 이 제품
  초대장은 대부분(현재 dev DB 6/6 전부) **링크공개(unlisted)**이고, `getPublishedInvitation`은 draft만 제외하므로
  unlisted도 `/i/slug`에서 공개 렌더됨. 즉 부적절한 링크공개 초대장을 admin이 **삭제 외엔 내릴 수 없던** 상태 —
  PRD-admin §4.1 takedown 요구사항의 실질적 구멍.
- **수정**(`src/components/admin/admin-client.tsx`): 이미 계산돼 있던 `live`(=`visibility !== "draft"`) 기준으로 전환.
  live(공개 OR 링크공개) → `공개중지`→draft. draft → `공개`→**unlisted**.
- **PRD 문구와의 의도적 차이(사용자 확인)**: PRD-admin §4.1은 "복구: 다시 published"지만, 링크공개였던 걸 내렸다가
  복구할 때 published(검색노출)로 올리면 원래보다 노출이 커짐. 안전한 되돌리기 위해 복구 대상을 **unlisted**로 둠.
  (사용자에게 published 옵션도 제시했고, 별도 반대 없어 unlisted 유지.)
- 검증: tsc + eslint 0 + `next build --webpack`(23 라우트) 통과. 인터랙티브 동작은 배포 후 로그인 상태에서 사용자와 점검.

## 2026-09-11 — 모바일 에디터 뷰포트 버그 + 마법사 정보 반영 + 배지/디테일 편집

**증상(사용자, 모바일 iOS):** ① 에디터 하단 탭·시트가 브라우저 크롬/키보드에 가려 "화면이 짤림", ② 발행/공유가 "안 됨"(발행 다이얼로그 footer가 크롬 뒤로 밀려 도달 불가 — 서버는 정상: 배포 DB 설정됨, /i/jisoo-minjun 렌더 확인), ③ 동호회모임(=`club`→`beongae` 타임라인 템플릿) 마법사에서 입력한 장소/날짜가 반영 안 되고 "홍대 골목집"에 고정, ④ 모바일에서 커버 배지·디테일 카드를 편집할 수 없음.

**수정:**
- `.editor-page` 높이 `100vh`→`100dvh`→`var(--app-vh,100dvh)`; `EditorClient`에 `visualViewport` 추적 effect가 `--app-vh`를 실제 가시영역 높이로 갱신. → 크롬 가림 + iOS 키보드가 하단 시트를 가리는 문제 동시 해결(시뮬레이션 검증: 키보드 시 시트가 키보드 위로 재배치). `layout.tsx` viewport에 `interactiveWidget:"resizes-content"`(안드로이드), `.m-tabs`/`.m-sheet`에 `env(safe-area-inset-bottom)`.
- 발행 다이얼로그 모바일(≤800px): `.pub-modal { display:block; height:100dvh; overflow-y:auto }` + 패널 `max-height:none` → 그리드에서 도달 불가하던 footer(발행하기)가 단일 스크롤로 도달 가능.
- `applyWizardSeed`(editor-client.tsx): 장소→커버 place 배지(`ic-pin`류)+디테일 `info`의 "Where"류 행, 날짜→커버 `ic-clock` 배지에도 반영(기존엔 location 섹션 title만 갱신). 타임라인/모임 템플릿의 커버 칩·WHERE가 이제 마법사 입력을 따름.
- `ContentEditors`: 커버 "배지(칩)" 편집 필드 추가, 디테일 `info`에 "단위(선택)"(u) 필드 추가 → 모바일/데스크톱 모두에서 배지·디테일 전 항목 편집 가능.

검증: tsc 0, eslint 0 errors(기존 warning 3), 로컬(데모 모드) 모바일/데스크톱 뷰포트에서 위 4건 재현→수정 확인. 발행 서버동작은 배포 DB에서만(로컬은 "백엔드 미설정" 메시지 정상).

## 2026-09-11 (2) — 프리뷰 인라인 편집 전 테마 + RSVP 파티 블록

**요청(사용자):** ① 프리뷰에서 탭해서 전부 수정(모든 템플릿), ② 템플릿 기본 예시값을 회색 힌트로(탭 시 사라짐, 발행 시 미표시), ③ 참여자 블록을 실제 RSVP로 자동.

**A. 인라인 편집(완료·배포):** `handleInlineEdit`를 임의 중첩 경로(getAtPath/setAtPath, 불변)로 일반화. 8개 테마 전 섹션 렌더러의 content 유래 텍스트를 `<Editable>`로 래핑 — 공용 셸(TlSection/section-head/c-card/e-section/d-section/g-section/sec-title)에서 eyebrow·title 일괄 처리 + 커버 배지/부제, 정보·스탯 카드(k/v/u), 일정·라인업·룰·메뉴·루트·엔딩 등 항목. 아이콘/이미지/런타임 카운트다운/RSVP·토글 버튼은 제외(공개 렌더 불변). 타임라인은 직접, 나머지 7테마는 병렬 서브에이전트로 적용 후 tsc+webpack 빌드+브라우저(romantic/editorial/gaming) 검증. `desc`(string)의 잘못된 multiline 제거.

**C. RSVP 파티(완료·배포):** `useLiveParty` 훅 — 발행 페이지에서 details.party를 실제 참석자 이름/헤드카운트로 채우고 RSVP 이벤트/12s 폴링 갱신, capacity로 "N자리 남음". 에디터/미리보기는 템플릿 party 유지. `TimelineDetails`만 party를 렌더하므로 거기만 배선(editorial details엔 party 없음). attendees 섹션과 동일 패턴.

**B. 회색 플레이스홀더 기본값(보류):** 템플릿 예시값을 옅은 힌트로 표시→탭 시 클리어→발행 시 미표시. 안전 구현엔 "필드가 아직 템플릿 기본값인지(pristine)" 추적이 필요(어떤 path가 편집 텍스트인지 중앙 목록이 없음 — 현재는 각 렌더러의 data-edit에 분산). 템플릿 시딩/블랭킹을 잘못 건드리면 템플릿이 빈 화면으로 깨질 위험이 있어, pristine 추적 방식을 설계 후 별도로 진행 예정. [[no-auto-default-values]] 정책과 상호작용.

## 2026-09-11 (3) — B 완료: 템플릿 예시 = 회색 힌트 + 발행 시 미편집 항목 제거

보류했던 B 구현·배포. 새 템플릿 시작 시 `templateDefaults`(원본) 보관 → `Editable`이 EditContext의 content/defaultContent로 path별 pristine 판정 → 미편집 필드를 회색(iv-example)으로 표시, 포커스 시 전체 선택(첫 타이핑에 교체). 발행 시 `cleanForPublish`가 프리뷰의 data-edit 마커로 편집 필드 집합을 읽어, 미편집 예시 "항목"을 배열에서 통째로 제거(배지·정보행·스텝 등 — leaf 블랭크가 아니라 항목 단위라 빈 카드가 안 남음). 마법사/사용자가 편집한 항목은 유지. getAtPath/flattenText/lineToText는 lib/invitation/path.ts로 공용화. 검증: tsc 0, webpack 빌드, 마법사 케이스 DOM 검증(채운 필드 유지·미편집 예시만 drop).

## 2026-09-11 (4) — 좌/중/우 포커스 싱크 + 회색 힌트 새로고침 유지 + 커버 사진 클릭

**요청(사용자):** ① 왼쪽(섹션 목록)·가운데(프리뷰)·오른쪽(인스펙터) 클릭 시 서로 포커스가 안 맞음, ② 기본값(예시)이 계속 들어가 있음, ③ 커버 사진을 클릭해도 안 바뀜.

**① 싱크(editor-client.tsx):** 섹션-리스트 클릭이 인스펙터를 잘못된 그룹으로 스크롤하던 off-by-one 수정 — `내용` 탭의 첫 그룹 `문구 스타일`(및 말미의 `캘린더`/`참여 인원`)에 `data-fixed-group`를 달고, 스크롤 계산에서 필터링해 실제 섹션 그룹만 인덱싱. 프리뷰 텍스트 클릭(`onSelectSection`)이 `setSelectedId`만 하던 것을 `selectFromPreview`로 교체 — 인스펙터 그룹 스크롤 + 좌측 목록 `scrollIntoView`(섹션이 바뀔 때만, 같은 섹션 내 필드 이동엔 재스크롤 안 함). 좌측 항목에 `data-sec-item`. → 셋 다 같은 섹션으로 포커스 일치(브라우저 검증: 메뉴/장소/참석응답 왕복).

**② 회색 힌트 새로고침 유지(editor-client.tsx):** `templateDefaults`가 localStorage에 저장되지 않아 새로고침 시 null이 되고 예시(회색)가 검은 실값으로 굳어 "기본값이 계속 들어가있다"로 보이던 문제. `SavedEditor`에 `templateDefaults` 추가, 3개 저장 지점(autosave/openPreview/저장) + 로드 복원. → 새로고침 후에도 미편집 예시 98/98 회색 유지·발행 시 drop 유지(브라우저 검증).

**③ 커버 사진(editor-shared.ts + 3 에디터):** 타임라인/큐트/개발자 테마의 테마 커버는 사진을 렌더하지 않는 텍스트/배지 커버라, `테마 기본` 레이아웃에서 사진 썸네일 클릭이 아무 효과가 없었음. `coverImagePatch(theme, layout, image)` 헬퍼 — 현재 커버가 사진을 못 보여주는 경우 `photo-center`(히어로) 레이아웃으로 자동 전환. 6개 패치 지점(썸네일+업로드 × 데스크톱 스타일탭/내용탭/모바일) 경유. → 타임라인 테마에서 사진 클릭 시 히어로 커버로 바로 표시(브라우저 검증).

**부수 버그(선반영):** 프리뷰 필드 선택 시 플로팅 스타일 툴바 effect가 매 렌더 새로 생기는 `visibleDraft`를 의존성으로 둬 setFtPos→리렌더 무한루프("Maximum update depth exceeded"). 의존성을 렌더 간 안정적인 `draft`로 교체. → 필드 선택 후 로그 max-depth 0건(검증).

검증: tsc 0, eslint 0 errors(기존 warning 3), 로컬 webpack dev + 브라우저(1440px 데스크톱 3열)에서 ①②③ 및 루프 수정 확인.

## 2026-09-11 (5) — 전 테마 에디터 QA 스윕 (이미지 업로드 + 잔버그)

**요청(사용자):** 에디터 전반 잔버그를 테마 전체로 점검(이미지 업로드 안 됨 등).

**검증:** 8개 테마(romantic/minimal/cute/editorial/timeline/battle/gaming/developer)를 데스크톱 3열에서 순회 — 크래시/빈 프리뷰/콘솔 React 에러 0(외부 폰트 fetch ERR_NAME_NOT_RESOLVED만, 무관). 이미지 업로드는 Supabase Storage(invite-photos) 익명 경로로 실제 업로드→공개 읽기→삭제까지 200 확인 → 백엔드 있으면 정상. 로컬/워크트리는 .env.local이 없어 authEnabled()=false라 "백엔드가 설정되지 않았어요" 표시(정상). *열린 이슈:* 로그인 사용자 경로 u/{userId} storage 정책은 사용자 JWT 없이 미검증.

**수정(선반영·검증):**
- 커버 삭제 방지: `del`이 cover면 no-op + 선택 섹션 삭제 시 selectedId 재지정. 좌측/모바일 목록에서 커버 삭제(X) 버튼 숨김(cover는 add 목록에 없어 재추가 불가→복구 불능 상태 차단). DOM 검증: cover만 삭제버튼 없음.
- 모바일 섹션 패널: 삭제/숨김/복제 버튼 없었음(추가/재정렬/타입변경만) → EditorApi에 del/duplicate/toggleHide/hidden 노출 + 버튼 배선(+ `.m-sec-actions` CSS, 32px 터치타깃). 커버는 삭제 버튼 제외. 브라우저 검증: 메뉴 섹션 삭제 동작.
- 모바일 디자인 탭 "Overlay 강도" 슬라이더 = 아무 데도 연결 안 된 죽은 컨트롤 → 제거(로컬 state만 있었음).
- GenericCover(사진 레이아웃) title/subtitle 인라인 편집 불가였음 → titleLines/title·subtitleLines/subtitle을 `<Editable>`로 래핑(names 기반은 인스펙터 이름 필드로 편집 유지). 커버 사진 자동 전환(타임라인/큐트/개발자)으로 GenericCover에 도달해도 제목/부제 편집 가능. 브라우저 검증: photo-center 전환 후 title=titleLines·sub=subtitleLines contentEditable.

**보고만(수정 보류 — 제품 결정/경미):**
- (P0) 테마 전환 시 새 테마가 못 그리는 섹션이 데이터·인스펙터엔 남고 프리뷰/발행엔 안 보임(무음). 거의 모든 교차-패밀리 전환에서 발생. 권장: 전환 시 못 그리는 섹션 자동 숨김(+경고) — 사용자 결정 필요.
- (P1) 섹션 복제 시 복제본은 인스펙터에서 편집 불가(ContentEditors가 타입별 first만 대상). 인라인 텍스트만 가능.
- (P1) matchInfo/champions 인스펙터 편집 그룹 없음(인라인만; 행/셀 추가·삭제 불가).
- (경미) 추가 섹션은 항상 엔딩 뒤에 붙음 / dayPlan `d.en`·versus `vsWord`·romantic connector 인라인 편집 불가.

검증: tsc 0, eslint 0 errors.

## 2026-09-11 (6) — 테마 전환 시 미지원 섹션 자동 제외(orphan)

**요청(사용자):** 테마 전환 시 새 테마가 못 그리는 섹션이 데이터엔 남고 발행엔 안 보이는 문제 해결.

**설계:** 저장 상태(auto-hide set) 없이 **파생값**으로 처리 — `canRenderInTheme(type)=!!themeRegistry[theme][type]`. `visibleDraft`가 `!hidden && canRenderInTheme`로 필터 → 프리뷰·발행(둘 다 visibleDraft 경유) 모두에서 미지원 섹션 제외. draft에는 남아있어 편집 가능하고, 테마를 되돌리면 자동 복귀(별도 unhide 로직 불필요, 수동 숨김과도 안 섞임). 좌측/모바일 목록엔 `orphan-sec`(흐리게)+"미표시" 배지+title 툴팁으로 이유 표시.

**검증(브라우저, 데스크톱 3열):** romantic→cute 전환 시 message·schedule만 "미표시"·프리뷰 12→10개로 제외(orphanCount=2), cute→romantic 되돌리면 12/12 전부 복귀(orphanCount=0). 콘솔 React 에러 0. tsc 0, eslint 0.

## 2026-09-11 (7) — 복제 섹션 인스펙터 편집 가능화

**요청(사용자):** 복제한 섹션이 인스펙터로 편집 안 되는 문제 해결.

**원인:** `ContentEditors`가 타입별 `find(t)`=첫 섹션만 대상으로 삼아, 같은 타입 복제본은 인스펙터 구조 편집(행/사진 추가·삭제 등)이 항상 첫 번째로 감.

**수정:** `find`가 **선택된 섹션(selectedId)**을 우선 반환하고 없을 때만 첫 섹션으로 폴백. `selectedId`를 ContentEditors에 prop으로 전달(데스크톱·모바일 둘 다). 좌측/프리뷰에서 복제본을 선택하면 그 타입의 인스펙터 그룹이 해당 인스턴스를 편집. 단일 섹션 동작은 불변.

**검증(브라우저):** 일정 섹션 복제(원본/복제 각 4항목) → 복제본 선택 → 인스펙터 "+ 일정 추가" → 복제본 4→5, 원본 4 유지. 콘솔 에러 0. tsc(앱 코드) 0, eslint 0.

## 2026-09-11 (8) — matchInfo·champions 인스펙터 편집기 추가

**요청(사용자):** matchInfo(배틀)·champions(게이밍) 인스펙터 편집기 추가.

**수정(content-editors.tsx):** 두 타입 편집 그룹 추가.
- 경기 정보(matchInfo): 제목(string) + cells[] 편집(항목 k / 값 + 추가·삭제). 값은 rich run(t/unit) 배열이라 편집 시 단일 run으로 합침(단위 스타일은 프리뷰 인라인 편집으로 유지 가능) — 코드베이스의 기존 flatten 관례와 동일.
- 챔피언(champions): Eyebrow + 제목(Line[]) + items[] 편집(아이콘 이모지 / 라인·이름 + 추가·삭제). picked 불리언은 보류(텍스트 컨트롤만 있는 Field 관례 유지).
`INSPECTOR_ORDER`에 matchInfo(versus 뒤)·champions(tierChart 뒤) 추가 — ContentEditors JSX 순서와 일치시켜 스크롤 싱크 정상.

**검증(브라우저):** jogi-battle에서 경기 정보 선택→그룹 렌더+"+ 항목 추가"로 셀 4→5. lol-rank에서 챔피언 선택→그룹 렌더(아이콘/라인)+"+ 챔피언 추가"로 8→9. 인스펙터 스크롤 싱크도 두 그룹으로 정상 이동. tsc(앱) 0, eslint 0, 콘솔 에러 0.

## 2026-09-11 (9) — 새 섹션 추가 위치 개선

**요청(사용자):** 새 섹션이 항상 맨 끝(엔딩 뒤)에 붙는 문제.

**수정(editor-client.tsx `addSection`):** `[...sections, new]`(무조건 끝) → 선택된 섹션 바로 뒤에 삽입, 단 엔딩 뒤로는 안 감(엔딩 앞으로 clamp). 선택 없으면 엔딩 앞(없으면 끝). 추가한 섹션을 selectedId로 지정해 사용자가 위치 확인.

**검증(브라우저):** date 선택 후 장소 추가→date 바로 뒤(index 3) 삽입+선택, 엔딩 여전히 마지막. 엔딩 선택 후 일정 추가→엔딩 바로 앞(second-last) 삽입, 엔딩 마지막 유지. tsc(앱) 0, eslint 0, 콘솔 에러 0. (데스크톱·모바일 공용 addSection.)

## 2026-09-11 (10) — 남은 미세 편집 갭 보강

**요청(사용자):** 남은 자잘한 편집 불가 항목 처리.

**수정:**
- versus "VS"(vsWord): 편집 불가였음 → `<Editable path="vsWord">`로 인라인 편집(battle/versus.tsx).
- romantic 커버 이름 연결어(connector, "&" 등): `<span class="and">`를 `<Editable path="connector">`로 래핑(cover.tsx). 연결어가 있을 때만(없으면 줄바꿈).
- dayPlan 일자 영문 라벨(day.en): 탭 버튼 안이라 인라인이 부적합 → 인스펙터에 "일자 N 영문" 필드 추가(content-editors.tsx).
- champions picked(주력 픽 강조): 불리언이라 인라인 불가였음 → 인스펙터 아이템에 체크박스 추가 + "+ 챔피언 추가" 기본값에 picked:false.

**검증(브라우저):** jogi-battle VS contentEditable, jisoo-minjun "&" contentEditable, yangyang-mt 인스펙터 "일자 N 영문" 3개, lol-rank picked 토글로 강조 타일 6→5. tsc(앱) 0, eslint 0, 콘솔 에러 0.

## 2026-09-11 (11) — P4: 카운트다운 eventStart 편집 중복 제거

**요청(사용자):** "다음 작업진행"(다음 작업 위임) → 로드맵 P4의 카운트다운 편집 중복 처리.

**문제:** 카운트다운 인스펙터 그룹이 자체 datetime-local(목표 일시=eventStart)을 갖고, 데스크톱·모바일 둘 다 항상 렌더하는 "캘린더 > 행사 일시"와 동일 값을 중복 편집(그룹 안내문도 "아래 행사 일시와 같은 값"이라 인정). dday 그룹은 이미 안내문만 두는 올바른 패턴.

**수정:** 카운트다운 그룹의 datetime 입력 제거 → dday처럼 "행사 일시 기준 자동 계산" 안내문으로 교체(단위 라벨만 편집). 죽은 `onEventStart` prop을 ContentEditors 시그니처·타입 + 2개 호출부(editor-client/mobile-editor)에서 제거. syncCoverDate는 캘린더 그룹 onChange에 그대로 남아 있어 커버 날짜 동기화 유지.

**검증(브라우저):** jogi-battle 인스펙터 datetime 입력 2→1, 카운트다운 그룹은 안내문만·캘린더 그룹 입력 유지. 캘린더 행사 일시 변경 시 배틀 커버 헤더 2027·04·18→2027·12·25 정상 동기화. tsc(앱) 0, eslint 0(기존 warning 2), 콘솔 에러 0.

## 2026-09-11 (12) — 모바일 문구별 텍스트 스타일 편집 추가

**요청(사용자):** "다음 작업진행" → 핸드오프 P1의 모바일 per-field 텍스트 스타일 갭 처리.

**문제:** 데스크톱은 프리뷰 문구 탭 시 플로팅 "문구 스타일" 툴바(크기·색·글꼴·굵기·기울임)가 있으나, 모바일은 `onSelectField` 미연결 + UI 없음. 데스크톱에서 지정한 스타일은 모바일 프리뷰/발행본에 렌더는 되지만 모바일에서 편집 불가.

**수정:** `EditorApi`에 selectedField/setSelectedField/selFieldStyle/patchTextStyle 노출(데스크톱 상태 재사용). 모바일 뷰어에 `onSelectField` 연결. 탭바 위에 뜨는 `.m-ts-float` 패널(공용 `TextStyleControls` 재사용) 추가 — 바텀시트 열리면 숨김(`!sheet`). editor.css에 `.m-ts-float`/`-head` 스타일(플렉스 항목이라 프리뷰가 줄고 탭 위에 얹힘, 매직오프셋 없음).

**검증(브라우저, 375px):** 커버 문구 탭→"문구 스타일" 패널(크기/색상/글꼴/스타일+초기화) 표시, 굵게 토글→해당 문구 computed font-weight 700, 시트 열면 패널 숨김. 데스크톱 경로 불변. tsc(앱) 0, eslint 0, 콘솔 에러 0.

## 2026-09-11 (13) — 모바일 레이아웃(콘텐츠 폭·배경) 컨트롤 추가

**요청(사용자):** "다음 작업진행" → 데스크톱/모바일 파리티 잔여(모바일에 레이아웃 탭 없음) 처리. (뷰어 reveal 모션은 이미 transform/opacity·IO·reduced-motion 준수라 개선 여지 적어 스킵.)

**문제:** 데스크톱은 레이아웃 탭에서 콘텐츠 폭(narrow/normal/wide)·배경(soft/solid/none)을 설정하나, 모바일엔 없음. 모바일 편집자는 layout.width/background 설정 불가.

**수정:** 모바일 디자인 시트(DecorPanel) 끝에 "콘텐츠 폭"·"배경" m-group 추가(데스크톱과 동일 옵션·동작, setDraft(layout) 갱신). DecorPanel은 이미 draft/setDraft 보유.

**검증(브라우저, 375px):** 디자인 시트에 두 그룹 표시, "넓게" 탭→active + localStorage draft.layout.width="wide" 저장. tsc(앱) 0, eslint 0, 콘솔 에러 0.
