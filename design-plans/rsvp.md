> **RESOLUTION 2026-09-09 — Plan 1 APPLIED; Plans 2 & 3 REJECTED (mockup-faithful false positives).**
> This audit was source-only and did NOT see the authoritative Genspark mockup `design/09_rsvp_dashboard.html`
> (the visual source of truth per CLAUDE.md §1.2). Checked against it before acting:
> - **Plan 1 (breadcrumb):** APPLIED. Mockup line 319 confirms `DASHBOARD · INVITATIONS · RSVP`; the non-live
>   branch was unified to match (`rsvp-client.tsx:152`).
> - **Plan 2 (unify CSV label):** REJECTED. The mockup uses two labels ON PURPOSE — `CSV 내보내기` in the top bar
>   (line 322) and `CSV 다운로드` by the table (line 476). The code matches the mockup exactly; unifying would
>   deviate from approved design (CLAUDE.md §4.1). Left as-is.
> - **Plan 3 (maybe badge color):** REJECTED. Mockup line 262 uses the same slate `rgba(110,122,147,…)` for
>   `.badge-tag.maybe`; the code matches the mockup. The slate-tint "pending/neutral" look is a deliberate
>   design choice, not drift. Left as-is.

# RSVP owner dashboard — design plans

Source audit: owner RSVP dashboard surface (`src/app/rsvp/page.tsx` → `src/components/rsvp/rsvp-client.tsx`, styled by `src/app/rsvp/rsvp.css`, tokens from `src/app/tokens.css`). Source-based audit only (surface is behind a login gate; no rendered evidence used). Three independent findings, each below as its own self-contained plan. Apply them independently; none depends on another.

---

# Plan 1 — Unify the RSVP breadcrumb across load states

Written against: abc2c5ced968a9c9e649e125fddb890d98ad2519

## Evidence chain

- Surface: `src/components/rsvp/rsvp-client.tsx`, component `RsvpClient`
- Problem: The page renders the same `.top-crumb` breadcrumb element with two different text contents depending on data-load state. In the non-live branch (`access !== "live"`, covering `loading`, `denied`, and `none`) it reads `DASHBOARD · RSVP` (line 152: `<div className="top-crumb">DASHBOARD · <b>RSVP</b></div>`). In the live branch (`access === "live"`) it reads `DASHBOARD · INVITATIONS · RSVP` (line 187: `<div className="top-crumb">DASHBOARD · INVITATIONS · <b>RSVP</b></div>`). Both branches render at the same route (`/rsvp`) for the same page identity; the breadcrumb should represent static navigational hierarchy, not the transient data-fetch state. Every page load starts in the `loading` branch before (if access succeeds) flipping to `live`, so the breadcrumb text visibly changes mid-load on every visit; users who lack access see the shorter, inconsistent crumb permanently.
- Design evidence: Internal contradiction in user-facing content within the same task/surface — the same element, on the same route, disagrees with itself between sibling render branches of one component. No external doc needed per the two literal strings in `rsvp-client.tsx` lines 152 and 187.
- Owner: `src/components/rsvp/rsvp-client.tsx` (both `.top-crumb` occurrences); style is `.top-crumb` in `src/app/rsvp/rsvp.css` line 10.
- Scope and affected surfaces: Only `RsvpClient`'s two `.top-crumb` render sites. No other component renders `.top-crumb`.
- Uncertainty: None — this is a literal string diff between two branches of one component with no functional reason to differ.

## Design decision

