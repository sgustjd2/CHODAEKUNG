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
