import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductGallery from "@/components/product-gallery";
import { getPublicContactSettings, getPublicProduct, getPublicProducts } from "@/lib/cms";
import { formatZar, getCatalogPriceZar } from "@/lib/pricing";
import { getPassengerCapacity } from "@/lib/products";
import { createPageMetadata } from "@/lib/site-seo";
import type { CatalogProduct } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function getMake(name: string) {
  const match = name.match(/\b(Club Car|E-Z-GO|EZGO|Yamaha|Evolution|Icon|Tomberlin|Star EV|Denago|Advanced EV|Bintelli|Garia)\b/i);
  if (!match) return null;
  return /^ezgo$/i.test(match[0]) ? "E-Z-GO" : match[0];
}

function getRelatedProducts(product: CatalogProduct, products: CatalogProduct[]) {
  const make = getMake(product.name);
  const capacity = getPassengerCapacity(product.name);

  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => ({
      product: candidate,
      relevance:
        (make && getMake(candidate.name)?.toLowerCase() === make.toLowerCase() ? 2 : 0) +
        (capacity && getPassengerCapacity(candidate.name) === capacity ? 1 : 0),
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 4)
    .map(({ product: candidate }) => candidate);
}

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
    path: `/${product.slug}`,
  });
}

async function ProductContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, contact, products] = await Promise.all([
    getPublicProduct(slug),
    getPublicContactSettings(),
    getPublicProducts(),
  ]);
  if (!product) notFound();

  const images = [...new Set([product.imageUrl, ...(product.imageGallery ?? [])].filter(
    (image): image is string => Boolean(image),
  ))];
  const capacity = getPassengerCapacity(product.name);
  const priceZar = getCatalogPriceZar(product.price, product.currency);
  const attributes = Object.entries(product.attributes ?? {});
  const relatedProducts = getRelatedProducts(product, products);
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
            <span>{product.inStock ? "Ask about availability" : "Ask about this cart"}</span>
          </div>
          <p className="product-detail-price">{formatZar(priceZar)}</p>
          <div className="page-actions">
            <a className="button button-dark" href={`${contact.whatsapp_href}?text=${message}`} rel="noreferrer" target="_blank">
              Enquire on WhatsApp <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href={contact.phone_href}>Call {contact.phone_display}</a>
          </div>
        </section>
      </div>
      <section className="product-detail-information">
        <div className="product-section-heading">
          <div className="eyebrow"><span /> PRODUCT OVERVIEW</div>
          <h2>Get to know this golf cart.</h2>
        </div>
        {product.description && <p className="product-detail-description">{product.description}</p>}
        {attributes.length > 0 && (
          <div className="product-specs-section">
            <h3>Key details</h3>
            <dl className="product-specs">
              {attributes.map(([label, value]) => (
                <div key={label}>
                  <dt>{label.replaceAll("_", " ")}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div className="product-detail-note">
          <strong>We&apos;re here to help.</strong>
          <span>Our team can answer your questions about specifications, availability, pricing, and delivery.</span>
          <a className="inline-link" href={`${contact.whatsapp_href}?text=${message}`} rel="noreferrer" target="_blank">
            Talk to our team <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
      {relatedProducts.length > 0 && (
        <section className="product-related-section">
          <div className="product-section-heading">
            <div className="eyebrow"><span /> KEEP EXPLORING</div>
            <h2>More carts you may like.</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((related) => (
              <article className="product-card" key={related.id}>
                <Link className="product-related-image" href={`/${related.slug}`}>
                  {related.imageUrl ? (
                    <Image
                      alt={related.name}
                      fill
                      sizes="(max-width: 700px) 90vw, (max-width: 1050px) 45vw, 25vw"
                      src={related.imageUrl}
                    />
                  ) : <span className="product-image-empty" aria-hidden="true" />}
                </Link>
                <div className="product-info">
                  <div className="product-meta">
                    <span>{getMake(related.name) ?? "GOLF CART"}</span>
                    <span>{getPassengerCapacity(related.name) ? `${getPassengerCapacity(related.name)} PASSENGER` : "OUR COLLECTION"}</span>
                  </div>
                  <h3><Link href={`/${related.slug}`}>{related.name}</Link></h3>
                  <div className="product-footer">
                    <div>
                      <span className="price-label">ZAR PRICE</span>
                      <strong>{formatZar(getCatalogPriceZar(related.price, related.currency))}</strong>
                    </div>
                    <Link className="product-related-link" href={`/${related.slug}`}>View details <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
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
