# Shared "common" sections adapt to dark themes (D-Day / 방명록 / 참석자 명단 / 마음 전하기)

Written against: c42c1b0

> **Status: PARTIALLY REJECTED after verification (2a1a928).** The card-darkening proposed below was
> NOT applied: `viewer.css:1033-1035` documents that the white inner cards are deliberate ("inner white
> cards keep their dark --ink"), and the text inside them is dark-on-white = legible. Overriding that
> would invent intent against a documented decision. What WAS fixed: the accent text ON the dark page
> (eyebrows/counts) via `--wax-onpage` (see `dark-theme-accent-contrast.md`), and one genuine gap —
> `.gb-empty` muted text was missing from the dark-theme override, so it was added to viewer.css:1037.
> Remaining below is kept as the record of what was considered and why it was declined.

## Evidence chain

- Surface: the four theme-agnostic sections — `.iv-dday`, `.iv-guestbook`, `.iv-attendees`, and the account block — when they appear on the dark themes `.iv.t-battle` / `.iv.t-gaming` / `.iv.t-developer` (published `/i/[slug]` and the editor preview).
- Problem: these sections were built for light themes and only **partially** retrofitted for dark ones. Their titles and notes are overridden to light text on dark themes, but their card/chip **surfaces and secondary text are hardcoded light values**, so they render as bright white blocks with grey text that break the dark design.
- Design evidence (all in `src/components/viewer/viewer.css`):
  - Retrofit that exists (proves the intent + the gap): `1036` `:is(.iv.t-battle,.iv.t-gaming,.iv.t-developer) :is(.acc-title,.dday-title,.gb-title,.att-title){color:rgba(255,255,255,.92)}` and `1037` the same for `.acc-note,.gb-note,.att-note,.att-empty`. Only titles/notes are handled.
  - Hardcoded light surfaces NOT overridden for dark themes:
    - `158` `.dday-cell{background:#fff;...}`, `160` `.dday-l{color:#888}`
    - `170` `.gb-input,.gb-textarea{background:#fff;color:#1a1a2e}`, `178` `.gb-card{background:#fff}`, `179` `.gb-card-msg{color:#2a2a3e}`, `180` `.gb-card-name{color:#888}`, `177` `.gb-empty{color:#767676}`
    - `190` `.att-chip{background:var(--wax-tint,#f9e9e9);color:var(--wax-deep,#a04547)}` — `--wax-tint` resolves to `#FEF6F4` (near-white) from `src/app/tokens.css:27`
  - Reachability (proves it hits the surface): `src/components/viewer/section-registry.ts:199-209` — `const common = { account, dday, guestbook, attendees }` is spread into **every** theme, so these sections are addable to battle/gaming/developer from the editor's add-section menu.
- Owner: `src/components/viewer/viewer.css` (the common-section blocks at lines ~154-198, plus the existing dark-theme override at 1036-1037).
- Scope and affected surfaces: `.iv.t-battle`, `.iv.t-gaming`, `.iv.t-developer` whenever a D-Day, 방명록, 참석자 명단, or 마음 전하기(account) section is present. Light themes already look correct and are out of scope.
- Uncertainty: intended dark-theme surface treatment — a translucent dark card (`rgba(255,255,255,.06)` on the page) vs. keeping a light card as a deliberate contrast device. Pick one and apply consistently; this needs a visual decision, not new product behavior.

## Design decision

Extend the existing dark-theme override (viewer.css:1036-1037) so the common sections' **surfaces and secondary text** also adapt: card/input/chip backgrounds and muted text get dark-theme values, matching how the dark themes already style their own sections (translucent white on the dark page). This finishes the retrofit at the same place it started, rather than making the components theme-aware individually.

## Reuse

- Exemplar dark surfaces already used by the dark themes in the same file: `.g-section` (gaming) uses `background:#14101E` and borders `rgba(255,255,255,.06)`; battle/gaming tags use `background:rgba(255,255,255,.08)` with `border:1px solid rgba(255,255,255,.15)`. Reuse these exact surface conventions for the common cards/inputs/chips on dark themes.
- Reuse the existing selector group `:is(.iv.t-battle, .iv.t-gaming, .iv.t-developer)` from lines 1036-1037; add rules beside it.
- Muted text on dark: reuse the `rgba(255,255,255,.62)` already established at line 1037 for notes.

No new primitive is required — this is additional theme-scoped CSS next to the existing override.

## Changes

1. `src/components/viewer/viewer.css` (add beside lines 1036-1037, scoped to `:is(.iv.t-battle,.iv.t-gaming,.iv.t-developer)`)
   - Change: override, for dark themes only —
     - `.dday-cell`, `.gb-card`, `.gb-skel` background → translucent-white surface (e.g. `rgba(255,255,255,.06)`) with a `rgba(255,255,255,.12)` border; `.dday-n` uses the dark-safe accent (see note); `.dday-l`, `.gb-card-name`, `.gb-empty` → `rgba(255,255,255,.55)`.
     - `.gb-input`, `.gb-textarea` → dark field (`rgba(255,255,255,.06)` bg, light text, `rgba(255,255,255,.15)` border) so typed text is readable.
     - `.gb-card-msg` → `rgba(255,255,255,.9)`.
     - `.att-chip` → dark chip (`rgba(255,255,255,.08)` bg, light text) instead of the near-white `--wax-tint`.
   - Preserve: light themes unchanged; layout, spacing, radii, and the section structure untouched.
   - Verify: on a battle invitation with D-Day + 방명록 + 참석자 명단 sections, cards/inputs/chips sit on the dark page as dark surfaces with readable light text; no white blocks.

## Scope

- Inherit: published `/i/[slug]`, full preview, editor preview for battle/gaming/developer.
- Verify: the accent-colored eyebrows/`.dday-n`/`.att-count` on these cards — their color comes from `--wax-deep`; if the sibling plan `dark-theme-accent-contrast.md` is applied, they are already dark-safe. If only this plan ships, ensure the chosen surface keeps `--wax-deep` legible.
- Exclude: light themes; the accent-derivation root cause (covered by `dark-theme-accent-contrast.md`).

## Validation

- Product: on a dark-theme invitation, add D-Day, 방명록, 참석자 명단, 마음 전하기; publish; the sections match the dark aesthetic and all text is readable.
- Interface: battle/gaming/developer × {empty guestbook (skeleton + empty state), 1-2 messages, attendee chips present/empty, D-day future/past}; mobile 390px and desktop.
- System: confirm the change is additional CSS under the existing `:is(.iv.t-battle,.iv.t-gaming,.iv.t-developer)` group — no new component and no per-theme duplication of the section markup.
- Repository: `npx tsc --noEmit` → passes (CSS-only, but run to confirm nothing else regressed).

## Stop conditions

- Stop if product wants the common sections to keep light cards on dark themes as an intentional contrast device (then only the muted-text/chip legibility needs fixing, not the card backgrounds).

## Design documentation

- After acceptance: note in `CLAUDE.md` (or DESIGN.md) that theme-agnostic shared sections must ship dark-theme surface overrides alongside the light defaults, referencing the `:is(.iv.t-battle,.iv.t-gaming,.iv.t-developer)` pattern.
