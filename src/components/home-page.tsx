import Image from "next/image";
import Link from "next/link";
import { type CatalogProduct } from "@/lib/products";
import { HomeFaq } from "@/components/home-faq";
import { HomeHighlights } from "@/components/home-highlights";
import { PriceGuide } from "@/components/price-guide";
import { formatZar, getSampleCatalogPrice } from "@/lib/pricing";

type HomePageProps = {
  products: CatalogProduct[];
  totalProductCount: number;
};

function CartIcon() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true">
      <path d="M7 4h22a4 4 0 0 1 4 4v13H7z" />
      <path d="M33 12h6l4 6v3H33zM4 23h39" />
      <circle cx="13" cy="25" r="4" />
      <circle cx="36" cy="25" r="4" />
    </svg>
  );
}

export default function HomePage({ products, totalProductCount }: HomePageProps) {
  const heroProduct = products[0];
  const featuredProducts = products.slice(1);

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        Shop a cart or ask about a rental
        <Link href="/inventory">Browse inventory <span aria-hidden="true">→</span></Link>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> BUY OR RENT A GOLF CART</div>
          <h1>Golf carts for sale<br /><em>in South Africa.</em></h1>
          <p>Compare dealer listings with sample ZAR prices, view passenger-size budget ranges, or request a golf cart hire quote. Local stock, actual pricing, delivery, and rental availability must be confirmed.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/inventory">Browse carts <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/rentals">Need a rental? <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-proof">
            <span className="proof-stars" aria-hidden="true">✓</span>
            <span>Personal help before you commit</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Featured golf cart">
          <div className="hero-sticker"><span>THE OPEN ROAD</span><strong>IS CALLING</strong><span>Make it a good one.</span></div>
          <div className="hero-image-frame">
            {heroProduct?.imageUrl ? (
              <Image
                src={heroProduct.imageUrl}
                alt={heroProduct.name}
                fill
                loading="eager"
                sizes="(max-width: 760px) 90vw, 48vw"
                className="hero-image"
              />
            ) : <div className="image-placeholder"><CartIcon /></div>}
          </div>
          <div className="hero-caption"><span>FEATURED FIND</span><span>{heroProduct?.name}</span></div>
          <span className="hero-sun" aria-hidden="true" />
          <span className="hero-leaf leaf-one" aria-hidden="true">✳</span>
          <span className="hero-leaf leaf-two" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="trust-strip" aria-label="Catalog information">
        <div><strong>{totalProductCount}</strong><span>dealer listings</span></div>
        <div><strong>ZAR guide</strong><span>budget ranges by seats</span></div>
        <div><strong>Confirm first</strong><span>local price and availability</span></div>
        <p>Sample listing prices are placeholders, not confirmed offers. Dealer listings do not confirm South African stock or delivery.</p>
      </section>

      <section className="seat-categories" aria-labelledby="seat-categories-title">
        <div className="eyebrow"><span /> FIND THE RIGHT SIZE</div>
        <h2 id="seat-categories-title">How many passengers?</h2>
        <div className="seat-category-grid">
          <Link className="seat-category" href="/inventory?seats=2">
            <span className="seat-category-count">02</span>
            <strong>2 passengers</strong>
            <span>Browse compact carts <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="seat-category" href="/inventory?seats=4">
            <span className="seat-category-count">04</span>
            <strong>4 passengers</strong>
            <span>Find room for more <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="seat-category" href="/inventory?seats=6plus">
            <span className="seat-category-count">06+</span>
            <strong>6+ passengers</strong>
            <span>Explore group carts <span aria-hidden="true">→</span></span>
          </Link>
        </div>
      </section>

      <PriceGuide />

      <section className="home-featured">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> A FEW FROM THE COLLECTION</div>
            <h2>Find a cart that fits <em>your day.</em></h2>
          </div>
          <p>These are a small sample of the listings. Browse the full inventory to search and compare.</p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 680px) 90vw, (max-width: 1050px) 45vw, 30vw"
                  />
                ) : <div className="image-placeholder"><CartIcon /></div>}
                <span className="product-tag">ASK ABOUT AVAILABILITY</span>
              </div>
              <div className="product-info">
                <div className="product-meta"><span>GOLF CART</span><span>DEALER LISTING</span></div>
                <h3>{product.name}</h3>
                <a className="listing-link" href={product.url} target="_blank" rel="noreferrer">
                  View dealer listing <span aria-hidden="true">↗</span>
                </a>
                <div className="product-footer">
                  <div>
                    <span className="price-label">ZAR PRICE</span>
                    <strong>{formatZar(getSampleCatalogPrice(product.id, product.name))}</strong>
                  </div>
                  <Link className="featured-enquire-link" href="/inventory">Enquire <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="featured-cta">
          <Link className="button button-dark" href="/inventory">View full inventory <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="purchase-steps" id="how-it-works">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> SIMPLE FROM START TO FINISH</div>
            <h2>Pick your cart. <em>We&apos;ll take it from here.</em></h2>
          </div>
        </div>
        <div className="steps-grid">
          <article><span>01</span><h3>Explore listings</h3><p>Browse models, compare listed prices, and find the seats and style that work for you.</p></article>
          <article><span>02</span><h3>Send an enquiry</h3><p>Tell us which cart you want to buy, or share your dates for a rental request.</p></article>
          <article><span>03</span><h3>Confirm the details</h3><p>We&apos;ll verify availability, answer your questions, and arrange the next steps together.</p></article>
        </div>
      </section>
      <HomeHighlights />
      <HomeFaq />
    </main>
  );
}
