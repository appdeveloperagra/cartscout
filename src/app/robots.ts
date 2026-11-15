import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(siteOrigin ? { allow: "/" } : { disallow: "/" }),
    },
    ...(siteOrigin ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}),
  };
}
