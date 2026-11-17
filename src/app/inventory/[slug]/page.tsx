import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductGallery from "@/components/product-gallery";
import { getPublicContactSettings, getPublicProduct } from "@/lib/cms";
import { formatZar, getCatalogPriceZar } from "@/lib/pricing";
import { getPassengerCapacity } from "@/lib/products";
import { createPageMetadata } from "@/lib/site-seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return {};

  const description =
    product.seoDescription?.trim() ||
    product.description?.trim() ||
    `${product.name} available from CartScout. Contact us to confirm current availability, pricing, and delivery arrangements.`;

  return createPageMetadata({
    title: product.seoTitle?.trim() || product.name,
    description,
    path: `/inventory/${product.slug}`,
  });
}

async function ProductContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, contact] = await Promise.all([
    getPublicProduct(slug),
    getPublicContactSettings(),
  ]);
  if (!product) notFound();

  const images = [...new Set([product.imageUrl, ...(product.imageGallery ?? [])].filter(
    (image): image is string => Boolean(image),
  ))];
  const capacity = getPassengerCapacity(product.name);
  const priceZar = getCatalogPriceZar(product.price, product.currency);
  const message = encodeURIComponent(
    `Hi CartScout, I would like to enquire about ${product.name}. Listed price: ${formatZar(priceZar)}. Please confirm current availability and delivery arrangements.`,
  );

  return (
    <main className="content-page product-detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/inventory">Inventory</Link></li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>
      <div className="product-detail-grid">
        <ProductGallery images={images} productName={product.name} />
        <section className="product-detail-copy">
          <div className="eyebrow"><span /> CARTSCOUT COLLECTION</div>
          <h1>{product.name}</h1>
          <div className="product-detail-meta">
            {capacity ? <span>{capacity} passenger</span> : <span>Golf cart</span>}
            <span>{product.inStock ? "Availability to be confirmed" : "Currently unavailable"}</span>
          </div>
          <p className="product-detail-price">{formatZar(priceZar)}</p>
          {product.description && <p className="product-detail-description">{product.description}</p>}
          <p className="product-detail-note">
            Confirm the cart&apos;s specifications, availability, final price, and delivery arrangements with CartScout before proceeding.
          </p>
          <div className="page-actions">
            <a className="button button-dark" href={`${contact.whatsapp_href}?text=${message}`} rel="noreferrer" target="_blank">
              Enquire on WhatsApp <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href={contact.phone_href}>Call {contact.phone_display}</a>
          </div>
          <Link className="inline-link product-back-link" href="/inventory">Back to the full inventory</Link>
        </section>
      </div>
    </main>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<main className="content-page product-detail-page" role="status">Loading product details...</main>}>
      <ProductContent params={params} />
    </Suspense>
  );
}
