import { getPassengerCapacity, type CatalogProduct } from "@/lib/products";
import { formatZar, getCatalogPriceZar, usdToZarRate, usdToZarRateAsOf } from "@/lib/pricing";

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
        .filter((product) => matches(getPassengerCapacity(product.name)))
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
        <div className="eyebrow"><span /> CURRENT LISTING PRICES</div>
        <h2 id="price-guide-title">Golf cart prices by passenger capacity</h2>
        <p>
          Current listing prices by passenger capacity, converted from USD at R{usdToZarRate} per USD ({usdToZarRateAsOf}) and rounded to whole rand.
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
