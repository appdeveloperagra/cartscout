import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { FloatingContactLinks, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { getPublicContactSettings } from "@/lib/cms";
import { shouldIndex, siteOrigin } from "@/lib/site-seo";
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
  verification: {
    google: "OKxaELeZaGUynPYyXe9fyaB1CyA1J4rR5RH6Y2ahJDo",
  },
  robots: {
    index: shouldIndex,
    follow: shouldIndex,
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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P6745HM3');`}
        </Script>
      </body>
    </html>
  );
}
