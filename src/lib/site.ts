/** Absolute site origin, used for OG/Twitter image URLs, robots.txt, and the sitemap.
 *
 * Order matters for social share cards: KakaoTalk (and other scrapers) must be able to
 * FETCH the og:image. `VERCEL_URL` is the deployment-specific hostname, which Vercel
 * Deployment Protection often guards behind SSO (a scraper gets a login redirect, not the
 * image) — so prefer the stable, public production domain `VERCEL_PROJECT_PRODUCTION_URL`.
 * `NEXT_PUBLIC_SITE_URL` still wins when set (e.g. a custom domain). */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  return (
    env.NEXT_PUBLIC_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  );
}

export const siteUrl = resolveSiteUrl();
