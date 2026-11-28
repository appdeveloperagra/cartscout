import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Catalog from "@/components/catalog";
import { getPublicContactSettings, getPublicProductCategories, getPublicProducts } from "@/lib/cms";
import { getShopCategory, shopCategories } from "@/lib/shop-categories";
import { createPageMetadata } from "@/lib/site-seo";

type ShopCategoryProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return shopCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: ShopCategoryProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getPublicProductCategories();
  const shopCategory = getShopCategory(category, categories);
  if (!shopCategory) return {};
  return createPageMetadata({
    title: shopCategory.title,
    description: shopCategory.description,
    path: `/shop/${shopCategory.slug}`,
  });
}

async function ShopCategoryContent({ params }: ShopCategoryProps) {
  const { category } = await params;
  const [categories, products, contact] = await Promise.all([
    getPublicProductCategories(),
    getPublicProducts(),
    getPublicContactSettings(),
  ]);
  const shopCategory = getShopCategory(category, categories);
  if (!shopCategory) notFound();

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ maxWidth: 1340, margin: "24px auto -36px", padding: "0 42px" }}>
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li aria-current="page">{shopCategory.heading.replace(".", "")}</li>
        </ol>
      </nav>
      <Catalog
        products={products}
        initialQuery=""
        initialMake={shopCategory.make}
        initialSeats={shopCategory.seats}
        initialSort={shopCategory.sort}
        whatsappHref={contact.whatsapp_href}
        initialCategorySlug={shopCategory.slug}
        pageHeading={shopCategory.heading}
        pageIntro={shopCategory.description}
      />
    </>
  );
}

export default function ShopCategoryPage({ params }: ShopCategoryProps) {
  return (
    <Suspense fallback={<main className="inventory-section route-loading" role="status">Loading the category...</main>}>
      <ShopCategoryContent params={params} />
    </Suspense>
  );
}
