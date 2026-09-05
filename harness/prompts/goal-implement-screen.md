# Goal: Implement One Approved Screen/Flow

Implement the requested screen/flow using `prd.md` for functional requirements and the latest approved Genspark output for visual/interaction truth.

Before coding:

- inspect the exact Genspark screen and component references,
- inspect `harness/state/component-registry.md`,
- inspect existing code for reusable components.

Implementation rules:

- no unrequested redesign,
- no generic shadcn styling when an approved design exists,
- shared components before page-specific duplication,
- responsive and accessibility behavior included,
- preserve structured invitation data architecture,
- keep route/page files compositional.

Before completion:

- compare implementation to the design source,
- run available typecheck/lint/tests/build via `harness/scripts/verify.sh`,
- update the component registry and implementation log when needed,
- report any unverified or intentionally deviated item.
