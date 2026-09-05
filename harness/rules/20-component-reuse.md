# Component Reuse Rules

## Rule 1: Search before create

Before creating a component, search the repository and `harness/state/component-registry.md`.

## Rule 2: One design concept, one reusable implementation

Avoid parallel components such as:

- `PrimaryButton`
- `MainButton`
- `ActionButton`

when variants of a single `Button` solve the problem.

## Rule 3: Variant-driven APIs

Prefer explicit variants and states over copied markup.

## Rule 4: Page files compose

Pages/routes should primarily compose feature and shared components. Keep large presentational markup out of route files when it is reusable.

## Rule 5: Invitation sections are registered

Each invitation section type should map through a shared renderer/registry architecture.

## Rule 6: Do not over-abstract

Do not create abstractions solely because two pieces of markup share three lines. Reuse should represent a meaningful UI/product concept.
