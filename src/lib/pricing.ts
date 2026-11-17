export const usdToZarRate = 16.943;
export const usdToZarRateAsOf = "2026-11-16";

export function getCatalogPriceZar(price: number, currency: string) {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Catalog price must be a non-negative number.");
  }

  if (currency === "ZAR") return Math.round(price);
  if (currency === "USD") return Math.round(price * usdToZarRate);

  throw new Error(`Unsupported catalog currency: ${currency}`);
}

export function formatZar(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
