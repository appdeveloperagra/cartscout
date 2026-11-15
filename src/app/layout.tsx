import type { Metadata } from "next";
import { FloatingContactLinks, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { siteOrigin } from "@/lib/site-seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  title: {
    default: "Golf Carts for Sale & Rental Enquiries",
    template: "%s | CartScout",
  },
  description:
    "Browse golf cart listings, enquire about a purchase, or ask CartScout about rental availability. Contact us by phone, WhatsApp, or email.",
  applicationName: "CartScout",
  authors: [{ name: "CartScout" }],
  publisher: "CartScout",
  category: "shopping",
  keywords: [
    "golf carts for sale",
    "golf cart rentals",
    "golf cart rental enquiries",
    "golf cart sales",
    "CartScout",
  ],
  referrer: "origin-when-cross-origin",
  robots: {
    index: Boolean(siteOrigin),
    follow: Boolean(siteOrigin),
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "CartScout",
    title: "Golf Carts for Sale & Rental Enquiries | CartScout",
    description:
      "Browse golf cart listings, enquire about a purchase, or ask CartScout about rental availability.",
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
    title: "Golf Carts for Sale & Rental Enquiries | CartScout",
    description:
      "Browse golf cart listings, enquire about a purchase, or ask CartScout about rental availability.",
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
