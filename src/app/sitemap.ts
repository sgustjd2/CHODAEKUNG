import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Public marketing pages only. Invitations are per-recipient share links (not listed here);
 * app routes are excluded via robots.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/templates", priority: 0.8 },
    { path: "/guide", priority: 0.6 },
    { path: "/privacy", priority: 0.3 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}
