import type { Metadata } from "next";
import { Suspense } from "react";
import { FloatingContactLinks, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { getPublicContactSettings } from "@/lib/cms";
import { siteOrigin } from "@/lib/site-seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  title: {
    default: "Golf Cart Dealership | Sales & Rentals Nationwide | CartScout",
    template: "%s | CartScout",
  },
  description:
    "CartScout is a golf cart dealership for all makes and models, selling and renting throughout South Africa. Contact our team for sales, rentals, and delivery.",
  applicationName: "CartScout",
  authors: [{ name: "CartScout" }],
  publisher: "CartScout",
  category: "shopping",
  referrer: "origin-when-cross-origin",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "CartScout",
    title: "Golf Cart Dealership | Sales & Rentals Nationwide | CartScout",
    description:
      "CartScout is a golf cart dealership for all makes and models, selling and renting throughout South Africa. Contact our team for sales, rentals, and delivery.",
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
    title: "Golf Cart Dealership | Sales & Rentals Nationwide | CartScout",
    description:
      "CartScout is a golf cart dealership for all makes and models, selling and renting throughout South Africa. Contact our team for sales, rentals, and delivery.",
    ...(siteOrigin
      ? { images: [new URL("/api/social-image", siteOrigin).toString()] }
      : {}),
  },
};

async function PublicStructuredData() {
  const contact = await getPublicContactSettings();
  return <StructuredData email={contact.email} phone={contact.phone} />;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA">
      <body>
        <Suspense fallback={null}>
          <PublicStructuredData />
        </Suspense>
        <Suspense fallback={<div className="site-header-skeleton" aria-hidden="true" />}>
          <SiteHeader />
        </Suspense>
        {children}
        <Suspense fallback={null}><SiteFooter /></Suspense>
        <Suspense fallback={null}><FloatingContactLinks /></Suspense>
      </body>
    </html>
  );
}
