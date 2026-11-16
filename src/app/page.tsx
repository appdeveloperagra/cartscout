import { createPageMetadata } from "@/lib/site-seo";
import HomePage from "@/components/home-page";
import inventory from "@/data/products.json";
import type { CatalogProduct } from "@/lib/products";

export const metadata = createPageMetadata({
  title: "Golf Cart Dealership | Sales & Rentals Nationwide",
  description:
    "CartScout is a golf cart dealership for all makes and models, selling and renting throughout South Africa. Contact our team for sales, rentals, and delivery.",
  path: "/",
});

export default function Home() {
  const products = inventory.products as CatalogProduct[];
  return <HomePage products={products.slice(0, 7)} totalProductCount={products.length} />;
}
