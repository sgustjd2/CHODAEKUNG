import { test, expect } from "@playwright/test";
import { resolveSiteUrl } from "@/lib/site";

/** The share-card / SEO origin precedence. A regression here silently breaks every og:image,
 * robots sitemap pointer, and sitemap URL — so lock the order and the https:// prefixing.
 * Order: NEXT_PUBLIC_SITE_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL > localhost. */

test("NEXT_PUBLIC_SITE_URL (a full URL) wins over everything, used verbatim", () => {
  expect(
    resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://moi.example",
      VERCEL_PROJECT_PRODUCTION_URL: "prod.vercel.app",
      VERCEL_URL: "dep-xyz.vercel.app",
    }),
  ).toBe("https://moi.example");
});

test("prefers the stable production domain over the deployment URL (both https-prefixed)", () => {
  expect(
    resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "chodaekung.vercel.app", VERCEL_URL: "dep-xyz.vercel.app" }),
  ).toBe("https://chodaekung.vercel.app");
});

test("falls back to the deployment URL when no production domain", () => {
  expect(resolveSiteUrl({ VERCEL_URL: "dep-xyz.vercel.app" })).toBe("https://dep-xyz.vercel.app");
});

test("empty env → localhost", () => {
  expect(resolveSiteUrl({})).toBe("http://localhost:3000");
});

test("empty-string env vars are falsy and fall through (not treated as a set origin)", () => {
  expect(
    resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "prod.app" }),
  ).toBe("https://prod.app");
});
