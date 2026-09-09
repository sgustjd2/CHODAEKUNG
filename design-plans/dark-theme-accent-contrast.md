# Custom accent stays legible on dark themes (battle / gaming / developer)

Written against: c42c1b0

## Evidence chain

- Surface: the invitation viewer/editor preview for the dark themes — `/i/[slug]` and the editor center preview — when the invitation carries a user-selected `accent`. Concretely `.iv.t-battle`, `.iv.t-gaming`, `.iv.t-developer`.
- Problem: A creator can pick any of the 12 accent swatches on any theme (`src/components/editor/editor-shared.ts:88` `ACCENTS`). On the dark themes the chosen accent is turned into accent-colored **text** via `--wax-deep`, but `--wax-deep` is derived for legibility against a **white** page, so a dark or mid-tone accent renders accent text at far below readable contrast on the dark background.
- Design evidence:
  - `src/app/tokens.css:24` — the default `--wax-deep` is documented as deliberately "left lighter so it stays legible on dark themes too". This is the binding contract: accent-deep text must stay legible on dark themes.
  - `src/lib/invitation/contrast.ts:37-48` — `waxDeep()` darkens the accent "toward black until it clears ~4:1 vs white" (its docstring says "legible on the **light** page"). It never considers a dark background.
  - `src/components/viewer/invitation-viewer.tsx:74-80` — when `invitation.accent` is set, it writes `--wax = accent`, `--wax-deep = waxDeep(accent)`, `--wax-ink = waxInk(accent)` on the invitation root for **every** theme, overriding the dark-safe default from tokens.css.
  - Consumers on dark themes read `--wax-deep` for accent text: `viewer.css` `.dday-eb`/`.gb-eb`/`.att-eb`/`.att-count`/`.dday-n` (155,165,184,187,159) plus the battle/gaming accent-text elements.
  - Deterministic consequence (worst case, palette value `#2A2A3E` on battle `--iv-bg #1A1A2E`): `waxDeep("#2A2A3E")` returns `#2A2A3E` unchanged (already clears 4:1 vs white), giving a contrast ratio of ≈ **1.2:1** on the dark page. WCAG AA needs 4.5:1 for body text. Mid-tone accents (`#A0A8B8`, `#8AB2C6`) land similarly low. The default (no custom accent) is unaffected because tokens.css keeps `--wax-deep` light.
- Owner: `src/components/viewer/invitation-viewer.tsx` (the CSS-var derivation block, lines 72-92) + `src/lib/invitation/contrast.ts`.
- Scope and affected surfaces: `.iv.t-battle`, `.iv.t-gaming`, `.iv.t-developer` on the published page, the full-preview page, and the editor's contained preview (all render through `InvitationViewer`). Light themes are out of scope (their page is light; deriving against white is correct).
- Uncertainty: whether to also lighten `--wax` itself (accent used as button background). `waxInk()` already picks legible text on the button, so a dark accent button keeps legible label text but can blend into the dark page. Validate whether the button also needs a min-contrast-vs-background guard, or whether that is acceptable.

## Design decision

Derive `--wax-deep` (and, if validated, the accent's on-page presence) against **the theme's actual background**, not always against white. On the dark themes, `waxDeep()` must move the accent *lighter* until it clears the contrast target against the dark background, mirroring how the default `--wax-deep` in tokens.css is intentionally light. This resolves the root cause (a light-page-only assumption applied to dark pages) rather than patching each consumer.

## Reuse

- `src/lib/invitation/contrast.ts` — reuse `lum()` and the existing 4:1 loop; add a background-aware variant rather than a second color system.
- Theme background values already defined in `src/components/viewer/viewer.css`: battle `--iv-bg #1A1A2E` (also page `#0F0F1C`), gaming `#14101E` (`#0B0813`), developer `#0D0F0A`.
- Exemplar of theme-aware branching already in the codebase: `src/components/viewer/viewer.css:1036-1037` (dark themes override common-section title/note colors) — same set of themes, same intent.

If a new helper is required (e.g. `accentInkOn(accentHex, bgHex)`), it belongs in `contrast.ts` beside `waxDeep`/`waxInk`; its only consumer is `invitation-viewer.tsx`.

## Changes

1. `src/lib/invitation/contrast.ts`
   - Change: add a background-aware derivation — given the accent and a background hex, return an accent shade that clears ~4:1 against **that background** (darken on light backgrounds, lighten on dark ones). Keep `waxDeep`/`waxInk` for existing callers.
   - Preserve: current `waxDeep`/`waxInk` behavior for light themes and for the accent-on-button text.
   - Verify: unit-level — `accentInkOn("#2A2A3E", "#1A1A2E")` yields a color with computed contrast ≥ 4:1 against `#1A1A2E`.

2. `src/components/viewer/invitation-viewer.tsx` (lines ~72-92)
   - Change: determine whether the invitation's theme is dark (`battle`/`gaming`/`developer`) and, when an accent is set, compute `--wax-deep` (and `--wax-ink` as needed) against that theme's base background instead of white.
   - Preserve: light themes keep the current white-page derivation; the default (no `accent`) path still falls through to tokens.css.
   - Verify: on a dark theme with accent `#2A2A3E`, the rendered `--wax-deep` is a light shade and accent eyebrows/D-day numbers read clearly on the dark page.

## Scope

- Inherit: published `/i/[slug]`, full preview, editor contained preview — all consume `InvitationViewer`.
- Verify: the battle/gaming own accent-text elements (cover eyebrow, `.g-sec-eb`, accept/ending) in addition to the common `.dday-*/.gb-*/.att-*` eyebrows.
- Exclude: light themes (romantic/cute/editorial/minimal/timeline); the separate common-section surface-color issue (its own plan: `common-sections-dark-theme.md`).

## Validation

- Product: create/edit a battle (or gaming/developer) invitation, pick a dark/mid accent (`#2A2A3E`, `#A0A8B8`); accent eyebrows, D-day digits, and section labels remain readable.
- Interface: dark themes × {default accent, light accent `#F5D896`, dark accent `#2A2A3E`, mid accent `#8AB2C6`}; check cover eyebrow, `.dday-eb`/`.dday-n`, accept/ending; also re-check one light theme is unchanged.
- System: confirm the fix lives in `contrast.ts` + `invitation-viewer.tsx` only, with no parallel per-section overrides added.
- Repository: `npx tsc --noEmit` → passes.

## Stop conditions

- Stop if a dark theme is found to already override `--wax-deep` in its own CSS (then the owner is the theme block, not the viewer), or if product decides custom accents should be disabled on dark themes instead (that changes the owner to the editor Style tab).

## Design documentation

- After acceptance: record in `CLAUDE.md` §9/§10 (or a new DESIGN.md) that accent-derived text colors must be computed against the theme's background, and that `--wax-deep` is dark-safe by contract.
