# Design Source Map

Actual approved design lives in `design/` (flat Genspark hi-fi HTML export), not `design/genspark/`.
Handoff notes: `design/README.md`. Bundle archive: `design_handoff_chodaekung.zip` (source zip, untracked).

## Global

| Area | Current approved source | Notes |
|---|---|---|
| Design tokens | `design/assets/tokens.css` | Single source of truth. Bundled copy at `src/app/tokens.css` (font @imports moved to `globals.css`). |
| Component base classes | `design/assets/tokens.css` | `.btn`/`.chip`/`.card`/`.input`/`.seal`/`.seal-kung`/`.ck-logo` |
| Icons + mascot sprite | `design/assets/moi-symbols.svg` | Served at `public/assets/moi-symbols.svg`, used via `<use href="/assets/moi-symbols.svg#id">` |
| Photos (placeholders) | `design/assets/photos/*.jpg` | Served at `public/assets/photos/` |
| Brand system board | `design/01_brand_system.html` | Reference only (not a product screen) |

## Screens

| Product area | Current approved source | Status |
|---|---|---|
| Landing | `design/02_landing.html` | ✅ implemented (`src/app/page.tsx` + `landing.css`) |
| Template Gallery | `design/03_template_gallery.html` | ✅ implemented (`src/app/templates/`) |
| Dashboard | `design/04_dashboard.html` | pending |
| New Invitation Wizard | `design/05_new_invitation_wizard.html` | ✅ implemented (`src/app/new/`) |
| Desktop Editor | `design/06_editor_desktop.html` | pending |
| Mobile Editor | `design/07_editor_mobile.html` | pending |
| Publish/Share | `design/08_publish_share.html` | pending |
| RSVP Dashboard | `design/09_rsvp_dashboard.html` | pending |
| Viewer — Romantic | `design/10_viewer_romantic.html` | ✅ implemented (`/i/[slug]` + section registry) |
| Viewer — Minimal | `design/11_viewer_minimal.html` | ✅ implemented (`/i/appa-60`) |
| Viewer — Cute | `design/12_viewer_cute.html` | pending |
| Viewer — Editorial | `design/13_viewer_editorial.html` | pending |
| Viewer — Developer/Terminal | `design/14_viewer_developer.html` | pending |
| Viewer — Sports Battle | `design/15_viewer_battle.html` | ✅ implemented (`/i/jogi-battle`) |
| Viewer — Timeline (집들이/번개/MT) | `design/16_viewer_timeline.html` | pending |
| Viewer — Gaming (롤 파티) | `design/17_viewer_gaming.html` | pending |
