# Frontend Architecture Rules

## Recommended layers

```text
src/
├─ app/                       # routes
├─ components/
│  ├─ ui/                     # primitives
│  ├─ shared/                 # cross-feature components
│  ├─ editor/                 # editor feature components
│  ├─ invitation/             # viewer/section components
│  ├─ templates/              # template compositions/presets
│  └─ dashboard/
├─ features/
├─ lib/
├─ hooks/
├─ types/
├─ styles/
└─ config/
```

Adapt to the repository rather than forcing this structure onto an established codebase.

## Data/rendering boundary

Published invitations should be derived from structured invitation data, not hand-authored page HTML.

Keep these concepts explicit:

- content data
- section type
- theme tokens
- layout settings
- animation settings
- renderer

## Client boundary

Use client-side code only where interactions require it. Keep public invitation rendering lightweight.

## Theme boundary

Do not let user-selected invitation themes accidentally restyle the authoring dashboard/editor shell.
