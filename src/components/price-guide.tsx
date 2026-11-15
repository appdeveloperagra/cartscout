import { formatZar, passengerBudgetRanges } from "@/lib/pricing";

type PriceGuideProps = {
  compact?: boolean;
};

export function PriceGuide({ compact = false }: PriceGuideProps) {
  return (
    <section
      className={`price-guide${compact ? " price-guide-compact" : ""}`}
      aria-labelledby="price-guide-title"
    >
      <div className="price-guide-heading">
        <div className="eyebrow"><span /> SOUTH AFRICAN PRICE GUIDE</div>
        <h2 id="price-guide-title">Golf cart budget ranges in ZAR</h2>
        <p>Use these passenger-capacity ranges for early budgeting, then request a current local quote.</p>
      </div>
      <div className="price-guide-grid">
        {passengerBudgetRanges.map(({ label, minimum, maximum }) => (
          <article className="price-guide-card" key={label}>
            <span>{label}</span>
            <strong>{formatZar(minimum)} – {formatZar(maximum)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