Make the breadcrumb text identical in both render branches: `DASHBOARD · INVITATIONS · <b>RSVP</b>` (the live branch's fuller, more accurate hierarchy — Dashboard → Invitations → RSVP — since the RSVP page is always reached from a specific invitation in the invitations list, regardless of whether its data has finished loading). This removes the load-state-dependent flicker/inconsistency without touching any behavior.

## Reuse

- Existing class: `.top-crumb` (`src/app/rsvp/rsvp.css` line 10) — no new styles needed, only the text content changes.
- Exemplar: the live branch's own breadcrumb (`src/components/rsvp/rsvp-client.tsx` line 187) is the correct text to copy into the non-live branch.

## Changes

1. `src/components/rsvp/rsvp-client.tsx`
   - Change: In the non-live branch (around line 152), replace `<div className="top-crumb">DASHBOARD · <b>RSVP</b></div>` with `<div className="top-crumb">DASHBOARD · INVITATIONS · <b>RSVP</b></div>` so it matches the live branch exactly.
   - Preserve: All other content of the non-live branch (logo link, `← 대시보드` button, the loading/denied/none messaging) is unchanged.
   - Verify: Viewing `/rsvp?slug=<owned-slug>` shows the identical breadcrumb text throughout the full lifecycle: while `access === "loading"`, if it resolves to `denied`, and once it resolves to `live`.

## Scope

- Inherit: Both render branches of `RsvpClient` (loading/denied/none and live) — this is the only consumer of `.top-crumb`.
- Verify: No other page imports or renders `.top-crumb`; grep confirms it is scoped to `rsvp.css`/`rsvp-client.tsx` only.
- Exclude: The `top-crumb`'s responsive behavior (`display: none` under 900px, `rsvp.css` line 100) is unrelated and untouched.

## Validation

- Product: Load `/rsvp` with no `slug` query param → breadcrumb reads `DASHBOARD · INVITATIONS · RSVP`. Load with a `slug` the signed-in user does not own → same text while `denied`. Load with an owned `slug` → same text once `live`.
- Interface: Desktop viewport only matters here since `.top-crumb` is hidden below 900px (unchanged).
- System: Confirm no other file references the shorter breadcrumb string (`DASHBOARD · <b>RSVP</b>` without `INVITATIONS`) before treating this as complete.
- Repository: `grep -rn "top-crumb" src/` → exactly two JSX occurrences in `rsvp-client.tsx`, both with identical text.

## Stop conditions

- Stop if a product reason surfaces for the non-live state to intentionally omit "INVITATIONS" (none is currently documented; if the executor finds one, keep both branches consistent by editing the *live* branch to match instead, not by leaving them different).

## Design documentation

- None — this is a same-file copy fix, not a new design decision.

---

# Plan 2 — One label for the CSV export action

Written against: abc2c5ced968a9c9e649e125fddb890d98ad2519

## Evidence chain

- Surface: `src/components/rsvp/rsvp-client.tsx`, component `RsvpClient`, live branch
- Problem: The identical action — `onClick={exportCsv}` — is exposed through two buttons with two different labels on the same screen: the top bar button reads `CSV 내보내기` (line 192) and the table-actions button reads `CSV 다운로드` (line 269). `exportCsv` (lines 129–142) is a single function with no parameters that vary by call site; both buttons trigger byte-for-byte the same behavior (it builds a CSV Blob from the currently `filtered` rows and triggers `a.download`). There is no functional difference to justify two different labels for what the user experiences as one action available in two places.
- Design evidence: Internal contradiction in user-facing copy within the same task — the two literal button strings at lines 192 and 269 name the same `onClick={exportCsv}` handler.
- Owner: `src/components/rsvp/rsvp-client.tsx`, both `<Button variant="primary" size="sm" onClick={exportCsv}>` instances.
- Scope and affected surfaces: Only these two buttons; `exportCsv` itself is unchanged.
- Uncertainty: None on the contradiction. The correct unified wording is `CSV 다운로드`, chosen because it names the actual mechanism (`exportCsv` builds an object URL and sets `a.download`, i.e. a browser download, not an "export" to another destination) and is already the wording used at the button closer to the exported table.

## Design decision

Use `CSV 다운로드` for both buttons that call `exportCsv`, so the same action reads identically wherever it appears on the page.

## Reuse

- Existing component: `Button` (`src/components/ui/button.tsx`), `variant="primary" size="sm"` — unchanged, only the child text differs.
- Exemplar: the table-actions button (`src/components/rsvp/rsvp-client.tsx` line 269, `CSV 다운로드`) is the copy to propagate to the top-bar button.

## Changes

1. `src/components/rsvp/rsvp-client.tsx`
   - Change: At line 192, replace the button text `CSV 내보내기` with `CSV 다운로드` so it reads `<Button variant="primary" size="sm" onClick={exportCsv}>CSV 다운로드</Button>`.
   - Preserve: The button's variant, size, position in the top bar, and the `exportCsv` handler itself are unchanged.
   - Verify: Both the top-bar button and the table-actions button now render the exact string `CSV 다운로드`.

## Scope

- Inherit: The live branch's top bar only (the non-live branch has no CSV button).
- Verify: No other surface renders a button bound to `exportCsv` or duplicates this label pair.
- Exclude: The CSV content/format itself (headers, quoting, filename) is unrelated and untouched.

## Validation

- Product: With at least one RSVP row present, both CSV buttons are visible; both read `CSV 다운로드`; clicking either downloads the same file.
- Interface: Desktop and the ≤900px responsive layout (`rsvp.css` lines 98–110) both show the corrected label — no CSS change is needed since only JSX text changes.
- System: Confirm no third occurrence of `CSV 내보내기`/`CSV 다운로드` exists elsewhere that should also be reconciled.
- Repository: `grep -rn "CSV 내보내기\|CSV 다운로드" src/` → both remaining matches read `CSV 다운로드`.

## Stop conditions

- Stop if the two buttons are later given genuinely different behavior (e.g. one exports all rows, the other only the filtered/visible rows) — in that case they should each get a label that reflects the real difference (e.g. `전체 CSV 다운로드` vs `필터링된 CSV 다운로드`) rather than being forced identical.

## Design documentation

- None — this is a copy consistency fix, not a new design decision.

---

# Plan 3 — Fix the "미정" (maybe) badge's mismatched tint color

Written against: abc2c5ced968a9c9e649e125fddb890d98ad2519

## Evidence chain

- Surface: `src/app/rsvp/rsvp.css`, `.badge-tag` variants used by the response table in `src/components/rsvp/rsvp-client.tsx` (line 296: `<span className={\`badge-tag ${r.response}\`}><span className="d" />{RESP_LABEL[r.response]}</span>`)
- Problem: The three `.badge-tag` variants establish a clear local pattern — a low-alpha background tint drawn from the *same* color family as the badge's text color: `.badge-tag.yes { background: rgba(181,202,178,0.2); color: var(--sage-deep); }` (rsvp.css line 84) — `rgba(181,202,178,…)` is exactly `--sage`'s RGB (`#B5CAB2`). `.badge-tag.no { background: rgba(227,139,139,0.15); color: var(--wax-deep); }` (line 85) — `rgba(227,139,139,…)` is the wax family's RGB. But `.badge-tag.maybe { background: rgba(110,122,147,0.2); color: var(--lilac-deep); }` (line 86) breaks the pattern: `rgba(110,122,147,…)` is exactly `--slate`'s RGB (`#6E7A93`, tokens.css line 72) — an unrelated gray-blue "sub text" color per tokens.css's own comment ("Slate — 서브 텍스트/보조 액센트") — while the badge's text stays `--lilac-deep` (a purple). The other two places this same "maybe" semantic color appears on this page — the donut chart segment (rsvp-client.tsx line 239: `stroke="var(--lilac-deep)"`) and its legend swatch (line 249: `background: "var(--lilac-deep)"`) — both use the lilac family, confirming lilac (not slate) is this page's established color for "미정".
- Design evidence: Direct contradiction within the same component family on the same surface — 2 of 3 `.badge-tag` variants pair background and text from one color family; the third pairs a `--lilac-deep` text with a `--slate`-derived background, and the rest of the same page (donut + legend) uses lilac consistently for this exact semantic value.
- Owner: `.badge-tag.maybe` in `src/app/rsvp/rsvp.css`, line 86.
- Scope and affected surfaces: Only this one CSS rule; `.badge-tag.yes`/`.badge-tag.no` are already correct and untouched.
- Uncertainty: None on the hue mismatch. The alpha to use is not independently specified by a token (siblings use 0.2 and 0.15 respectively) — resolved by keeping the rule's current alpha (`0.2`) unchanged and only correcting the RGB triplet, which is the minimal change that fixes the hue mismatch without introducing a new, unreviewed alpha value.

## Design decision

Change `.badge-tag.maybe`'s background from the slate-derived `rgba(110,122,147,0.2)` to the lilac-derived `rgba(213,196,227,0.2)` (`--lilac`'s RGB, `#D5C4E3`, tokens.css line 64), so the badge's background and text come from the same color family — matching the pattern already established by `.badge-tag.yes`/`.badge-tag.no` and matching the lilac color already used for "미정" everywhere else on this page (donut segment, legend swatch, stat card bar/value).

