import { defineConfig, devices } from "@playwright/test";

/**
 * Mobile-first e2e smoke config. Runs the app on a real Chromium at an iPhone device profile
 * (mobile viewport + touch), the primary experience for 초대쿵.
 *
 * The test server runs a PRODUCTION build (`next build && next start`), not `next dev`, so the run
 * matches the deployed site and is free of dev-only React StrictMode double-mounting (which races
 * with the wizard's one-shot seed). `--webpack`: this repo is often developed inside a git worktree
 * whose `node_modules` is a symlink, which makes Turbopack panic ("Symlink … points out of the
 * filesystem root"); the webpack engine works in both a normal checkout and a worktree.
 * Override the port with PORT, or point at an already-running server with BASE_URL.
 */
const PORT = Number(process.env.PORT ?? 3200);
const BASE = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: BASE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Pure logic (no browser/server) — e.g. the RSVP → participant-block derivation.
    { name: "unit", testMatch: "unit/**/*.spec.ts" },
    // iPhone viewport/DPR/touch but on the Chromium engine — i.e. Chrome DevTools' iPhone device
    // emulation (devices["iPhone 13"] alone would pick WebKit).
    { name: "mobile-chrome", testMatch: "e2e/**/*.spec.ts", use: { ...devices["iPhone 13"], browserName: "chromium" } },
  ],
  webServer: {
    command: `npm run build -- --webpack && npm run start -- --port ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000, // includes a production build on a cold run
    stdout: "pipe",
    stderr: "pipe",
  },
});
