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
