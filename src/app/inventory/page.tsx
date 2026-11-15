import type { Metadata } from "next";
import { Suspense } from "react";
import Catalog from "@/components/catalog";
import { parseSeatFilter, type CatalogProduct } from "@/lib/products";
import { createPageMetadata } from "@/lib/site-seo";
import inventory from "@/data/products.json";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart Inventory",
  description:
    "Browse all CartScout golf cart dealer listings. Search by model, make, or passenger capacity, and confirm listed prices and availability before purchase.",
  path: "/inventory",
});

type InventorySearchParams = {
  seats?: string | string[];
};

async function InventoryContent({
  searchParams,
}: {
  searchParams: Promise<InventorySearchParams>;
}) {
  const { seats } = await searchParams;

  return (
    <Catalog
      products={inventory.products as CatalogProduct[]}
      initialSeats={parseSeatFilter(seats)}
    />
  );
}

export default function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<InventorySearchParams>;
}) {
  return (
    <Suspense fallback={<div className="inventory-section" role="status">Loading inventory...</div>}>
      <InventoryContent searchParams={searchParams} />
    </Suspense>
  );
}
