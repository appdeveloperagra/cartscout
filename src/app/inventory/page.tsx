import type { Metadata } from "next";
import { Suspense } from "react";
import Catalog from "@/components/catalog";
import { parseCatalogSort, parseSeatFilter } from "@/lib/products";
import { createPageMetadata } from "@/lib/site-seo";
import { getPublicContactSettings, getPublicProducts } from "@/lib/cms";

export const metadata: Metadata = createPageMetadata({
  title: "All Makes & Models | CartScout Golf Cart Dealership",
  description:
    "Explore golf carts from all makes and models. CartScout sells and rents nationwide; contact us to arrange availability and delivery.",
  path: "/inventory",
});

type InventorySearchParams = {
  q?: string | string[];
  make?: string | string[];
  seats?: string | string[];
  sort?: string | string[];
};

function firstSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

async function InventoryContent({
  searchParams,
}: {
  searchParams: Promise<InventorySearchParams>;
}) {
  const { q, make, seats, sort } = await searchParams;
  const [products, contact] = await Promise.all([
    getPublicProducts(),
    getPublicContactSettings(),
  ]);

  return (
    <Catalog
      products={products}
      initialQuery={firstSearchValue(q)}
      initialMake={firstSearchValue(make)}
      initialSeats={parseSeatFilter(seats)}
      initialSort={parseCatalogSort(sort)}
      whatsappHref={contact.whatsapp_href}
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
