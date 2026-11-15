import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-seo";

const publicPaths = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/inventory", priority: 0.9, changeFrequency: "weekly" },
  { path: "/rentals", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin;
  if (!origin) return [];

  return publicPaths.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, origin).toString(),
    priority,
    changeFrequency,
  }));
}
