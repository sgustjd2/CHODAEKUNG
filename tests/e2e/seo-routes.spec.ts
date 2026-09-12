import { test, expect } from "@playwright/test";

/**
 * SEO / share infrastructure routes — the app is share-driven, so these must serve correctly:
 * robots (app surfaces disallowed + sitemap pointer), sitemap (public marketing pages), the web
 * app manifest, the per-invitation OG card image, and the brand icon.
 */
test("robots.txt disallows app surfaces and points at the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = (await res.text()).toLowerCase();
  expect(body).toContain("user-agent: *");
  expect(body).toContain("allow: /");
  for (const dir of ["/editor", "/dashboard", "/settings", "/rsvp", "/preview", "/media"]) {
    expect(body, `disallow ${dir}`).toContain(`disallow: ${dir}`);
  }
  expect(body).toContain("sitemap:");
});

test("sitemap.xml lists the public marketing pages", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain("<urlset");
  expect((xml.match(/<loc>/g) ?? []).length).toBe(4); // /, /templates, /guide, /privacy
  for (const path of ["/templates</loc>", "/guide</loc>", "/privacy</loc>"]) {
    expect(xml).toContain(path);
  }
});

test("manifest.webmanifest is valid install metadata", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.status()).toBe(200);
  const m = JSON.parse(await res.text());
  expect(m.name).toContain("초대쿵");
  expect(m.short_name).toBe("초대쿵");
  expect(m.display).toBe("standalone");
  expect(m.start_url).toBe("/");
  expect(m.icons?.[0]?.src).toBe("/icon.svg");
});

test("per-invitation OG card renders as an image", async ({ request }) => {
  const res = await request.get("/i/jisoo-minjun/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"] ?? "").toContain("image");
  expect((await res.body()).byteLength).toBeGreaterThan(1000); // a real rendered card, not empty
});

test("brand icon serves as SVG", async ({ request }) => {
  const res = await request.get("/icon.svg");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"] ?? "").toContain("svg");
});
