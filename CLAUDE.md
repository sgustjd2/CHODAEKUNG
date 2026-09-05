# CLAUDE.md — CHODAE KUNG Implementation Constitution

## 0. Mission

You are implementing **CHODAE KUNG (초대쿵)**, a mobile-first interactive invitation builder.
Your job is to turn the approved product requirements and Genspark design outputs into production-quality code **without redesigning the product on your own**.

The product must let non-designers create beautiful invitations for weddings, birthdays, housewarmings, parties, baby events, communities, seminars, and company events, as well as small-group meetups (running, badminton, hiking, study groups, baseball outings, flash/regular meetups, overnight trips/MT with shared itineraries) and fun competitive "versus battle" invites (class-vs-class or club matches, early-morning soccer battle requests), then publish and share them by URL/KakaoTalk. Invitations are built from mix-and-match content modules (timeline/rundown, menu, trip itinerary, versus matchup, attendee roster) so each occasion shows only what it needs.

Core product principle:

> Make it easy to create, beautiful to view, and effortless to share.

---

## 1. Source of Truth Order

When requirements or visuals appear to conflict, use this precedence:

1. **Latest explicit user instruction**
2. **Latest approved Genspark design output / component specification**
3. **`prd.md`**
4. **Existing project code and established design tokens/components**
5. **`harness/` rules and workflow guidance**
6. Your own assumptions

### Non-negotiable interpretation rules

- `prd.md` is the functional/product source of truth.
- Genspark outputs are the **visual and interaction source of truth**.
- Do not invent a new visual language when Genspark already defines one.
- Do not replace a Genspark component with a generic shadcn/ui look just because it is faster.
- shadcn/ui may be used as implementation infrastructure, but its styling must be adapted to the approved design.
- If a Genspark design conflicts with a required product behavior, preserve the required behavior and document the discrepancy before changing visual intent.
- If a screen is missing from Genspark but required by the PRD, derive it from the nearest approved screen and existing component system. Do not introduce an unrelated style.

---

## 2. Expected Project Inputs

The repository should contain or eventually contain:

```text
/
├─ CLAUDE.md
├─ prd.md
├─ harness/
├─ design/
│  └─ genspark/
│     ├─ screens/              # PNG/JPG/PDF screenshots or exports
│     ├─ components/           # component specs, screenshots, SVGs, notes
│     ├─ tokens/               # colors, typography, spacing, radius, shadows
│     ├─ icons/                # exported icons/SVG
│     ├─ assets/               # mascot, illustrations, photos, app icon
│     └─ notes/                # Genspark interaction/responsive notes
└─ src/ or app/                # application code
```

If the Genspark export has a different folder structure, do not force-rename it. Record the actual locations in:

`harness/state/design-source-map.md`

---

## 3. Before Writing Code

For every new session involving implementation:

1. Read `CLAUDE.md`.
2. Read `prd.md` sections relevant to the requested work.
3. Read `harness/context/SOURCE_OF_TRUTH.md`.
4. Read all relevant files under `design/genspark/`.
5. Read `harness/state/component-registry.md` if it exists.
6. Inspect existing code for reusable components, tokens, patterns, and tests.
7. Run `bash harness/scripts/preflight.sh` when shell access is available.

Do **not** begin a screen implementation from memory if design references exist.

---

## 4. Design Fidelity Contract

### 4.1 No unauthorized redesign

Do not:

- change information hierarchy without requirement
- change approved copy for stylistic reasons
- add decorative gradients, shadows, pills, glassmorphism, or cards unless supported by the design
- use generic dashboard aesthetics that conflict with the Genspark direction
- add icons where the design uses text-only controls
- remove whitespace simply to fit more content
- normalize distinctive typography into defaults
- alter illustration/mascot usage without reason

### 4.2 Match the design at component level

When a design defines a component, implement it as a reusable component with:

- all visible variants
- interactive states
- disabled/loading/error/success states where applicable
- responsive behavior
- keyboard/focus states
- accessibility labels where required

