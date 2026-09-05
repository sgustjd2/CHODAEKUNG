# Source of Truth

## Functional truth

`prd.md`

Use it for:

- scope
- user flows
- feature behavior
- invitation section model
- editor/viewer separation
- routes
- data model expectations
- performance/accessibility requirements
- MVP acceptance criteria

## Visual truth

The latest approved files under `design/genspark/`.

Use them for:

- layout
- spacing
- typography
- color
- component appearance
- component variants
- interaction patterns
- responsive intent
- illustration/mascot usage
- empty/loading/error/success states

## Existing code

Existing code is implementation context, not permission to ignore a newer approved design.

Reuse existing components when they can faithfully implement the current design. Refactor them when necessary instead of duplicating near-identical versions.

## Conflict resolution

### PRD says a behavior exists but design omits it
Implement the behavior using the nearest approved design pattern.

### Design shows a behavior that PRD does not mention
If it is purely presentational or a low-risk interaction, implement it consistently. If it changes product scope/data/security, treat it as unresolved and document it.

### Design and PRD directly conflict
Preserve required product behavior, minimize visual deviation, and record the conflict in `harness/state/implementation-log.md`.
