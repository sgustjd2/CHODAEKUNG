# Workflow 02 — Implement a Screen or Flow

## 1. Gather references

Identify:

- PRD section(s)
- exact Genspark screen(s)
- applicable component specs
- existing code components

## 2. Build a screen map

Before coding, determine:

- route
- major regions
- component composition
- data dependencies
- states
- interactions
- responsive changes

## 3. Reuse first

Consult `harness/state/component-registry.md`.

Extend an existing component when the design concept is the same. Create a new component only for a genuinely distinct concept.

## 4. Implement

Order:

1. missing tokens/primitives
2. shared components
3. feature components
4. page composition
5. states
6. responsive behavior
7. motion

## 5. Verify

Use `harness/checklists/screen-done.md` and run:

```bash
bash harness/scripts/verify.sh
```

## 6. Record

Update component registry and implementation log.
