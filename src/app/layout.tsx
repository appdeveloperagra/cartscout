import type { Metadata } from "next";
import { FloatingContactLinks, SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "CartScout | Golf cart sales and rental enquiries",
  description:
    "Explore golf cart listings, enquire about a purchase, or ask CartScout about rental availability.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingContactLinks />
      </body>
    </html>
  );
}
