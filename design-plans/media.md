> **RESOLUTION 2026-09-09 — APPLIED, but with a CORRECTED fix (do not follow this plan's "Changes" verbatim).**
> The diagnosis (PhotoUpload's `.insp-add`/`.insp-photos`/`.insp-photo` render unstyled on `/media`) is correct.
> The plan's remedy (de-nest the rules inside `editor.css`) is WRONG: `editor.css` is imported only in
> `src/app/editor/page.tsx`, so it never loads on `/media` — de-nesting there fixes nothing on `/media`.
> Actual fix shipped: the six rules were MOVED (verbatim, un-nested) from `editor.css` into `globals.css`
> (imported in the root layout → loaded on every route), and removed from `editor.css` to keep a single
> definition. Editor + /media both styled, no duplication. See `harness/state/implementation-log.md`.

# PhotoUpload renders unstyled on the media library page

Written against: abc2c5c

## Evidence chain

- Surface: `/media` — `src/app/media/page.tsx` renders `MediaClient` (`src/components/media/media-client.tsx`), which composes the "사진 업로드" control from the shared `PhotoUpload` component (`src/components/editor/content-editors.tsx:596-673`) inside `.med-upload`.
- Problem: On `/media`, the upload label ("+ 사진 업로드"), the "라이브러리에서 선택" toggle button, and the library thumbnail grid it expands into render with none of their intended box styling — no dashed border, no background, no padding, no hover state. They appear as bare inline text next to the page's otherwise fully-styled header (`.med-title`, `.med-sub`) and photo grid (`.med-item`, using `.card`-style borders/radius).
- Design evidence: `src/app/editor/editor.css` defines the classes `PhotoUpload` renders (`insp-add`, `insp-add:hover`, `insp-photos`, `insp-photo`, `insp-photo img`, `insp-photo button`) only nested inside two separate `.editor-page { … }` blocks (lines 385-391 and 403-408). The file's own header comment states the intent explicitly: "Desktop editor — ported from design/06_editor_desktop.html `<style>`, **scoped under `.editor-page`**." Nesting compiles to descendant selectors, e.g. `.editor-page .insp-add`, `.editor-page .insp-photo`. These three classes are not defined anywhere else in the repo (verified: only `content-editors.tsx` and `editor.css` reference `insp-add`/`insp-photo`).
- Owner/Runtime: `PhotoUpload`'s two other call sites both render inside an `.editor-page` ancestor — `src/components/editor/editor-client.tsx:501` opens `<div className="editor-page">` and mounts `MobileEditor` (line 1021) inside it, and `MobileEditor` (`src/components/editor/mobile-editor.tsx:375`) also calls `PhotoUpload` there — so those two consumers correctly receive the dashed-box "add" styling. `MediaClient`'s root element is `<div className="media">` (`media-client.tsx:50`), styled by `src/app/media/media.css`, which has no `.editor-page` ancestor anywhere in its tree and does not import `editor.css`. The `.editor-page .insp-add` selector therefore never matches on `/media`, regardless of whether `editor.css` even loads on that route — this is a static, deterministic selector mismatch, not a load-order issue.
- Scope and affected surfaces: `/media` only. The desktop editor (`editor-client.tsx`) and mobile editor (`mobile-editor.tsx`) already render `PhotoUpload` correctly and must keep doing so.
- Uncertainty: none. The fix is a scope change to existing, already-approved declarations — no new visual design is introduced.

## Design decision

Un-scope the `PhotoUpload`-only rule blocks (`.insp-add`, `.insp-add:hover`, `.insp-photos`, `.insp-photo`, `.insp-photo img`, `.insp-photo button`) from the `.editor-page` nesting in `editor.css` so the shared component carries its designed appearance wherever it is reused, matching how `PhotoUpload` is actually consumed (exported from `content-editors.tsx` and imported into a non-editor page). Do not touch the many other `.insp-add`-styled "add item" buttons' surrounding rules (`.insp-subitem`, `.m-subitem`, etc.) — those editors (schedule/timeline/rules/accounts/…) are only ever rendered inside the inspector panel and should stay exactly as scoped.

## Reuse

- Existing declarations only — `src/app/editor/editor.css:385-391` (`.insp-add`, `.insp-add:hover`) and `:403-408` (`.insp-photos`, `.insp-photo`, `.insp-photo img`, `.insp-photo button`).
- Exemplar of the target (unscoped, globally-available) pattern in the same file: top-level rules like `.seal`/`.ck-logo`/`.chip` in `src/app/globals.css`, or any `editor.css` rule declared outside an `.editor-page {}` wrapper.
- No new primitive, token, or class name is introduced.

## Changes

1. `src/app/editor/editor.css`
   - Change: move `.insp-add { … }` and `.insp-add:hover { … }` (currently lines 389-390, inside the `.editor-page { }` block opened at line 385) out to top-level, unscoped rules. Move `.insp-photos { … }`, `.insp-photo { … }`, `.insp-photo img { … }`, `.insp-photo button { … }` (currently lines 404-407, inside the `.editor-page { }` block opened at line 403) out to top-level, unscoped rules the same way. Leave `.insp-subitem`/`.insp-subitem-head` (lines 386-388) and the `.m-subitem`/`.m-add` block (lines 394-399) nested under `.editor-page` exactly as they are.
   - Preserve: visual appearance and behavior inside the desktop/mobile editor must be pixel-identical after the move (same declarations, just wider selector scope); every other `.editor-page`-nested rule stays untouched.
   - Verify: with the change applied, `.insp-add`/`.insp-photos`/`.insp-photo` selectors match on any page, not only descendants of `.editor-page`.

## Scope

- Inherit: `/media` (`MediaClient` → `PhotoUpload`) starts rendering the dashed-border "+ 사진 업로드" / "라이브러리에서 선택" buttons and the 3-column library thumbnail grid with their intended styling.
- Verify: desktop editor (`/editor`, `editor-client.tsx`) and mobile editor (`mobile-editor.tsx`) still render `PhotoUpload` (cover photo upload) and every other `insp-add`/`insp-subitem`/`m-*` inspector control unchanged, since those rules are untouched or only widened, never removed.
- Exclude: any other visual difference between `/media` and the editor inspector (e.g., `.med-upload { min-width: 160px }` sizing, page-level layout) — out of scope, not evidenced as broken.

## Validation

- Product: open `/media` while logged in; the "+ 사진 업로드" control and "라이브러리에서 선택" toggle show the dashed-border box styling (background `var(--paper-2)`, border `var(--line-strong)`, hover → `var(--wax)` border / `var(--wax-deep)` text) instead of bare text.
- Interface: `/media` empty state (upload control visible before any items exist) and non-empty state; `/editor` cover-photo upload and gallery-section photo upload (desktop 3-column and mobile bottom-sheet) unchanged.
- System: confirm no second `.insp-add`/`.insp-photo` definition was added elsewhere — the fix widens the one existing declaration's scope rather than duplicating it.
- Repository: `npm run lint` → passes (no new selectors, no syntax errors from de-nesting).

## Stop conditions

- Stop if de-nesting reveals `.insp-add`/`.insp-photo`/`.insp-photos` collides with an unrelated class name elsewhere once unscoped (grep confirmed no collision as of this writing — re-check at implementation time in case new code was added).

## Design documentation

- None. This is a scope correction to an existing, already-documented rule (the file's own "scoped under .editor-page" comment), not a new design decision.
