import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Keep app/private surfaces out of search (no SEO value; some are private), and point crawlers
 * at the sitemap. Public invitation pages (/i/…) are governed per-page: only ones explicitly
 * published as Public are indexable, everything else carries a noindex (see the invitation page). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/settings", "/rsvp", "/editor", "/preview", "/media"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
