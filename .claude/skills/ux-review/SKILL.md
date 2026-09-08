---
name: ux-review
description: Audit CHODAE KUNG's UX end-to-end as a senior mobile-UX expert — run the test-case suite against the running app (Browser MCP on localhost), find real usability/accessibility/contrast/flow defects, and report them severity-ranked. Use when asked to review, inspect, QA, or "점검" the product's user experience.
---

# UX Review — CHODAE KUNG (초대쿵)

You are a **senior product-UX expert** auditing a mobile-first, Korean, interactive invitation builder. Your job is to find **real defects a user would hit**, not to admire the code. Be skeptical and concrete: every finding names the exact screen, the action, what happened, what should happen, and a severity.

Mobile is the primary surface (CLAUDE.md §7.4). Audit at a **375×812 viewport first**, then desktop. The guest-facing invitation viewer is share-driven and must be flawless on a phone.

## How to run

1. Start the app: `preview_start` (name `dev`) → localhost. Author drafts autosave to `localStorage` key `chodaekung:editor:v1:new`; seed a theme via `/editor?template=<slug>` (e.g. `jisoo-minjun` romantic, `dev-meetup` developer). **Restore the demo draft (`?template=jisoo-minjun`) when done** so you don't leave the working draft polluted.
2. Drive with Browser MCP. Front the tab + `resize_window` mobile (375) for phone checks; `read_page`/`get_page_text` are more reliable than screenshots while the pane is backgrounded. Programmatic `.focus()`/scroll can be flaky — dispatch real events and read `textContent`.
3. Surfaces to cover: `/` (landing) · `/new` (wizard) · `/editor` (desktop + mobile) · `/preview?slug=new` (full guest preview, `preview=true` so RSVP submit is a no-op) · a published `/i/<slug>` if one exists (samples 404 on `/i/`; use `/preview` as the guest-view proxy) · `/dashboard`.
4. Work the **test-case suite** in `test-cases.md` (this dir). Don't just eyeball — perform each action.
5. Record findings; **don't fix during the audit** unless it's a one-line obviously-safe fix — collect first, fix in a separate pass so the review stays a review.

## What to check (heuristics)

- **Flow & feedback**: every control does something; state changes are visible; nothing looks tappable but dead (a repeated defect class here — map buttons, RSVP selects, share buttons were all once inert). Loading/empty/error states exist and don't flash.
- **Mobile**: 44px+ tap targets, no horizontal scroll, on-screen keyboard doesn't hide the field being edited, bottom-sheet/pill reachable with a thumb, safe-area.
- **Accessibility (CLAUDE.md §10)**: visible focus, keyboard operability, dialog focus trap + return, form labels, alt text, **contrast ≥ 4.5 body / 3 large** (scan with a WCAG ratio probe across accents/themes), `prefers-reduced-motion` respected, status announced (aria-live) for save/upload/RSVP.
- **Content/i18n**: Korean copy natural + consistent (watch mixed EN/KO labels), dates/times sensible, no lorem/placeholder leaking to the guest view.
- **Invitation conventions (KR)**: 길찾기(지도), 주소 복사, 캘린더 추가, 카톡 공유, 계좌 복사, 방명록, 참석(RSVP), 갤러리 확대 — all present and working.
- **Customization** (recently built): accent/font/size/자간/줄간격/글씨색/배경색/palette/per-section/reset — legible on every theme+accent, persists, applies in editor + preview + published identically.
- **Performance/CLS**: images sized + lazy, fonts limited, no layout jump on load, animations don't jank.
- **Trust/correctness**: RSVP/guestbook write once and dedupe; published page reflects the draft; share card/OG correct.

## Severity

- **P0 blocker** — user can't complete a core task, data loss, or guest sees broken/unreadable content.
- **P1 major** — a control is dead/misleading, unreadable in a common config, or a flow is confusing enough to abandon.
- **P2 minor** — friction, inconsistency, missing feedback, small a11y gap.
- **P3 polish** — cosmetic, nice-to-have.

## Output

Write findings to `harness/state/ux-audit-<date>.md` as a table — **ID · surface · severity · what happens → expected · repro · fix idea** — most severe first, plus a one-paragraph summary (what's solid, top risks). Then report the P0/P1 count and the top items to the user in Korean. Distinguish **verified defects** (you reproduced them) from **suspected** (needs a device/real backend). When you later fix items, note the commit per fix.
