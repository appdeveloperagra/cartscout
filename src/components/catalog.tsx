"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { contactEmail } from "@/lib/contact";
import { PriceGuide } from "@/components/price-guide";
import { parseSeatFilter, type CatalogProduct, type SeatFilter } from "@/lib/products";
import { formatZar, getSampleCatalogPrice } from "@/lib/pricing";

type CatalogProps = {
  products: CatalogProduct[];
  initialSeats: SeatFilter;
};

type Inquiry = {
  product: CatalogProduct;
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

export default function Catalog({ products, initialSeats }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("All makes");
  const [seats, setSeats] = useState<SeatFilter>(initialSeats);
  const [sort, setSort] = useState("featured");
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

    if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [make, products, query, seats, sort]);

  function openInquiry(product: CatalogProduct, trigger: HTMLButtonElement) {
    setInquiryError("");
    inquiryTrigger.current = trigger;
    setInquiry({ product });
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inquiry) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    if (!contactEmail) {
      setInquiryError("Enquiry email is not configured yet. Set NEXT_PUBLIC_CONTACT_EMAIL before launch.");
      return;
    }

    const subject = `Golf cart purchase enquiry: ${inquiry.product.name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Town or province: ${location || "Not provided"}`,
      `Cart: ${inquiry.product.name}`,
      "",
      message || "Please provide the current price in ZAR, confirm availability, and advise whether delivery can be arranged.",
    ].join("\n");

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setInquiryError("Your email app should open with this request. Send the email to complete your enquiry.");
  }

  return (
    <main>
      <section className="inventory-section">
        <div className="inventory-page-heading">
          <div className="eyebrow"><span /> FULL CART INVENTORY</div>
          <h1>Golf carts for sale.</h1>
          <p>
            Browse dealer listings with sample ZAR prices. These amounts are random placeholders, not confirmed offers or Merchant Center prices; confirm local stock, delivery, and the actual price before proceeding.
          </p>
        </div>
        <PriceGuide compact />
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> THE CART COLLECTION</div>
            <h2>Choose your next <em>ride.</em> <span className="inventory-count">{products.length} listings</span></h2>
          </div>
          <p>Search by make or passenger capacity, then ask us to confirm the details.</p>
        </div>

        <div className="inventory-toolbar">
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
                <select value={seats} onChange={(event) => setSeats(parseSeatFilter(event.target.value))}>
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
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
          </div>
        </div>

        {filteredProducts.length ? (
          <>
            <div className="results-line">
              <span><strong>{filteredProducts.length}</strong> carts found</span>
              <span>Local price and availability confirmed by enquiry</span>
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
                        <a className="listing-link" href={product.url} target="_blank" rel="noreferrer">View source listing <span aria-hidden="true">↗</span></a>
                        <div className="product-footer">
                          <div>
                            <span className="price-label">ZAR PRICE</span>
                            <strong>{formatZar(getSampleCatalogPrice(product.id, product.name))}</strong>
                          </div>
                          <button type="button" onClick={(event) => openInquiry(product, event.currentTarget)} aria-label={`Enquire to buy ${product.name}`}>Enquire to buy <span aria-hidden="true">→</span></button>
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

        <section className="rental-panel">
          <span className="empty-icon"><CartIcon /></span>
          <div className="rental-copy">
            <span className="eyebrow"><span /> LOOKING TO RENT?</span>
            <h3>Rental enquiries have their own page.</h3>
            <p>Share your preferred dates, passenger count, and location so availability can be confirmed.</p>
          </div>
          <Link className="button button-dark" href="/rentals">Explore rental options <span aria-hidden="true">→</span></Link>
        </section>
      </section>

      {inquiry && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeInquiry();
        }}>
          <section className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
            <button className="modal-close" type="button" onClick={closeInquiry} aria-label="Close enquiry form" autoFocus>×</button>
            <div className="eyebrow"><span /> PURCHASE REQUEST</div>
            <h2 id="inquiry-title">Enquire about this cart.</h2>
            <p className="inquiry-product">{inquiry.product.name}</p>
            <p className="form-footnote">Include your town so the current ZAR price and any delivery arrangements can be checked.</p>
            <form onSubmit={submitInquiry}>
              <div className="form-grid">
                <label>Name<input name="name" autoComplete="name" required /></label>
                <label>Email<input name="email" type="email" autoComplete="email" required /></label>
                <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" /></label>
                <label>Town or province (optional)<input name="location" autoComplete="address-level2" placeholder="e.g. Pretoria, Gauteng" /></label>
              </div>
              <label className="message-field">Anything else we should know?
                <textarea name="message" rows={3} placeholder="Ask for a price in ZAR and include any delivery questions." />
              </label>
              {inquiryError && <p className="form-notice" role="status">{inquiryError}</p>}
              <button className="button button-dark submit-inquiry" type="submit">
                Send purchase enquiry
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
