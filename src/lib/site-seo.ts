import type { Metadata } from "next";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://cartscout.co.za";
export const siteOrigin = new URL(configuredSiteUrl).origin;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const canonicalUrl = siteOrigin ? new URL(path, siteOrigin).toString() : undefined;
  const socialImageUrl = siteOrigin
    ? new URL("/api/social-image", siteOrigin).toString()
    : undefined;
  const socialTitle = `${title} | CartScout`;

  return {
    title,
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title: socialTitle,
      description,
      type: "website",
      locale: "en_ZA",
      siteName: "CartScout",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(socialImageUrl
        ? {
            images: [
              {
                url: socialImageUrl,
                width: 1200,
                height: 630,
                alt: "CartScout golf cart sales and rental enquiries",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: siteOrigin ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}
