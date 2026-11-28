import type { MetadataRoute } from "next";
import { getPublishedBlogPosts, getPublicProductCategories, getPublicProducts, getPublicServiceAreas } from "@/lib/cms";
import { siteOrigin } from "@/lib/site-seo";
import { cityLocations } from "@/lib/provinces";
import { guides } from "@/lib/guides";
import { useCases } from "@/lib/use-cases";

const publicPaths = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/rent", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
  { path: "/uses", priority: 0.7, changeFrequency: "monthly" },
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

  const [serviceAreas, blogPosts, products, categories] = await Promise.all([
    getPublicServiceAreas(),
    getPublishedBlogPosts(),
    getPublicProducts(),
    getPublicProductCategories(),
  ]);
  const nonIndexedCitySlugs = new Set(cityLocations.map(({ slug }) => slug));
  const categoriesWithProducts = categories.filter((category) =>
    products.some((product) => product.categorySlugs?.includes(category.slug)),
  );

  return [
    ...publicPaths.map(({ path, priority, changeFrequency }) => ({
      url: new URL(path, origin).toString(),
      priority,
      changeFrequency,
    })),
    ...serviceAreas.filter(({ slug }) => !nonIndexedCitySlugs.has(slug)).map(({ slug }) => ({
      url: new URL(`/locations/${slug}`, origin).toString(),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...categoriesWithProducts.map(({ slug }) => ({
      url: new URL(`/shop/${slug}`, origin).toString(),
      priority: 0.75,
      changeFrequency: "weekly" as const,
    })),
    ...guides.map(({ slug }) => ({
      url: new URL(`/guides/${slug}`, origin).toString(),
      priority: 0.65,
      changeFrequency: "monthly" as const,
    })),
    ...useCases.map(({ slug }) => ({
      url: new URL(`/uses/${slug}`, origin).toString(),
      priority: 0.65,
      changeFrequency: "monthly" as const,
    })),
    ...blogPosts.map(({ slug, updated_at }) => ({
      url: new URL(`/blog/${slug}`, origin).toString(),
      lastModified: updated_at,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...products.flatMap(({ slug }) => slug ? [{
      url: new URL(`/${slug}`, origin).toString(),
      priority: 0.6,
      changeFrequency: "weekly" as const,
    }] : []),
  ];
}
