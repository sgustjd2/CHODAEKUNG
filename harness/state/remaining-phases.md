# Remaining Phases — CHODAE KUNG

Forward-looking roadmap for a fresh session. Read this together with `implementation-log.md`
(what's already built) and `CLAUDE.md`. Written 2026-09-07.

## Where the product stands

The core is mature and hardened. Done and verified: the full create → publish → view → RSVP
loop; all section types + their editors; three real-time surfaces (attendee roster, guestbook,
owner RSVP dashboard — all deduped to each guest's latest response); route + app error boundaries;
perf (lazy-loaded grids + photos re-encoded 16.7MB→5.8MB); privacy/SEO (robots.txt, sitemap,
visibility-aware noindex); a11y (RSVP dialog focus trap + focus-return, live-region form messages,
16px iOS inputs, reduced-motion); the /new wizard seeding; Next 16 `proxy` migration; web app
manifest + theme-color; and the KakaoTalk/OG share card (image now served from the public
production domain, dimensions un-declared).

**Backend is fully live** (verified 2026-09-07): all migrations 0001–0005 applied (guestbook,
views column + increment_views RPC, invite-photos storage bucket), and the Kakao Developers site
domain is registered (Kakao share picker reached on the deployed domain). See the `backend-state`
memory. So NO migration- or config-gated work remains.

Verify DB-backed work with the `db-verification-workflow` memory (publish via editor + Supabase
REST to seed/clean rows). The Browser pane must be FRONTED (`tabs_select`) for focus/click/layout
tests — backgrounded it reports viewportW:0 and won't register focus.

---

## Phase A — Verify the newly-unblocked backend features (highest priority, low effort)

These are **code-complete and wired**; they were DB-gated and are now unblocked, but were never
run end-to-end against the live tables. Confirm each works; wire/fix only if a gap shows.

- **A1 · View analytics.** `ViewPing` (invitation-viewer.tsx) → `incrementViewsAction` →
  `rpc("increment_views")` (actions.ts:~128); dashboard shows `inv.views`. VERIFY: open a published
  `/i/<slug>` a few times, then confirm the dashboard's Views count rises (guard against double-count
  in React strict/dev; consider dedupe by session if it over-counts).
- **A2 · Media uploads + crop.** `uploadPhoto` (src/lib/db/upload.ts) → `storage.from("invite-photos")`
  → public URL; used by the editor cover/gallery pickers (content-editors.tsx:~616) and the `/media`
  page. VERIFY: upload a cover and a gallery photo in the editor, confirm the public URL renders in
  the preview and persists after publish; check the ImageCropper shell behaves. `photoUrl()` already
  passes absolute (uploaded) URLs through.

## Phase B — Share-card quality (biggest deferred enhancement)

- **B1 · Per-invitation dynamic OG image.** Today the OG/Kakao image is the raw cover photo (portrait
  covers get center-cropped in the landscape card). Build a composed 1200×630 card (cover + event
  title + date + 초대쿵 mark) at `src/app/i/[slug]/opengraph-image.tsx` via `next/og` `ImageResponse`
  (runtime "nodejs"). Korean text needs a font: fetch a **subset** via Google Fonts `?text=<glyphs>`
  (full CJK fonts are too large) and pass the woff2 as `fonts`. Make it robust (try/catch → fall back
  to the plain cover so the card never breaks). VERIFY by navigating to the opengraph-image route and
  screenshotting the PNG (Korean must render, not tofu). NOTE: Kakao feed cards already show
  title/description as text beside the image, so the main win is aspect ratio + polish, not new info.

## Phase C — Creation-flow depth

- **C1 · Wizard basics → content sections.** `applyWizardSeed` (editor-client.tsx) now fills the cover
  (title/subtitle/dateLabel), the location section's title, and `eventStart` — but NOT the date /
  schedule / detail SECTIONS. So a *template* start shows the user's date on the cover while the date
  section still shows the template's sample date. Mapping the wizard date into each theme's date
  section is fiddly (bigDate `["05","15"]`, dataGrid day-of-week, etc. vary per theme). Decide first
  whether a *named-template* start should overlay basics at all (the user chose that template to
  customize) or whether full overlay should be blank-start only — this is a small product call; if
  unsure, SURFACE it (CLAUDE.md §15) rather than inventing per-theme mappings.

## Phase D — Product decisions (SURFACE, don't invent — CLAUDE.md §15)

These are referenced in the UI but unbuilt; each needs the user's product direction before coding.

- **D1 · Monetization.** The publish dialog mentions a "Pro 플랜" and custom domain ("yourname.moi").
  No plans/billing/entitlements exist. Needs direction (what's gated, pricing, provider).
- **D2 · Public / creator marketplace.** The "Public · 검색 노출" visibility option sets
  visibility=published (now indexable via the SEO work), but there's no discovery/marketplace UI or
  creator-template listing. The copy promises "크리에이터 템플릿으로 마켓 등록" — unbuilt.
- **D3 · Guest RSVP editing.** A returning guest who RSVPs again is handled correctly (dedup keeps the
  latest), but there's no explicit "you already responded / edit your response" UX. Decide the desired
  behavior (recognize the guest? let them see/change their prior answer?).

## Phase E — Remaining polish (low priority)

- **E1 · Publish dialog focus trap.** The publish dialog has Escape-close but no focus trap /
  focus-return. Apply the same pattern as the RSVP modal (share-bar.tsx: trap Tab, restore focus to
  the trigger).
- **E2 · Twitter card for portrait covers.** `twitter:card` is `summary_large_image` (landscape); a
  portrait cover crops. Consider `summary` when the cover is portrait, or wait for B1.
- **E3 · Skeleton loading.** Client-fetched sections (attendees/guestbook) now hide their empty state
  until the first fetch resolves; a subtle skeleton would be nicer than the brief blank.

## Standing user actions — STATUS

- ✅ Supabase migrations 0003/0004/0005 — applied (2026-09-07).
- ✅ Kakao Developers site-domain registration — done (share picker reached on the deployed domain).
- ◻ Optional: set `NEXT_PUBLIC_SITE_URL` on Vercel to pin the OG/sitemap origin. Currently it
  auto-resolves to `VERCEL_PROJECT_PRODUCTION_URL` (the public production domain), which works —
  only needed if a custom domain is added.
