import type { MetadataRoute } from "next";
import { shouldIndex, siteOrigin } from "@/lib/site-seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(shouldIndex ? { allow: "/" } : { disallow: "/" }),
    },
    ...(siteOrigin ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}),
  };
}
