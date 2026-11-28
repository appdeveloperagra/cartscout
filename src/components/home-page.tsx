import Image from "next/image";
import Link from "next/link";
import {
  getCatalogPassengerCapacity,
  getCatalogPowertrain,
  getProductMake,
  type CatalogProduct,
} from "@/lib/products";
import { HomeFaq } from "@/components/home-faq";
import { HomeHighlights } from "@/components/home-highlights";
import { PriceGuide } from "@/components/price-guide";
import { formatZar, getCatalogPriceZar } from "@/lib/pricing";

type HomePageProps = {
  products: CatalogProduct[];
  totalProductCount: number;
};

export default function HomePage({ products, totalProductCount }: HomePageProps) {
  const electricProducts = products.filter((product) => getCatalogPowertrain(product) === "electric");
  const heroProduct = electricProducts[0] ?? products[0];
  const featuredProducts = (electricProducts.length ? electricProducts : products).slice(1, 7);

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        Golf cart sales and rental enquiries.
        <Link href="/shop">Shop carts <span aria-hidden="true">→</span></Link>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> ELECTRIC GOLF CARTS · SOUTH AFRICA</div>
          <h1>Electric golf carts.<br /><em>Buy or rent with confidence.</em></h1>
          <p>Explore electric golf carts and compare listings by passenger capacity, make and recorded battery type. Ask CartScout to confirm each cart&apos;s specifications, availability and delivery options for your location.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/shop/electric-golf-carts">Browse electric carts <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/rent">Need a rental? <span aria-hidden="true">↗</span></Link>
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
            ) : <div className="product-image-empty" aria-hidden="true" />}
          </div>
          <div className="hero-caption"><span>FEATURED CART</span><span>{heroProduct?.name}</span></div>
          <span className="hero-sun" aria-hidden="true" />
          <span className="hero-leaf leaf-one" aria-hidden="true">✳</span>
          <span className="hero-leaf leaf-two" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="trust-strip" aria-label="Catalog information">
        <div><strong>{totalProductCount}</strong><span>carts in our collection</span></div>
        <div><strong>Price estimates</strong><span>not confirmed quotes</span></div>
        <div><strong>Confirm first</strong><span>availability and delivery</span></div>
      </section>

      <section className="seat-categories" aria-labelledby="seat-categories-title">
        <div className="eyebrow"><span /> FIND THE RIGHT SIZE</div>
        <h2 id="seat-categories-title">How many passengers?</h2>
        <div className="seat-category-grid">
          <Link className="seat-category" href="/shop/2-seater-golf-carts">
            <span className="seat-category-count">02</span>
            <strong>2 passengers</strong>
            <span>Browse compact carts <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="seat-category" href="/shop/4-seater-golf-carts">
            <span className="seat-category-count">04</span>
            <strong>4 passengers</strong>
            <span>Find room for more <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="seat-category" href="/shop/6-seater-golf-carts">
            <span className="seat-category-count">06</span>
            <strong>6 passengers</strong>
            <span>Explore group carts <span aria-hidden="true">→</span></span>
          </Link>
        </div>
      </section>

      <section className="seat-categories" aria-labelledby="shop-by-brand-title">
        <div className="eyebrow"><span /> SHOP BY BRAND</div>
        <h2 id="shop-by-brand-title">Choose a trusted make.</h2>
        <div className="seat-category-grid">
          <Link className="seat-category" href="/shop/club-car"><span className="seat-category-count">01</span><strong>Club Car</strong><span>Explore Club Car carts <span aria-hidden="true">→</span></span></Link>
          <Link className="seat-category" href="/shop/e-z-go"><span className="seat-category-count">02</span><strong>E-Z-GO</strong><span>Explore E-Z-GO carts <span aria-hidden="true">→</span></span></Link>
          <Link className="seat-category" href="/shop/yamaha"><span className="seat-category-count">03</span><strong>Yamaha</strong><span>Explore Yamaha carts <span aria-hidden="true">→</span></span></Link>
        </div>
      </section>

      <PriceGuide products={products} />

      <section className="home-featured">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> A FEW FROM THE COLLECTION</div>
            <h2>Find a cart that fits <em>your day.</em></h2>
          </div>
          <p>Compare the listed makes and passenger capacities, then contact CartScout to confirm product details, availability and delivery options.</p>
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
                ) : <div className="product-image-empty" aria-hidden="true" />}
                <span className="product-tag">{product.inStock ? "AVAILABLE - CONFIRM FIRST" : "ENQUIRE ABOUT AVAILABILITY"}</span>
              </div>
              <div className="product-info">
                <div className="product-meta">
                  <span>{getProductMake(product.name) ?? "GOLF CART"}</span>
                  <span>
                    {getCatalogPassengerCapacity(product)
                      ? `${getCatalogPassengerCapacity(product)} PASSENGER`
                      : "OUR COLLECTION"}
                  </span>
                </div>
                <h3>
                  {product.slug ? (
                    <Link href={`/${product.slug}`}>{product.name}</Link>
                  ) : product.name}
                </h3>
                <div className="product-footer">
                  <div>
                    <span className="price-label">INDICATIVE ZAR ESTIMATE</span>
                    <strong>{formatZar(getCatalogPriceZar(product.price, product.currency))}</strong>
                  </div>
                  <Link
                    className="featured-enquire-link"
                    href={product.slug ? `/${product.slug}` : "/shop"}
                  >
                    {product.slug ? "Ask about this cart" : "View inventory"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="featured-cta">
          <Link className="button button-dark" href="/shop">View full inventory <span aria-hidden="true">→</span></Link>
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
          <article><span>01</span><h3>Explore all makes and models</h3><p>Browse our golf carts by brand and passenger capacity to find the right fit for you.</p></article>
          <article><span>02</span><h3>Send an enquiry</h3><p>Tell us which cart you want to buy, or share your dates for a rental request.</p></article>
          <article><span>03</span><h3>Confirm the details</h3><p>We&apos;ll verify availability, answer your questions, and arrange the next steps together.</p></article>
        </div>
      </section>
      <HomeHighlights />
      <HomeFaq />
    </main>
  );
}
