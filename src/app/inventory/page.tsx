import type { Metadata } from "next";
import Catalog from "@/components/catalog";
import type { CatalogProduct } from "@/lib/products";
import { createPageMetadata } from "@/lib/site-seo";
import inventory from "@/data/products.json";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart Inventory",
  description:
    "Browse all CartScout golf cart dealer listings. Search by model, make, or passenger capacity, and confirm listed prices and availability before purchase.",
  path: "/inventory",
});

export default function InventoryPage() {
  return <Catalog products={inventory.products as CatalogProduct[]} />;
}
