import { defineConfig, devices } from "@playwright/test";

/**
 * Mobile-first e2e smoke config. Runs the app on a real Chromium at an iPhone device profile
 * (mobile viewport + touch), the primary experience for 초대쿵.
 *
 * `next dev --webpack`: this repo is often developed inside a git worktree whose `node_modules`
 * is a symlink, which makes Turbopack (the `next dev` default) panic ("Symlink … points out of
 * the filesystem root"). The webpack engine works in both a normal checkout and a worktree, so
 * the test server uses it for portability. Override the port with PORT.
 */
const PORT = Number(process.env.PORT ?? 3200);
const BASE = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: BASE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // iPhone viewport/DPR/touch but on the Chromium engine — i.e. Chrome DevTools' iPhone device
  // emulation (devices["iPhone 13"] alone would pick WebKit).
  projects: [{ name: "mobile-chrome", use: { ...devices["iPhone 13"], browserName: "chromium" } }],
  webServer: {
    command: `npm run dev -- --webpack --port ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 150_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
