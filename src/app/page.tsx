import { createPageMetadata } from "@/lib/site-seo";
import Catalog, { type CatalogProduct } from "@/components/catalog";
import inventory from "@/data/products.json";

export const metadata = createPageMetadata({
  title: "Golf Carts for Sale & Rental Enquiries",
  description:
    "Browse golf cart listings, compare prices, enquire about a purchase, or ask CartScout about rental availability.",
  path: "/",
});

export default function Home() {
  return <Catalog products={inventory.products as CatalogProduct[]} />;
}
