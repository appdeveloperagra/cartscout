import type { Metadata } from "next";
import { Suspense } from "react";
import Catalog from "@/components/catalog";
import { getPublicContactSettings, getPublicProductCategories, getPublicProducts } from "@/lib/cms";
import { getShopCategory } from "@/lib/shop-categories";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Carts for Sale in South Africa",
  description: "Browse golf carts by make, passenger capacity, powertrain and battery type. Confirm specifications, availability and delivery before purchase.",
  path: "/shop",
});

async function ShopContent() {
  const [products, contact, categories] = await Promise.all([
    getPublicProducts(),
    getPublicContactSettings(),
    getPublicProductCategories(),
  ]);
  const categoryLinks = categories
    .filter((category) => products.some((product) => product.categorySlugs?.includes(category.slug)))
    .map((category) => ({
      slug: category.slug,
      name: getShopCategory(category.slug, categories)?.heading.replace(/\.$/, "") ?? category.name,
    }));

  return (
    <Catalog
      products={products}
      initialQuery=""
      initialMake="All makes"
      initialSeats="Any seats"
      initialSort="featured"
      whatsappHref={contact.whatsapp_href}
      categoryLinks={categoryLinks}
      pageHeading="Golf carts for sale."
      pageIntro="Browse golf carts by make and passenger capacity. Powertrain and battery details are shown when recorded; confirm the exact specifications, availability, pricing and delivery arrangements with CartScout."
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<main className="inventory-section route-loading" role="status">Loading the shop...</main>}>
      <ShopContent />
    </Suspense>
  );
}
