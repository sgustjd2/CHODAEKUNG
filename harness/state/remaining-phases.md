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
  - FOLLOW-UP ✅ DONE (2026-09-07): the publish dialog's Kakao share imageUrl + OG/Kakao preview
    thumbnails now use the opengraph-image card (once published; cover pre-publish).

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

- **D1 · Monetization.** 🟡 SCAFFOLD DONE (2026-09-07); **real checkout DEFERRED (user, 2026-09-09)** —
  keep the scaffold, do not build payment infra until there's real traffic/demand; no provider chosen yet.
  Also decided 2026-09-09: **RSVP capacity (정원/마감) stays FREE** (it's a baseline expectation for the
  small-meetup use cases; premium stays gallery/storage + advanced analytics, per `entitlements.ts`).
  Decisions (user): per-invitation one-time
  unlock; premium = advanced analytics + capacity; scaffold-first, no real payments. Built
  `src/lib/invitation/entitlements.ts` (Tier/isPremium/FREE_LIMITS/PREMIUM_FEATURES/canAddGalleryPhoto),
  `tier` on the Invitation type, `UpgradeCta` (components/premium), and a wired+safe capacity gate
  (editor gallery photo-add past the free cap → CTA; premium unlimited). REMAINING:
  - Real checkout — a payment provider (KR: Toss Payments / PortOne; intl: Stripe). User must set
    provider keys in the console; a webhook flips the tier. **Make `tier` server-authoritative** (a DB
    column set by the webhook), NOT the client-editable data field the scaffold uses.
  - Enforce the advanced-analytics gate on the RSVP dashboard (charts/CSV) — needs the invitation
    tier plumbed to rsvp-client; do it WITH checkout so free owners aren't locked out beforehand.
  - Custom domain (yourname.moi) was NOT chosen as a premium gate; leave the publish-dialog copy or
    revisit if the model changes.
- **D2 · Public / creator marketplace.** The "Public · 검색 노출" visibility option sets
  visibility=published (now indexable via the SEO work), but there's no discovery/marketplace UI or
  creator-template listing. The copy promises "크리에이터 템플릿으로 마켓 등록" — unbuilt.
  **Decision (user, 2026-09-09): STATUS QUO** — leave the copy and the unbuilt state as-is for now; revisit
  discovery/marketplace direction later. No action this session.
- **D3 · Guest RSVP editing.** ✅ DONE (2026-09-07). On submit, the response is saved to
  `localStorage["chodaekung:rsvp:<slug>"]`; on return this browser enters edit mode — pill "응답 수정",
  modal pre-filled (name/response/guests/message) with an edit note, "수정 저장" button, "수정 완료"
  success. Backend dedupe (by name) makes the re-save update the entry (verified: 참석→불참 drops the
  guest from the roster). FUTURE: cross-device recognition for signed-in guests needs a server
  lookup (match by user id / prior RSVP), not just localStorage.

## Phase E — Remaining polish (low priority)

- **E1 · Publish dialog focus trap.** ✅ DONE (2026-09-07). Focus moves into the dialog on open, Tab
  is trapped, Escape closes, focus returns to the trigger (capture-on-open pattern). Verified
  focus-in + Tab-wrap + Escape; focus-return not re-verified live (programmatic focus is flaky in the
  automation pane) but is the standard pattern.
- **E2 · Twitter card for portrait covers.** ✅ RESOLVED by B1 — og/twitter images now point to the
  1200×630 opengraph-image card (landscape), so `summary_large_image` gets the right ratio; no
  portrait crop. No separate work needed.
- **B1 follow-up · Publish dialog share card.** ✅ DONE (2026-09-07). The publish dialog's Kakao share
  imageUrl + its OG/Kakao preview thumbnails now use the opengraph-image card once published (cover
  as the pre-publish approximation).
- **E3 · Skeleton loading.** ✅ DONE (2026-09-07). The attendee roster + guestbook render a subtle
  shimmer skeleton (chip / card shaped) while their first fetch is in flight, with `aria-busy` on the
  list and a reduced-motion fallback. Verified: skeletons in the SSR/pre-fetch render, replaced by
  content/empty once loaded. → **Phase E fully complete.**

## Standing user actions — STATUS

- ✅ Supabase migrations 0003/0004/0005 — applied (2026-09-07).
- ✅ Kakao Developers site-domain registration — done (share picker reached on the deployed domain).
- ◻ Optional: set `NEXT_PUBLIC_SITE_URL` on Vercel to pin the OG/sitemap origin. Currently it
  auto-resolves to `VERCEL_PROJECT_PRODUCTION_URL` (the public production domain), which works —
  only needed if a custom domain is added.
