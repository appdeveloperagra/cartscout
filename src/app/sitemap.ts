import type { MetadataRoute } from "next";
import { getPublishedBlogPosts, getPublicProducts, getPublicServiceAreas } from "@/lib/cms";
import { siteOrigin } from "@/lib/site-seo";

const publicPaths = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/inventory", priority: 0.9, changeFrequency: "weekly" },
  { path: "/rentals", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin;
  if (!origin) return [];

  const [serviceAreas, blogPosts, products] = await Promise.all([
    getPublicServiceAreas(),
    getPublishedBlogPosts(),
    getPublicProducts(),
  ]);

  return [
    ...publicPaths.map(({ path, priority, changeFrequency }) => ({
      url: new URL(path, origin).toString(),
      priority,
      changeFrequency,
    })),
    ...serviceAreas.map(({ slug }) => ({
      url: new URL(`/locations/${slug}`, origin).toString(),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...blogPosts.map(({ slug, updated_at }) => ({
      url: new URL(`/blog/${slug}`, origin).toString(),
      lastModified: updated_at,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...products.flatMap(({ slug }) => slug ? [{
      url: new URL(`/inventory/${slug}`, origin).toString(),
      priority: 0.6,
      changeFrequency: "weekly" as const,
    }] : []),
  ];
}
