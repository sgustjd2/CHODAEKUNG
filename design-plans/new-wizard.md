> **RESOLUTION 2026-09-09 — Plan 1 APPLIED; Plan 2 SKIPPED.**
> - **Plan 1 (`.input:focus` ring):** APPLIED (`tokens.css:311` `rgba(123,45,46,0.15)` → `rgba(227,139,139,0.15)`).
>   Confirmed the value is a stale burgundy (#7B2D2E) literal orphaned by the coral `--wax` rework (user
>   decision UX-04, precedence #1) — it matches neither the current `--wax` (#C25C5C) nor Genspark's `--wax`
>   (#E38B8B); every other ring app-wide uses the coral tint `rgba(227,139,139,…)` and `templates.css:268`
>   has the identical `0 0 0 3px rgba(227,139,139,0.15)`. NOTE: the vendored Genspark `design/assets/tokens.css`
>   also carries the stale burgundy on its `.input:focus` — the live token file is intentionally ahead of it.
> - **Plan 2 (event-card checkmark SVG → glyph):** SKIPPED. Not a user-visible defect (both render a checkmark);
>   the SVG is font-independent so a `content:'✓'` glyph could regress cross-platform. Low value; left as-is.

# Create wizard (`/new`) — improve-ui audit

Written against: abc2c5c

## Design language
- Audited surface: `/new` create wizard — `src/app/new/page.tsx` + `src/app/new/wizard.css`, rendering `src/components/new/new-invitation-wizard.tsx`; shared primitives traced through it: `src/components/ui/button.tsx`, `icon.tsx`, `logo.tsx`, `address-search.tsx`; tokens from `src/app/tokens.css` (loaded globally via `src/app/globals.css`).
- Design sources: no `design/genspark/` folder and no `DESIGN.md` exist in this repo. Per this repo's own governance, `src/app/tokens.css` + `src/app/globals.css` + existing component CSS are the design system of record (`harness/context/SOURCE_OF_TRUTH.md` §"Existing code"; `CLAUDE.md` §1 precedence #4).
- Documented decisions: `tokens.css:21-23` — `--wax` was "deepened from #E38B8B for readability... One token serves both surfaces" (carried through `harness/state/ux-audit-2026-09-08.md` UX-04/UX-05). `tokens.css:9-12` — the palette's own top comment records the app moved away from "어두운 버건디" (dark burgundy) toward "밝은 코럴/피치" (bright coral/peach).
- Governing owners and consumers: `.input` (tokens.css, global primitive) consumed by every text field in the wizard; `.event-card`/`.style-card`/`.step-dot` (wizard.css, surface-local) render Steps 1, 3, and the stepper.
- Explicit exceptions: None documented.

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
|---|---|---|---|---|---|
| 1 | `.input:focus`'s ring color is an orphaned pre-rework value that matches neither the current `--wax` nor the app's live wax-tint-ring idiom | `tokens.css:311` hardcodes `rgba(123,45,46,0.15)` — a dark maroon matching this repo's own description of its *pre*-coral-rework palette (`tokens.css:9-12`), unique in the codebase (no other match for this RGB), while `border-color` on the same rule already tracks the current `var(--wax)`; the app's live idiom for this exact "ring around a focused/active/selected element" affordance is `rgba(227,139,139, alpha)`, confirmed current in `editor.css:44,240`, `templates.css:268`, `viewer.css:59` | Swap the RGB triplet only, `rgba(123,45,46,0.15)` → `rgba(227,139,139,0.15)`, keeping the alpha | `src/app/tokens.css` (global `.input`, reached by the wizard's Step 1–2 text fields) | High |
| 2 | The Step 1 "selected" checkmark badge (`.event-card.selected::after`) is a one-off inline-SVG-background implementation, while the identical badge purpose is expressed twice elsewhere with a plain `content:'✓'` glyph | `wizard.css:61-63` `.step-dot.done::after{content:'✓'}` and `wizard.css:285-292` `.style-card.selected::after{content:'✓';...}` (same file) plus `landing.css:468` `.price-card li::before{content:'✓'}` (different file) all agree on the glyph technique; `wizard.css:133-142` `.event-card.selected::after` instead hand-encodes an SVG data-URI — the only checkmark built this way anywhere in the repo | Replace the SVG background-image with the same `content:'✓'` glyph technique, keeping the existing 20px circle/`var(--wax)` fill/position | `src/app/new/wizard.css` (Step 1 event-card grid) | Medium-High |

## Improve first
Finding 1 — highest confidence and lowest correction cost: it's a single hardcoded RGB triplet with no plausible deliberate justification (it doesn't match any live token or the app's own established tint-ring idiom), it's reachable from every field in the wizard's Step 1–2 forms, and the fix is a one-line, zero-ambiguity value swap onto an idiom already used ~10+ times elsewhere in the app today.

---

# Plan 1 — Wizard input focus ring matches the current wax-tint idiom, not an orphaned pre-rework color

Written against: abc2c5c

## Evidence chain

- Surface: `/new` create wizard, Step 2 (기본 정보) — all five text fields (제목/서브 메시지/날짜/시간/장소, `new-invitation-wizard.tsx:475-493`) and the Step 1 custom-event-name field (`#cepName`, `new-invitation-wizard.tsx:393`), all rendered with the shared `className="input"`.
- Problem: focusing any `.input` field shows a focus ring in a color that doesn't belong to the app's current palette or its established "ring around an active/focused/selected element" idiom.
- Design evidence:
  - `src/app/tokens.css:308-312`:
    ```
    .input:focus {
      outline: none;
      border-color: var(--wax);
      box-shadow: 0 0 0 3px rgba(123,45,46,0.15);
    }
    ```
    `border-color` correctly tracks the live `--wax` token (`#C25C5C` = rgb(194,92,92)); the ring hardcodes `rgba(123,45,46,0.15)` — dark maroon — which matches neither `--wax` nor `--wax-deep` (`#C96A6A` = rgb(201,106,106)) nor any other current token. A repo-wide search for this exact RGB triplet (`123,45,46`) returns only this one line.
  - `src/app/tokens.css:9-12` — the palette's own top-of-file comment records the app's move away from "어두운 버건디" (dark burgundy) toward "밝은 코럴/피치 계열" (bright coral/peach); rgb(123,45,46) is a dark maroon/burgundy, consistent with being an un-migrated leftover from that earlier palette rather than a deliberate current choice.
  - The app's established, currently-live idiom for this exact affordance (a low-opacity tinted ring around a focused/active/selected element) is `rgba(227,139,139, alpha)` — confirmed live in `src/app/editor/editor.css:44` (`.sec-item.active`), `:240` (`.vis-item.selected`), `src/app/templates/templates.css:268`, and `src/components/viewer/viewer.css:59` (`.iv-editable:focus`). `.input:focus` is the only ring in the codebase using a different, unexplained RGB instead of this idiom.
- Owner: `src/app/tokens.css` — `.input:focus` is a global shared primitive, not wizard-scoped, but is reached by the wizard's traced render path through the shared `.input` class.
- Scope and affected surfaces: every `.input` consumer app-wide (wizard Steps 1–2, login form, dashboard forms, editor property text fields) shares this one rule.
- Uncertainty: none. The correction is a single RGB-triplet swap onto an idiom already dominant and current elsewhere in the same app.

## Design decision

Replace the orphaned `rgba(123,45,46,...)` on `.input:focus` with the app's live wax-tint ring idiom `rgba(227,139,139, alpha)`, keeping the existing `0.15` alpha and the already-correct `border-color: var(--wax)`. This removes the one ring color in the app that belongs to neither the current solid-wax family nor the established tint-ring family, introducing zero new values — it adopts an idiom already used 10+ times elsewhere for the identical purpose.

## Reuse

- `rgba(227,139,139, alpha)` — the app's established wax-tint ring/glow idiom.
- Exemplar: `src/app/editor/editor.css:44` (`.sec-item.active`) and `:240` (`.vis-item.selected`).

No new primitive is needed — this is a one-line value correction inside an existing rule.

## Changes

1. `src/app/tokens.css`
   - Change: line 311, `box-shadow: 0 0 0 3px rgba(123,45,46,0.15);` → `box-shadow: 0 0 0 3px rgba(227,139,139,0.15);`
   - Preserve: `border-color: var(--wax)` on the same rule (already correct, untouched); the `3px` ring width and `0.15` alpha.
   - Verify: focus any `.input` in `/new` Step 2 — the ring now reads as the same coral-tint family used by `.sec-item.active`/`.vis-item.selected`, not a mismatched dark-maroon halo.

## Scope

- Inherit: every `.input` consumer app-wide (login form, dashboard, editor property panel text fields, wizard Steps 1–2) — all pick up the corrected ring automatically since this is one shared rule.
- Verify: spot-check `/new` Step 2's five fields and the Step 1 `#cepName` custom-event field (the surfaces this audit traced).
- Exclude: `border-color: var(--wax)` (already correct); the separate `:focus-visible` outline rule in `globals.css` (a different, keyboard-only mechanism, not this box-shadow).

## Validation

- Product: open `/new`, focus the 제목 field — ring shows a coral tint, not brown/maroon.
- Interface: repeat for 서브 메시지/날짜/시간/장소 and the custom-event `이벤트 이름` field; spot-check the login form's `.input` (same shared rule) still looks correct.
- System: `grep -rn "123,45,46" src/` → no matches after the change.
- Repository: CSS-only change, no build/typecheck impact; run `bash harness/scripts/verify.sh` if available.

## Stop conditions

- Stop if a design source is found stating `.input:focus` was deliberately given a ring color distinct from every other active/selected state in the app — none was found in this audit.

## Design documentation

- After acceptance: none required — this brings an outlier back in line with an idiom already dominant and documented by example elsewhere; no new decision is being introduced.

---

# Plan 2 — Event-card "selected" checkmark uses the app's shared glyph technique, not a one-off inline SVG

Written against: abc2c5c

## Evidence chain

- Surface: `/new` create wizard, Step 1 (이벤트 선택) — the `.event-card.selected` state on any of the 33 curated event cards plus the custom "직접 입력" card, rendered by `new-invitation-wizard.tsx:337-347` (`className={`event-card${event === e.id ? " selected" : ""}`}`) and `:359-368`, styled by `src/app/new/wizard.css:133-142`.
- Problem: the "this card is selected" checkmark badge is implemented three different ways within this one small file family, and `.event-card.selected` is the outlier.
- Design evidence:
  - `src/app/new/wizard.css:61-63`:
    ```
    .step-dot.done { background: var(--sage); border-color: var(--sage); color: var(--paper); }
    .step-dot.done::after { content: '✓'; }
    ```
    (size/centering inherited from `.step-dot`'s own `display:flex;align-items:center;justify-content:center`).
  - `src/app/new/wizard.css:285-292`:
    ```
    .style-card.selected::after {
      content: '✓';
      position: absolute; top: 12px; right: 12px;
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--rose); color: var(--paper);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; z-index: 5;
    }
    ```
    Same file, same "circular badge, top-right corner of a selectable card" purpose as `.event-card.selected`.
  - `src/app/landing.css:468` — `.price-card li::before { content: '✓'; color: var(--rose); font-weight: 700; }` — a third, cross-file exemplar of the same glyph technique, confirming it (not inline SVG) is the app's established checkmark idiom.
  - `src/app/new/wizard.css:133-142` instead renders the checkmark as a hand-authored inline SVG data-URI on a `background-image`:
    ```
    .event-card.selected::after {
      content: '';
      position: absolute; top: 10px; right: 10px;
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--wax);
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M20 6L9 17l-5-5'/></svg>");
      background-size: 12px;
      background-position: center;
      background-repeat: no-repeat;
    }
    ```
    A repo-wide search for comparable inline-SVG-checkmark patterns (`stroke='white'` on a check path) finds no other match — this is the only checkmark in the codebase built this way.
- Owner: `src/app/new/wizard.css` — scoped to `.wizard`, this file only.
- Scope and affected surfaces: the Step 1 event-card grid only (all 33 curated cards + the custom "직접 입력" card share `.event-card`).
- Uncertainty: none. Two in-file exemplars plus one cross-file exemplar agree on the glyph technique; no counter-exemplar for the SVG technique exists anywhere else in the repo.

## Design decision

Replace `.event-card.selected::after`'s inline-SVG-background checkmark with the same `content: '✓'` glyph technique already used by `.step-dot.done` and `.style-card.selected` (and `landing.css`'s price list), keeping the existing 20px circle, `var(--wax)` fill, and `top:10px;right:10px` position. This removes a one-off implementation that duplicates something the design system already expresses three other ways, with no change to the badge's size, color, or position.

## Reuse

- `content: '✓'` on a flex-centered circular badge — the app's established checkmark technique.
- Exemplar: `src/app/new/wizard.css:285-292` (`.style-card.selected::after`) — same file, same "top-right circular selected badge" purpose; reuse its `display/align-items/justify-content/color/font-weight` structure, scaled to the smaller 20px circle.

No new primitive is needed.

## Changes

1. `src/app/new/wizard.css` (lines 133-142)
   - Change: remove `background-image` / `background-size` / `background-position` / `background-repeat`; add `content: '✓'; display: flex; align-items: center; justify-content: center; color: var(--paper); font-size: 11px; font-weight: 700;`. Keep `background: var(--wax)` (already present) and the existing `position/top/right/width/height/border-radius`.
   - Preserve: the 20px circle size, `var(--wax)` fill, `top:10px;right:10px` position, and that the badge only appears on `.event-card.selected` (unselected cards show none).
   - Verify: select any event card in Step 1 — the badge still reads as a white checkmark in a small coral circle at the card's top-right corner, now rendered as text instead of a background-image glyph.

## Scope

- Inherit: all 33 curated event cards + the custom "직접 입력" card (all share `.event-card`).
- Verify: visually confirm the glyph is legible at 20px — compare against `.style-card.selected`'s 24px circle / 13px glyph ratio (`.event-card`'s circle is ~83% that size, so ~11px is proportional; adjust by eye if it reads too small or too large in the rendered browser).
- Exclude: `.style-card.selected` and `.step-dot.done` (already correct, untouched); `.event-card.selected`'s `border-color`/background-tint/box-shadow (unrelated to the checkmark, untouched).

## Validation

- Product: open `/new` Step 1, click an event card — the selection badge still clearly shows a checkmark.
- Interface: check a short-name card (e.g. 생일) and a long-name card (e.g. 브라이덜 샤워) to confirm the badge doesn't collide with card content; check the custom "직접 입력" card too.
- System: `grep -n "event-card.selected" src/app/new/wizard.css` → no remaining `background-image` reference after the change.
- Repository: CSS-only change, no build/typecheck impact.

## Stop conditions

- Stop if rendered inspection shows the glyph checkmark is noticeably less crisp than the SVG at 20px in this product's target browsers — if so, the SVG technique should instead be adopted by `.style-card.selected`/`.step-dot.done` (reverse direction), not deleted from `.event-card`.

## Design documentation

- After acceptance: none required — this aligns an outlier with an idiom already used twice elsewhere in the same file; no new decision is being introduced.