## Reuse

- Existing token: `--lilac` (`src/app/tokens.css` line 64, `#D5C4E3`) — its RGB triplet replaces the incorrect slate RGB already present in the rule; no new token is introduced.
- Exemplar: `.badge-tag.yes` (rsvp.css line 84) is the pattern to match — background RGB equals the un-deepened base token's RGB at low alpha, paired with the `-deep` variant as text color.

## Changes

1. `src/app/rsvp/rsvp.css`
   - Change: Line 86, replace `.badge-tag.maybe { background: rgba(110,122,147,0.2); color: var(--lilac-deep); }` with `.badge-tag.maybe { background: rgba(213,196,227,0.2); color: var(--lilac-deep); }`.
   - Preserve: The `color: var(--lilac-deep)` text color, the shared `.badge-tag` base rule (padding, radius, dot), and both sibling rules (`.yes`, `.no`) are unchanged.
   - Verify: A row with `response === "maybe"` renders its badge with a pale lilac/lavender-tinted background (not a blue-gray one) behind the `--lilac-deep` text and dot.

## Scope

- Inherit: Every row in the RSVP response table whose response is `maybe` (미정) — both mobile (≤900px, no responsive override touches `.badge-tag`) and desktop.
- Verify: `.fc` filter chips and `.stat` cards that also reference sage/wax/lilac are unaffected — they use different rules and are not part of this change.
- Exclude: `.badge-tag.yes` / `.badge-tag.no`, and the alpha value (kept at the rule's existing `0.2`) are out of scope for this change.

## Validation

- Product: With at least one `미정` response present, its table badge shows a lilac-tinted pill matching the hue used in the donut chart's 미정 segment and its legend swatch.
- Interface: Verify at both desktop and the ≤900px breakpoint (table scrolls horizontally there; badge styling itself is unaffected by the breakpoint).
- System: Confirm no other selector depends on the old `rgba(110,122,147,0.2)` value (grep before removing it) so nothing else silently changes.
- Repository: `grep -n "110,122,147" src/app/rsvp/rsvp.css` → no remaining matches after the edit.

## Stop conditions

- Stop if `rgba(110,122,147,…)` turns out to be intentionally reused elsewhere as a deliberate "neutral/pending" visual distinct from the lilac category color — no such usage was found in `rsvp.css` or `rsvp-client.tsx` at audit time, but re-check before applying if the file has changed since the commit above.

## Design documentation

- None — this corrects an existing rule to match an already-established local pattern; it does not introduce a new decision.
