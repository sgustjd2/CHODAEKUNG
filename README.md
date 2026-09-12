# 초대쿵 · CHODAE KUNG

[![E2E (mobile)](https://github.com/sgustjd2/CHODAEKUNG/actions/workflows/e2e.yml/badge.svg)](https://github.com/sgustjd2/CHODAEKUNG/actions/workflows/e2e.yml)

A mobile-first interactive **invitation builder** — create beautiful invitations for weddings,
birthdays, housewarmings, parties, small-group meetups (running, hiking, study, MT…) and
competitive "versus" invites, then publish and share by URL / KakaoTalk. Invitations are built from
mix-and-match content modules (timeline, menu, trip itinerary, versus matchup, attendee roster) so
each occasion shows only what it needs.

> Make it easy to create, beautiful to view, and effortless to share.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** + centralized design tokens (`src/app/tokens.css`)
- **Supabase** (Postgres + Storage + Auth) via a server-side service client
- `next/og` for per-invitation Open Graph share cards · **Playwright** for tests

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — see Environment below
npm run dev                  # http://localhost:3000
```

Without `.env.local` the app runs in **demo mode** on bundled sample invitations (no persistence);
the public viewer serves the curated samples so every screen works offline.

> **Git worktree note:** if `node_modules` is a symlink (common in a worktree), Turbopack — the
> `next dev` default — panics ("Symlink … points out of the filesystem root"). Use the webpack
> engine instead: `npm run dev -- --webpack` (and `next build --webpack`).

### Environment (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — never expose to the client |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | Optional — KakaoTalk share + Kakao Map pin |
| `NEXT_PUBLIC_SITE_URL` | Optional — pins the OG/sitemap origin (else auto from Vercel) |

## Tests

Playwright, run on a real Chromium at an iPhone 13 device profile (the primary experience). The
config starts a **production build** itself, so no server needs to be running.

```bash
npx playwright install chromium   # once
npm run test:e2e                  # unit (tests/unit) + mobile e2e (tests/e2e)
npm run test:e2e:report           # open the last HTML report
```

- `tests/unit` — pure logic (accent-contrast math, .ics builder, entitlements, calendar grid,
  share/OG meta, map links, text styles).
- `tests/e2e` — mobile smoke of the create→edit→publish flow, the public viewer across themes,
  landing/templates, dead-link 404s, SEO routes, and an axe accessibility gate.

CI (`.github/workflows/e2e.yml`) runs the suite on every push/PR; it's a **required check** on `main`.

## Architecture

```
src/
├─ app/                         # App Router routes
│  ├─ page.tsx (landing) · templates/ · new/ (wizard) · editor/
│  ├─ i/[slug]/ (public viewer + opengraph-image) · dashboard/ · rsvp/ · admin/ · …
│  ├─ robots.ts · sitemap.ts · manifest.ts · tokens.css
│  └─ proxy.ts is at src/proxy.ts (Next 16 — NOT middleware.ts; refreshes the Supabase session)
├─ components/
│  ├─ editor/                   # authoring: draft state, inspector, mobile bottom-sheet, publish
│  └─ viewer/                   # public render: section-registry + per-theme section renderers
└─ lib/invitation/              # data model (types), samples, store + server actions, helpers
```

- **Structured data, not HTML.** An invitation is `{ slug, theme, sections[], …design tokens }`;
  each `section` is `{ id, type, content }`. The same data drives the editor preview and the
  published page.
- **Section renderer registry** (`components/viewer/section-registry.ts`): `theme → (section.type →
  component)`, across 8 themes (romantic, minimal, cute, editorial, timeline, developer, battle,
  gaming). Adding a theme = adding a renderer set.
- **Editor vs Viewer** are separate concerns. Inline WYSIWYG editing is a `<Editable>` wrapper that
  is contentEditable only inside the editor (via `EditContext`) and plain text on the public page.
- **Data layer** (`lib/invitation/store.ts`, `actions.ts`): Supabase service client when configured,
  bundled samples otherwise. Guests RSVP anonymously; owners manage from `/dashboard`.

## Docs

- **`CLAUDE.md`** — implementation constitution (design-fidelity + component rules). Read before
  contributing.
- **`prd.md`**, **`prd-admin.md`** — product requirements.
- **`harness/state/`** — living implementation log, component registry, and roadmap.

## Deploy

Vercel (production build `npm run build`). Set the environment variables above in the project
settings; apply the SQL under `supabase/` to a Supabase project for persistence.
