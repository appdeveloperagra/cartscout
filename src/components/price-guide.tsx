import { getCatalogPassengerCapacity, type CatalogProduct } from "@/lib/products";
import { formatZar, getCatalogPriceZar } from "@/lib/pricing";

type PriceGuideProps = {
  products: CatalogProduct[];
  compact?: boolean;
};

const capacityGroups = [
  { label: "2-seater carts", matches: (capacity: number | null) => capacity === 2 },
  { label: "4-seater carts", matches: (capacity: number | null) => capacity === 4 },
  { label: "6+ seater carts", matches: (capacity: number | null) => capacity !== null && capacity >= 6 },
];

export function PriceGuide({ products, compact = false }: PriceGuideProps) {
  const priceRanges = capacityGroups
    .map(({ label, matches }) => {
      const prices = products
        .filter((product) => matches(getCatalogPassengerCapacity(product)))
        .map((product) => getCatalogPriceZar(product.price, product.currency));
      if (prices.length === 0) return null;

      return {
        label,
        minimum: Math.min(...prices),
        maximum: Math.max(...prices),
      };
    })
    .filter((range) => range !== null);

  return (
    <section
      className={`price-guide${compact ? " price-guide-compact" : ""}`}
      aria-labelledby="price-guide-title"
    >
      <div className="price-guide-heading">
        <div className="eyebrow"><span /> PRICE ESTIMATES</div>
        <h2 id="price-guide-title">Golf cart prices by passenger capacity</h2>
        <p>
          These ranges are for comparison only, not confirmed CartScout offers. Ask us for current local pricing, availability, and delivery costs.
        </p>
      </div>
      <div className="price-guide-grid">
        {priceRanges.map(({ label, minimum, maximum }) => (
          <article className="price-guide-card" key={label}>
            <span>{label}</span>
            <strong>
              {formatZar(minimum)}
              {minimum !== maximum ? ` – ${formatZar(maximum)}` : ""}
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}
