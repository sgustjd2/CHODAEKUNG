# Component Registry

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4. Design system driven by
`src/app/tokens.css` (CSS variables + base classes). Primitives are thin React wrappers over those
classes so fidelity stays with the approved tokens; reuse these before creating new ones.

| Design component | Design source | Code component | Variants/states | Responsive / A11y | Status |
|---|---|---|---|---|---|
| Button | tokens.css `.btn` | `src/components/ui/button.tsx` | primary / wax / ghost / outline · sizes sm·md·lg · `:active` scale, `:hover` | `type="button"` default; native focus | done |
| Logo (lockup) | moi-symbols `#chodaekung-lockup` | `src/components/ui/logo.tsx` | ck-logo (sm/lg/xl via class) | `role="img"` + aria-label | done |
| Seal (wax) | tokens.css `.seal` | `src/components/ui/seal.tsx` | size/font via `style` | decorative | done |
| Icon (sprite) | moi-symbols.svg | `src/components/ui/icon.tsx` | any `#id` via `name` | `aria-hidden` | done |
| Inline 쿵 seal | tokens.css `.seal-kung` | (plain `<span class="seal-kung">`) | rest/hover press | decorative | reused as-is |

## Reused base classes (from tokens.css, not yet wrapped)
`.chip`, `.card`, `.input`, `.input-label`, `.divider`, type classes (`.t-h1`…`.eyebrow`) — wrap into
React primitives when the first screen that needs them is built.

## Pending primitives (create when first needed)
Input/Textarea, Select, Checkbox/Radio/Switch, Tabs/SegmentedControl, Dialog, BottomSheet, Toast,
Card, TemplateCard, ShareDialog, RSVPForm, section renderer registry (viewers).
