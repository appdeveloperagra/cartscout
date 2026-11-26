"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PriceGuide } from "@/components/price-guide";
import {
  getPassengerCapacity,
  getProductMake,
  parseCatalogSort,
  parseSeatFilter,
  type CatalogProduct,
  type CatalogSort,
  type SeatFilter,
} from "@/lib/products";
import { formatZar, getCatalogPriceZar } from "@/lib/pricing";

type CatalogProps = {
  products: CatalogProduct[];
  initialQuery: string;
  initialMake: string;
  initialSeats: SeatFilter;
  initialSort: CatalogSort;
  whatsappHref: string;
};

type Inquiry = {
  product: CatalogProduct;
};

function getCatalogMake(name: string) {
  return getProductMake(name) ?? "Other";
}

function updateCatalogUrl(
  query: string,
  make: string,
  seats: SeatFilter,
  sort: CatalogSort,
) {
  const params = new URLSearchParams(window.location.search);
  const values = {
    q: query.trim(),
    make: make === "All makes" ? "" : make,
    seats: seats === "Any seats" ? "" : seats === "6+ seats" ? "6plus" : seats,
    sort: sort === "featured" ? "" : sort,
  };

  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });

  const search = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`,
  );
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

export default function Catalog({
  products,
  initialQuery,
  initialMake,
  initialSeats,
  initialSort,
  whatsappHref,
}: CatalogProps) {
  const [query, setQuery] = useState(initialQuery);
  const [make, setMake] = useState(() =>
    products.some((product) => getCatalogMake(product.name) === initialMake)
      ? initialMake
      : "All makes",
  );
  const [seats, setSeats] = useState<SeatFilter>(initialSeats);
  const [sort, setSort] = useState<CatalogSort>(initialSort);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const inquiryTrigger = useRef<HTMLButtonElement | null>(null);
  const inquiryDialog = useRef<HTMLElement | null>(null);
  const wasInquiryOpen = useRef(false);

  const closeInquiry = useCallback(() => setInquiry(null), []);

  useEffect(() => {
    if (!inquiry) {
      if (wasInquiryOpen.current) {
        wasInquiryOpen.current = false;
        requestAnimationFrame(() => inquiryTrigger.current?.focus());
      }
      return;
    }
    wasInquiryOpen.current = true;

    const dialog = inquiryDialog.current;
    const focusableElements = dialog
      ? Array.from(dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ))
      : [];
    focusableElements[0]?.focus();

    function handleDialogKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeInquiry();
        return;
      }
      if (event.key !== "Tab" || focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const focusIsOutside = !dialog?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeydown);
    return () => document.removeEventListener("keydown", handleDialogKeydown);
  }, [closeInquiry, inquiry]);

  const makes = useMemo(
    () => [...new Set(products.map((product) => getCatalogMake(product.name)))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${getCatalogMake(product.name)}`.toLowerCase().includes(normalizedQuery);
      const matchesMake = make === "All makes" || getCatalogMake(product.name) === make;
      const productSeats = getPassengerCapacity(product.name);
      const matchesSeats =
        seats === "Any seats" ||
        (seats === "6+ seats" ? (productSeats ?? 0) >= 6 : productSeats === Number(seats));
      return matchesQuery && matchesMake && matchesSeats;
    });

    if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-asc") {
      filtered.sort((a, b) =>
        getCatalogPriceZar(a.price, a.currency) - getCatalogPriceZar(b.price, b.currency),
      );
    }
    if (sort === "price-desc") {
      filtered.sort((a, b) =>
        getCatalogPriceZar(b.price, b.currency) - getCatalogPriceZar(a.price, a.currency),
      );
    }
    return filtered;
  }, [make, products, query, seats, sort]);

  function openInquiry(product: CatalogProduct, trigger: HTMLButtonElement) {
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

    const body = [
      "Hi CartScout, I would like to enquire about buying a golf cart.",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Town or province: ${location || "Not provided"}`,
      `Cart: ${inquiry.product.name}`,
      `Indicative catalogue estimate: ${formatZar(getCatalogPriceZar(inquiry.product.price, inquiry.product.currency))}`,
      "",
      message || "Please share the delivery arrangements for my location.",
    ].join("\n");

    window.open(`${whatsappHref}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <section className="inventory-section">
        <div className="inventory-page-heading">
          <div className="eyebrow"><span /> FULL CART INVENTORY</div>
          <h1>Golf carts for sale.</h1>
          <p>
            CartScout deals in all makes and models, with sales and rentals throughout South Africa. Catalogue amounts are estimates for comparison, not confirmed offers; ask us for current pricing and delivery costs.
          </p>
        </div>
        <PriceGuide products={products} compact />
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> THE CART COLLECTION</div>
            <h2>Choose your next <em>ride.</em> <span className="inventory-count">{products.length} carts</span></h2>
          </div>
          <p>Search by make or passenger capacity, then ask us to confirm the details.</p>
        </div>

        <div className="inventory-toolbar">
          <div className="filter-controls">
              <label className="search-field">
                <SearchIcon />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    const nextQuery = event.target.value;
                    setQuery(nextQuery);
                    updateCatalogUrl(nextQuery, make, seats, sort);
                  }}
                  aria-label="Search golf carts"
                  placeholder="Search by make or model"
                />
              </label>
              <label className="select-wrap">
                <span className="sr-only">Filter by make</span>
                <select
                  value={make}
                  onChange={(event) => {
                    const nextMake = event.target.value;
                    setMake(nextMake);
                    updateCatalogUrl(query, nextMake, seats, sort);
                  }}
                >
                  <option>All makes</option>
                  {makes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="select-wrap">
                <span className="sr-only">Filter by passenger capacity</span>
                <select
                  value={seats}
                  onChange={(event) => {
                    const nextSeats = parseSeatFilter(event.target.value);
                    setSeats(nextSeats);
                    updateCatalogUrl(query, make, nextSeats, sort);
                  }}
                >
                  <option>Any seats</option>
                  <option value="2">2 seats</option>
                  <option value="4">4 seats</option>
                  <option value="6+ seats">6+ seats</option>
                </select>
              </label>
              <label className="select-wrap sort-select">
                <span className="sr-only">Sort carts</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    const nextSort = parseCatalogSort(event.target.value);
                    setSort(nextSort);
                    updateCatalogUrl(query, make, seats, nextSort);
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name: A to Z</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                </select>
              </label>
          </div>
        </div>

        {filteredProducts.length ? (
          <>
            <div className="results-line">
              <span><strong>{filteredProducts.length}</strong> carts found</span>
              <span>Sales and rentals available nationwide</span>
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
                                ) : <div className="product-image-empty" aria-hidden="true" />}
                        <span className="product-tag">ASK ABOUT AVAILABILITY</span>
                      </div>
                      <div className="product-info">
                        <div className="product-meta"><span>{getCatalogMake(product.name)}</span><span>{getPassengerCapacity(product.name) ? `${getPassengerCapacity(product.name)} PASSENGER` : "GOLF CART"}</span></div>
                        <h3>
                          {product.slug ? (
                            <Link href={`/${product.slug}`}>{product.name}</Link>
                          ) : product.name}
                        </h3>
                        {product.slug && (
                          <Link className="product-detail-link" href={`/${product.slug}`}>
                            View photos and details <span aria-hidden="true">→</span>
                          </Link>
                        )}
                        <div className="product-footer">
                          <div>
                            <span className="price-label">INDICATIVE ZAR ESTIMATE</span>
                            <strong>{formatZar(getCatalogPriceZar(product.price, product.currency))}</strong>
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
              onClick={() => {
                setQuery("");
                setMake("All makes");
                setSeats("Any seats");
                setSort("featured");
                updateCatalogUrl("", "All makes", "Any seats", "featured");
              }}
            >Clear filters</button>
          </div>
        )}

        <section className="rental-panel">
          <span className="empty-icon"><CartIcon /></span>
          <div className="rental-copy">
            <span className="eyebrow"><span /> LOOKING TO RENT?</span>
            <h3>Need a golf cart for rent?</h3>
            <p>We rent throughout South Africa. Share your dates, passenger count, and location to get started.</p>
          </div>
          <Link className="button button-dark" href="/rentals">Explore rental options <span aria-hidden="true">→</span></Link>
        </section>
      </section>

      {inquiry && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeInquiry();
        }}>
          <section
            className="inquiry-modal"
            ref={inquiryDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-title"
          >
            <button className="modal-close" type="button" onClick={closeInquiry} aria-label="Close enquiry form">×</button>
            <div className="eyebrow"><span /> PURCHASE REQUEST</div>
            <h2 id="inquiry-title">Enquire about this cart.</h2>
            <p className="inquiry-product">{inquiry.product.name}</p>
            <p className="form-footnote">Include your town so we can arrange delivery for your purchase.</p>
            <form onSubmit={submitInquiry}>
              <div className="form-grid">
                <label>Name<input name="name" autoComplete="name" required /></label>
                <label>Email<input name="email" type="email" autoComplete="email" required /></label>
                <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" /></label>
                <label>Town or province (optional)<input name="location" autoComplete="address-level2" /></label>
              </div>
              <label className="message-field">Anything else we should know?
                <textarea name="message" rows={3} />
              </label>
              <button className="button button-dark submit-inquiry" type="submit">
                Continue to WhatsApp
                <span aria-hidden="true">→</span>
              </button>
              <p className="form-footnote">WhatsApp opens with your purchase enquiry ready. Tap Send to contact CartScout.</p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
