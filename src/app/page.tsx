import { createPageMetadata } from "@/lib/site-seo";
import HomePage from "@/components/home-page";
import inventory from "@/data/products.json";
import type { CatalogProduct } from "@/lib/products";

export const metadata = createPageMetadata({
  title: "Golf Cart Prices in South Africa",
  description:
    "Browse golf cart listings with sample ZAR placeholders and passenger-size budget ranges. Confirm actual local prices, stock, and delivery before purchase.",
  path: "/",
});

export default function Home() {
  const products = inventory.products as CatalogProduct[];
  return <HomePage products={products.slice(0, 7)} totalProductCount={products.length} />;
}
