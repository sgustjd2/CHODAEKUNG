# Workflow 01 — Bootstrap

Use this when the repository is first prepared for implementation.

## Steps

1. Read `CLAUDE.md` and `prd.md`.
2. Run `bash harness/scripts/preflight.sh`.
3. Inventory Genspark exports.
4. Fill `harness/state/design-source-map.md`.
5. Inspect existing design-system code.
6. Start `harness/state/component-registry.md` using actual design components.
7. Confirm current framework/package manager.
8. Identify existing lint/typecheck/test/build commands.
9. Do not scaffold duplicate infrastructure if the repository already contains it.

## Output

A bootstrap pass should leave the repository with a clear answer to:

- Where is the PRD?
- Where are visual references?
- What design components already exist?
- What code components already exist?
- What commands verify correctness?
