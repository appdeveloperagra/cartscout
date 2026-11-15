"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { contactEmail } from "@/lib/contact";

export type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  currency: string;
  url: string;
  imageUrl: string | null;
  inStock: boolean;
};

type CatalogProps = {
  products: CatalogProduct[];
};

type Inquiry = {
  kind: "purchase" | "rental";
  product?: CatalogProduct;
};

function getMake(name: string) {
  const match = name.match(
    /\b(Club Car|E-Z-GO|EZGO|Yamaha|Evolution|Icon|Tomberlin|Star EV|Denago|Advanced EV|Bintelli|Garia)\b/i,
  );
  if (!match) return "Other";
  return /^ezgo$/i.test(match[0]) ? "E-Z-GO" : match[0];
}

function getSeats(name: string) {
  const match = name.match(/\b([2-8])\s*Passenger/i);
  return match ? Number(match[1]) : null;
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export default function Catalog({ products }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("All makes");
  const [seats, setSeats] = useState("Any seats");
  const [sort, setSort] = useState("featured");
  const [mode, setMode] = useState<"sale" | "rent">("sale");
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [inquiryError, setInquiryError] = useState("");
  const inquiryTrigger = useRef<HTMLButtonElement | null>(null);

  function closeInquiry() {
    const trigger = inquiryTrigger.current;
    setInquiry(null);
    requestAnimationFrame(() => trigger?.focus());
  }

  useEffect(() => {
    if (!inquiry) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeInquiry();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [inquiry]);

  const makes = useMemo(
    () => [...new Set(products.map((product) => getMake(product.name)))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${getMake(product.name)}`.toLowerCase().includes(normalizedQuery);
      const matchesMake = make === "All makes" || getMake(product.name) === make;
      const productSeats = getSeats(product.name);
      const matchesSeats =
        seats === "Any seats" ||
        (seats === "6+ seats" ? (productSeats ?? 0) >= 6 : productSeats === Number(seats));
      return matchesQuery && matchesMake && matchesSeats;
    });

    if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [make, products, query, seats, sort]);

  function openInquiry(nextInquiry: Inquiry, trigger: HTMLButtonElement) {
    setInquiryError("");
    inquiryTrigger.current = trigger;
    setInquiry(nextInquiry);
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inquiry) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");

    if (inquiry.kind === "rental") {
      if (endDate < startDate) {
        setInquiryError("The end date must be on or after the start date.");
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(`${startDate}T00:00:00`) < today) {
        setInquiryError("The start date cannot be in the past.");
        return;
      }
    }

    if (!contactEmail) {
      setInquiryError("Enquiry email is not configured yet. Set NEXT_PUBLIC_CONTACT_EMAIL before launch.");
      return;
    }

    const details =
      inquiry.kind === "rental"
        ? [
            `Start date: ${startDate}`,
            `End date: ${endDate}`,
            `Passengers: ${String(formData.get("passengers") ?? "")}`,
          ]
        : [`Cart: ${inquiry.product?.name ?? ""}`];
    const subject =
      inquiry.kind === "rental"
        ? "Golf cart rental enquiry"
        : `Golf cart purchase enquiry: ${inquiry.product?.name ?? ""}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      ...details,
      "",
      message || "Please contact me with availability and next steps.",
    ].join("\n");

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setInquiryError("Your email app should open with this request. Send the email to complete your enquiry.");
  }

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        Shop a cart or ask about a rental
        <a href="#inventory">Explore inventory <span aria-hidden="true">→</span></a>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> BUY OR RENT A GOLF CART</div>
          <h1>Find your cart.<br /><em>Take the scenic route.</em></h1>
          <p>Choose a golf cart to buy or tell us when you need a rental. Our team will confirm availability, pricing, and next steps with you.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#inventory" onClick={() => setMode("sale")}>Shop carts <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#inventory" onClick={() => setMode("rent")}>Need a rental? <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-proof">
            <span className="proof-stars" aria-hidden="true">✓</span>
            <span>Personal help before you commit</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Featured golf cart">
          <div className="hero-sticker"><span>THE OPEN ROAD</span><strong>IS CALLING</strong><span>Make it a good one.</span></div>
          <div className="hero-image-frame">
            {products[0]?.imageUrl ? (
              <Image
                src={products[0].imageUrl}
                alt={products[0].name}
                fill
                loading="eager"
                sizes="(max-width: 760px) 90vw, 48vw"
                className="hero-image"
              />
            ) : <div className="image-placeholder"><CartIcon /></div>}
          </div>
          <div className="hero-caption"><span>FEATURED FIND</span><span>{products[0]?.name}</span></div>
          <span className="hero-sun" aria-hidden="true" />
          <span className="hero-leaf leaf-one" aria-hidden="true">✳</span>
          <span className="hero-leaf leaf-two" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="trust-strip" aria-label="Catalog information">
        <div><strong>{products.length}</strong><span>carts to explore</span></div>
        <div><strong>{makes.length - 1}</strong><span>popular makes</span></div>
        <div><strong>Buy + rent</strong><span>one easy place</span></div>
        <p>We confirm current price and availability with every enquiry.</p>
      </section>

      <section className="inventory-section" id="inventory">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> THE CART COLLECTION</div>
            <h2>Choose your next <em>ride.</em></h2>
          </div>
          <p>Ready to make one yours, or just need a ride for a while?<br />Start with the option that fits.</p>
        </div>

        <div className="inventory-toolbar">
          <div className="mode-tabs" role="tablist" aria-label="Inventory type">
            <button
              type="button"
              className={mode === "sale" ? "mode-tab active" : "mode-tab"}
              onClick={() => setMode("sale")}
              id="buy-tab"
              aria-controls="buy-panel"
              role="tab"
              aria-selected={mode === "sale"}
            >Buy <span>{products.length}</span></button>
            <button
              type="button"
              className={mode === "rent" ? "mode-tab active" : "mode-tab"}
              onClick={() => setMode("rent")}
              id="rent-tab"
              aria-controls="rentals"
              role="tab"
              aria-selected={mode === "rent"}
            >Rent</button>
          </div>
          {mode === "sale" && (
            <div className="filter-controls">
              <label className="search-field">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="Search carts..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search golf carts"
                />
              </label>
              <label className="select-wrap">
                <span className="sr-only">Filter by make</span>
                <select value={make} onChange={(event) => setMake(event.target.value)}>
                  <option>All makes</option>
                  {makes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="select-wrap">
                <span className="sr-only">Filter by passenger capacity</span>
                <select value={seats} onChange={(event) => setSeats(event.target.value)}>
                  <option>Any seats</option>
                  <option value="2">2 seats</option>
                  <option value="4">4 seats</option>
                  <option value="6+ seats">6+ seats</option>
                </select>
              </label>
              <label className="select-wrap sort-select">
                <span className="sr-only">Sort listings</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {mode === "rent" ? (
          <div className="rental-panel" id="rentals" role="tabpanel" aria-labelledby="rent-tab" tabIndex={0}>
            <span className="empty-icon"><CartIcon /></span>
            <div className="rental-copy">
              <span className="eyebrow"><span /> RENTAL REQUESTS</span>
              <h3>Tell us when you need a ride.</h3>
              <p>Share your dates and group size. We&apos;ll check rental availability and get back to you before anything is booked.</p>
            </div>
            <button className="button button-dark" type="button" onClick={(event) => openInquiry({ kind: "rental" }, event.currentTarget)}>Request a rental booking <span aria-hidden="true">→</span></button>
          </div>
        ) : (
          <div id="buy-panel" role="tabpanel" aria-labelledby="buy-tab" tabIndex={0}>
            {filteredProducts.length ? (
              <>
                <div className="results-line">
                  <span><strong>{filteredProducts.length}</strong> carts found</span>
                  <span>Final price and availability confirmed by enquiry</span>
                </div>
                <div className="product-grid">
                  {filteredProducts.map((product, index) => (
                    <article className="product-card" key={product.id}>
                      <div className="product-image">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            loading={index === 0 ? "eager" : "lazy"}
                            sizes="(max-width: 680px) 90vw, (max-width: 1050px) 45vw, 30vw"
                          />
                        ) : <div className="image-placeholder"><CartIcon /></div>}
                        <span className="product-tag">ASK ABOUT AVAILABILITY</span>
                      </div>
                      <div className="product-info">
                        <div className="product-meta"><span>{getMake(product.name)}</span><span>{getSeats(product.name) ? `${getSeats(product.name)} PASSENGER` : "GOLF CART"}</span></div>
                        <h3>{product.name}</h3>
                        <a className="listing-link" href={product.url} target="_blank" rel="noreferrer">View dealer listing <span aria-hidden="true">↗</span></a>
                        <div className="product-footer">
                          <div><span className="price-label">CURRENT LISTED PRICE</span><strong>{formatPrice(product.price, product.currency)}</strong></div>
                          <button type="button" onClick={(event) => openInquiry({ kind: "purchase", product }, event.currentTarget)} aria-label={`Enquire to buy ${product.name}`}>Enquire to buy <span aria-hidden="true">→</span></button>
                        </div>
                      </div>
                      {index === 0 && <span className="featured-label">FRESH FIND</span>}
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><SearchIcon /></span>
                <h3>No carts match that search.</h3>
                <p>Try a different search or clear a filter to see more carts.</p>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => { setQuery(""); setMake("All makes"); setSeats("Any seats"); }}
                >Clear filters</button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="purchase-steps" id="how-it-works">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> SIMPLE FROM START TO FINISH</div>
            <h2>Pick your cart. <em>We&apos;ll take it from here.</em></h2>
          </div>
        </div>
        <div className="steps-grid">
          <article><span>01</span><h3>Choose a cart</h3><p>Browse models, compare prices, and find the seats and style that work for you.</p></article>
          <article><span>02</span><h3>Send an enquiry</h3><p>Tell us which cart you want to buy, or send your dates for a rental request.</p></article>
          <article><span>03</span><h3>Confirm the details</h3><p>We&apos;ll verify availability, answer your questions, and arrange the next steps together.</p></article>
        </div>
      </section>

      {inquiry && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeInquiry();
        }}>
          <section className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
            <button className="modal-close" type="button" onClick={closeInquiry} aria-label="Close enquiry form" autoFocus>×</button>
            <div className="eyebrow"><span /> {inquiry.kind === "rental" ? "RENTAL REQUEST" : "PURCHASE REQUEST"}</div>
            <h2 id="inquiry-title">{inquiry.kind === "rental" ? "Check rental availability." : "Enquire about this cart."}</h2>
            {inquiry.product && <p className="inquiry-product">{inquiry.product.name} <strong>{formatPrice(inquiry.product.price, inquiry.product.currency)}</strong></p>}
            <form onSubmit={submitInquiry}>
              <div className="form-grid">
                <label>Name<input name="name" autoComplete="name" required /></label>
                <label>Email<input name="email" type="email" autoComplete="email" required /></label>
                <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" /></label>
                {inquiry.kind === "rental" && (
                  <>
                    <label>Start date<input name="startDate" type="date" required /></label>
                    <label>End date<input name="endDate" type="date" required /></label>
                    <label>Passengers
                      <select name="passengers" defaultValue="2">
                        <option value="2">2 passengers</option>
                        <option value="4">4 passengers</option>
                        <option value="6">6 passengers</option>
                      </select>
                    </label>
                  </>
                )}
              </div>
              <label className="message-field">Anything else we should know?
                <textarea name="message" rows={3} />
              </label>
              {inquiryError && <p className="form-notice" role="status">{inquiryError}</p>}
              <button className="button button-dark submit-inquiry" type="submit">
                {inquiry.kind === "rental" ? "Send booking request" : "Send purchase enquiry"}
                <span aria-hidden="true">→</span>
              </button>
              <p className="form-footnote">This opens your email app; sending is not automatic and does not confirm a sale or rental booking.</p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
