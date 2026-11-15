import { createPageMetadata } from "@/lib/site-seo";
import HomePage from "@/components/home-page";
import inventory from "@/data/products.json";
import type { CatalogProduct } from "@/lib/products";

export const metadata = createPageMetadata({
  title: "Golf Cart Listings & Rental Enquiries",
  description:
    "Explore selected golf cart listings, browse the full inventory, enquire about a purchase, or ask CartScout about rental availability.",
  path: "/",
});

export default function Home() {
  const products = inventory.products as CatalogProduct[];
  return <HomePage products={products.slice(0, 4)} totalProductCount={products.length} />;
}