### 4.3 Typography

- Preserve Korean typography quality.
- Avoid arbitrary font substitution.
- Limit invitation viewer webfont families loaded at once for performance.
- Use tokenized font family, size, weight, line-height, and letter-spacing.

### 4.4 Motion

Invitation viewer motion may be emotional; editor motion must remain functional.

Supported product-level motion should follow the PRD and Genspark design, such as:

- None
- Fade
- Fade Up
- Slide
- Zoom
- Blur Reveal
- Scale Reveal
- Parallax

Respect `prefers-reduced-motion`.

---

## 5. Component-First Implementation

Never build multiple screens by copying page-specific markup when the same UI pattern can be shared.

Preferred hierarchy:

```text
Design Tokens
  ↓
Primitives
  ↓
Shared Components
  ↓
Feature Components
  ↓
Screen Composition
  ↓
Invitation Template Composition
```

### Required reusable component families

At minimum, expect reusable implementations for:

- Button / IconButton
- Input / Textarea
- Select / Combobox
- Checkbox / Radio / Switch
- Tabs / SegmentedControl
- Dialog / Modal
- Drawer / BottomSheet
- Toast / InlineAlert
- Tooltip
- Card / Surface
- EmptyState
- Skeleton / LoadingState
- UploadDropzone / UploadProgress
- ImagePicker / ImageCropper shell
- FontPicker
- ColorPicker
- SectionCard
- SectionNavigator
- PropertyInspector
- PreviewDevice
- SaveStatus
- TemplateCard
- InvitationCard
- ShareDialog
- PublishDialog
- RSVPForm
- RSVPResponseTable/List
- GalleryGrid / GalleryCarousel
- LocationBlock
- DateTimeBlock
- ScheduleTimeline

Do not create all of these upfront if unused. Create them when first needed and make them reusable immediately.

---

## 6. Genspark Component Registry

Before implementing more than one production screen, maintain:

`harness/state/component-registry.md`

For every approved design component, record:

- Genspark/design name
- screenshot/spec source
- code component path
- variants
- states
- responsive behavior
- accessibility requirements
- implementation status

Example:

```markdown
| Design component | Source | Code component | Variants | Status |
|---|---|---|---|---|
| Primary Button | design/genspark/components/buttons.png | src/components/ui/button.tsx | primary, secondary, ghost | done |
```

A matching existing code component must be reused before creating another one.

---

## 7. Product Architecture Rules

### 7.1 Invitation data is structured data

Do not store the invitation as arbitrary authored HTML.

The core should follow a structured model centered on:

- `sections[]`
- theme tokens
- style configuration
- layout configuration
- animation configuration
- content payloads

The same invitation data must support multiple renderer/view modes without rewriting content.

### 7.2 Editor and Viewer separation

Treat these as distinct concerns:

- **Editor**: authoring experience, selection, configuration, reorder, preview
- **Viewer**: published/mobile experience, fast rendering, animation, sharing, RSVP

Do not couple editor controls directly into public viewer components.

### 7.3 Invitation section renderer

Use a registry/factory-style section renderer so a section type maps to one implementation rather than large conditional pages.

Conceptually:

```text
section.type
  -> section registry
  -> section renderer
  -> theme tokens
  -> layout/animation config
```

### 7.4 Responsive strategy

- Mobile invitation viewing is the primary experience.
- Desktop editor may use the approved 3-column layout.
- Mobile editor must use the approved compact navigation/bottom-sheet model instead of shrinking the desktop inspector.

---

## 8. Recommended Technical Baseline

Unless the repository already establishes another approved stack, follow the PRD recommendation:

- Next.js App Router
- TypeScript with strict typing
- Tailwind CSS
- shadcn/ui only as an implementation base when appropriate
- Server Components by default where useful
- Client Components only where interactivity requires them
- Route Handlers / Server Actions as appropriate

