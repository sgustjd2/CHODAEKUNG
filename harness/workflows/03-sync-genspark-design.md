# Workflow 03 — Sync New Genspark Output

Use whenever new or revised Genspark designs are added.

## Steps

1. Identify newly added/changed design files.
2. Determine whether they supersede an earlier approved reference.
3. Update `harness/state/design-source-map.md`.
4. Compare changed components against `component-registry.md`.
5. Classify changes:
   - token-only
   - component variant
   - component breaking change
   - screen composition change
   - interaction change
   - new asset
6. Update shared components/tokens before editing individual screens.
7. Re-check all screens affected by the changed shared component.
8. Record meaningful migration notes in `implementation-log.md`.

## Important

Do not patch each page independently when the Genspark change is clearly a shared component/token update.
