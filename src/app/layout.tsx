import type { Metadata } from "next";
import { FloatingContactLinks, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { siteOrigin } from "@/lib/site-seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  title: {
    default: "Golf Cart Prices in South Africa | CartScout",
    template: "%s | CartScout",
  },
  description:
    "Explore golf cart listings, indicative budget ranges in ZAR, and purchase or rental enquiries. Confirm local pricing and availability before deciding.",
  applicationName: "CartScout",
  authors: [{ name: "CartScout" }],
  publisher: "CartScout",
  category: "shopping",
  referrer: "origin-when-cross-origin",
  robots: {
    index: Boolean(siteOrigin),
    follow: Boolean(siteOrigin),
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "CartScout",
    title: "Golf Cart Prices in South Africa | CartScout",
    description:
      "Explore golf cart listings, indicative budget ranges in ZAR, and purchase or rental enquiries.",
    ...(siteOrigin
      ? {
          url: siteOrigin,
          images: [
            {
              url: new URL("/api/social-image", siteOrigin).toString(),
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
    title: "Golf Cart Prices in South Africa | CartScout",
    description:
      "Explore golf cart listings, indicative budget ranges in ZAR, and purchase or rental enquiries.",
    ...(siteOrigin
      ? { images: [new URL("/api/social-image", siteOrigin).toString()] }
      : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA">
      <body>
        <StructuredData />
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingContactLinks />
      </body>
    </html>
  );
}
