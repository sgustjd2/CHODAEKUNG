# CHODAE KUNG Harness

This folder is the execution harness for implementing CHODAE KUNG from `prd.md` and Genspark design artifacts.

It is designed to be copied directly into a repository root next to `CLAUDE.md`.

## Expected root structure

```text
repo/
├─ CLAUDE.md
├─ prd.md
├─ harness/
├─ design/
│  └─ genspark/
└─ application source...
```

## What this harness does

- defines source-of-truth precedence
- prevents unrequested redesign
- requires reuse of approved Genspark components
- keeps a design-to-code component registry
- provides implementation and review workflows
- adds repeatable preflight and verification scripts
- records design assumptions and implementation deviations

## First run

```bash
bash harness/scripts/preflight.sh
```

Then read:

1. `harness/context/SOURCE_OF_TRUTH.md`
2. `harness/workflows/01-bootstrap.md`
3. `harness/workflows/02-implement-screen.md`

Create/update:

- `harness/state/design-source-map.md`
- `harness/state/component-registry.md`
- `harness/state/implementation-log.md`

## Design export placement

Put Genspark outputs under `design/genspark/` when possible.

Recommended folders:

```text
design/genspark/
├─ screens/
├─ components/
├─ tokens/
├─ icons/
├─ assets/
└─ notes/
```

The harness does not require a particular export format. PNG, JPG, SVG, PDF, Markdown, JSON, HTML, or exported code may all be referenced.
