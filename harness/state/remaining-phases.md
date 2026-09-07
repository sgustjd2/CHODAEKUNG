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

## Phase A — Verify the newly-unblocked backend features ✅ DONE (verified 2026-09-07)

Both were code-complete + wired, just DB-gated; confirmed working end-to-end against the live
tables, no fixes needed.

- **A1 · View analytics.** ✅ `bumpViewAction` → `rpc("increment_views")` increments per live-page
  mount; verified the count went 1→3 after exactly 2 loads on the deployed (production) build
  (accurate +1 each, no StrictMode double-count in prod). Dashboard reads `inv.views`.
- **A2 · Media uploads.** ✅ Verified the exact `uploadPhoto` path at the storage layer: an anonymous
  upload to `invite-photos/g/…` returns 200 (RLS "anyone can upload" allows it) and the public URL
  serves the image (200). Not driven through the editor's file picker (the in-app browser can't
  supply a file input), but the bucket/RLS/public-URL parts that were gated are proven; the editor
  onChange→uploadPhoto→patch wiring is existing code. Follow-up if desired: exercise the editor
  cover/gallery upload + ImageCropper shell with a real file (needs a browser with file upload).

## Phase B — Share-card quality ✅ DONE (verified 2026-09-07)

- **B1 · Per-invitation dynamic OG image.** ✅ Built `src/app/i/[slug]/opengraph-image.tsx` (next/og,
  runtime nodejs): a composed 1200×630 card — cover photo + bottom gradient + title + date + 초대쿵
  mark. Korean via a Google Fonts `?text=` **TrueType** subset (send NO browser UA → Google returns
  ttf; this Satori can't decode woff2). Robust: font-fetch failure → image-only card, missing cover →
  dark bg. generateMetadata no longer sets og/twitter images (that suppressed the file convention);
  Next now emits og:image + twitter:image → this route at an accurate 1200×630. The Kakao SDK button
  (share-bar.tsx) points imageUrl at the same route so both share paths match. Verified: card renders
  locally (Korean OK, clean layout) AND on the deployed production build (og:image = route → HTTP 200
  image/png, same bytes as local).
  - FOLLOW-UP (minor): the **publish dialog** (publish-dialog.tsx) still builds its Kakao share
    imageUrl + its OG/Kakao *previews* from the raw cover, not this route. Point its share at the
    route and/or update the preview thumbnails for full consistency (owner-facing, low urgency).

## Phase C — Creation-flow depth ✅ DONE (verified 2026-09-07, chose blank-start-only)

- **C1 · Wizard basics → date section.** ✅ Decision (user): fill content sections on a BLANK start
  only; a named-template start keeps the template's own sections (still gets the cover overlay +
  eventStart). Implemented `fillBlankDateSection` (editor-client.tsx), called only in the blank
  branch, setting the fields each theme's date renderer uses — title + calendar month grid
  (romantic), bigDate + dataGrid (minimal/developer), title (cute). Extracted `monthGrid` to
  `src/lib/invitation/month-grid.ts` (shared with the romantic sample). Verified blank romantic
  (title + Sep-2027 grid) + blank minimal (bigDate/dataGrid) + that a template start is NOT
  overwritten.
  - NOT DONE (out of scope, low value): the schedule section and the non-`date` themes
    (editorial/timeline `details`, battle `matchInfo`/`countdown`, gaming `gInfo`) — their date is on
    the cover + eventStart; add per-section fills later only if needed.

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
