import type { Metadata } from "next";
import { Suspense } from "react";
import Catalog from "@/components/catalog";
import { parseSeatFilter, type CatalogProduct } from "@/lib/products";
import { createPageMetadata } from "@/lib/site-seo";
import inventory from "@/data/products.json";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Carts for Sale | ZAR Catalogue",
  description:
    "Browse golf cart listings with sample ZAR placeholder amounts. These are not confirmed offers; verify local price, stock, and delivery before purchase.",
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
