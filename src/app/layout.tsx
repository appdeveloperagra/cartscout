import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CartScout | Find your next golf cart",
  description:
    "Explore golf carts for sale from trusted dealers, with rental inventory coming soon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
