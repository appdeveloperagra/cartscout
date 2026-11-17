import type { Metadata } from "next";
import { Suspense } from "react";
import Catalog from "@/components/catalog";
import { parseSeatFilter } from "@/lib/products";
import { createPageMetadata } from "@/lib/site-seo";
import { getPublicContactSettings, getPublicProducts } from "@/lib/cms";

export const metadata: Metadata = createPageMetadata({
  title: "All Makes & Models | CartScout Golf Cart Dealership",
  description:
    "Explore golf carts from all makes and models. CartScout sells and rents nationwide; contact us to arrange availability and delivery.",
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
  const [products, contact] = await Promise.all([
    getPublicProducts(),
    getPublicContactSettings(),
  ]);

  return (
    <Catalog
      products={products}
      initialSeats={parseSeatFilter(seats)}
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
