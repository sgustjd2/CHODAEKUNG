# E2E (mobile) tests

Playwright smoke tests for the mobile-first flow, run on a real Chromium at an iPhone 13 device
profile (mobile viewport + touch) — the primary 초대쿵 experience.

## Run

```bash
npx playwright install chromium   # once, downloads the browser
npm run test:e2e                  # runs tests/e2e/*.spec.ts (auto-starts the dev server)
npm run test:e2e:report           # open the last HTML report
```

`playwright.config.ts` starts the server itself: a **production build** (`next build --webpack &&
next start`), so the run matches the deployed site and avoids dev-only React StrictMode
double-mounting. `--webpack` is used because Turbopack panics when this repo runs inside a git
worktree whose `node_modules` is a symlink. First run builds (~1–2 min); override the port with
`PORT`, or skip the build by pointing at an already-running server with `BASE_URL`.

## Coverage (`mobile-smoke.spec.ts`)

- `/new` Step-1 categories match the `/templates` gallery taxonomy (8 categories + 기타).
- Wizard basics land in the editor (venue on the cover chip + WHERE card, not the sample 홍대).
- Untouched template examples render as gray hints (`.iv-example`); wizard-filled fields are solid.
- Inline tap-to-edit commits a change in the preview.
- The publish dialog opens on mobile and the 발행하기 button is reachable within the viewport.

CI note: run `npx playwright install --with-deps chromium` before `npm run test:e2e`.