Do not add major dependencies without checking whether the repository already solves the need.

---

## 9. Styling Rules

- Centralize design tokens.
- Do not scatter raw hex values and unexplained spacing values across feature files.
- Prefer semantic tokens such as `bg-surface`, `text-primary`, `radius-card` over one-off values when the design system supports them.
- Preserve Genspark spacing and proportion before trying to “clean up” values.
- Use CSS variables for themeable invitation styles.
- Keep editor product UI tokens separate from user-selected invitation theme tokens where necessary.

---

## 10. Accessibility and Interaction

Every implementation must consider:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- form labels and validation messages
- alt text strategy for meaningful images
- touch target sizing
- reduced motion
- dialog focus management
- screen-reader-friendly status feedback for save/upload/publish operations

Do not sacrifice accessibility to mimic a visual screenshot.

---

## 11. Performance Rules

The public invitation page is share-driven and must load quickly, including inside mobile in-app browsers.

Prioritize:

- optimized images
- responsive image sizing
- lazy loading below-the-fold assets
- minimal client JavaScript
- limited font payload
- animation bundle discipline
- no editor-only code in public viewer bundles when avoidable
- stable layout to minimize CLS

---

## 12. Screen Implementation Workflow

For each screen or flow:

### A. Understand
- Identify the PRD requirement.
- Identify exact Genspark reference(s).
- Identify reusable existing components.

### B. Map
- List screen regions.
- Map each region to existing/new components.
- Identify states and breakpoints.

### C. Implement
- Add or extend shared components first.
- Compose the screen from components.
- Keep page files thin.

### D. Verify
- Compare against the Genspark reference.
- Test mobile and desktop as applicable.
- Test empty/loading/error states.
- Run typecheck/lint/tests/build scripts available in the repo.
- Run `bash harness/scripts/verify.sh`.

### E. Record
- Update `harness/state/component-registry.md`.
- Update `harness/state/implementation-log.md` for meaningful decisions or deviations.

---

## 13. Quality Gates

A task is not complete just because it renders.

Before claiming completion, confirm:

- [ ] Requested PRD behavior exists
- [ ] Correct Genspark source was used
- [ ] No unauthorized redesign occurred
- [ ] Shared components were reused
- [ ] No obvious duplicate component was introduced
- [ ] Responsive behavior works
- [ ] Loading/empty/error states are handled where relevant
- [ ] Keyboard/focus behavior works
- [ ] Reduced-motion behavior is respected where relevant
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Relevant tests pass
- [ ] Production build passes when reasonable
- [ ] Component registry was updated

If any item cannot be verified, state it explicitly instead of marking the task complete.

---

## 14. What You Must Not Do

- Do not rewrite the entire codebase for a localized task.
- Do not replace approved design with your preferred visual system.
- Do not create duplicate primitives with slightly different names.
- Do not hardcode invitation content into templates.
- Do not store editor output as uncontrolled raw HTML.
- Do not use desktop-only interactions for mobile authoring.
- Do not expose secrets in client code.
- Do not bypass existing auth/data boundaries just to make a demo work.
- Do not silently drop a PRD requirement because a mockup omitted it.
- Do not claim pixel fidelity without comparing against the available visual source.

---

## 15. When Design Information Is Missing

Do not stop work for minor gaps.

Use this fallback order:

1. Same component in another Genspark screen
2. Same pattern in the approved design system
3. Neighboring screen/layout pattern
4. Existing codebase component
5. PRD intent + minimal neutral implementation

Record meaningful assumptions in `harness/state/implementation-log.md`.

For major missing decisions that would change the product direction, do not invent a new direction. Surface the gap.

---

## 16. Definition of Done

A feature is done when it is:

- functionally aligned with `prd.md`
- visually aligned with Genspark output
- built from reusable components
- responsive
- accessible
- performant enough for mobile invitation viewing
- validated by repository checks
- documented in the harness state when it introduces or changes shared design/component behavior

