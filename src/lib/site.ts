/** Absolute site origin, used for OG/Twitter image URLs, robots.txt, and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL on Vercel for a stable domain; falls back to the deployment
 * URL, then localhost. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
