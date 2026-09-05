# Quality Gates

A meaningful UI task must pass these gates before completion.

## Functional
- PRD behavior is implemented.
- Critical actions work.
- Error and loading paths are sensible.

## Visual
- Correct Genspark reference was inspected.
- Layout/hierarchy matches.
- Tokens/component variants match.
- No unrequested redesign was introduced.

## Component
- Existing components were searched first.
- New shared components are registered.
- Duplicate patterns were not introduced.

## Responsive
- Primary mobile width checked.
- Desktop/tablet behavior checked when relevant.
- Text wrapping and overflow checked.
- Touch targets checked.

## Accessibility
- Keyboard/focus checked.
- Labels and semantics checked.
- Dialog/drawer behavior checked.
- Reduced motion checked when animation exists.

## Engineering
- Typecheck
- Lint
- Relevant tests
- Build when available/reasonable
