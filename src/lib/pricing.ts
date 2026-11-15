export const passengerBudgetRanges = [
  { label: "2-seater carts", passengers: 2, minimum: 50000, maximum: 90000 },
  { label: "4-seater carts", passengers: 4, minimum: 90000, maximum: 150000 },
  { label: "6-seater carts", passengers: 6, minimum: 120000, maximum: 210000 },
] as const;

export function getSampleCatalogPrice(id: number, name: string) {
  const passengerMatch = name.match(/\b([2-8])\s*Passenger\b/i);
  const passengers = passengerMatch ? Number(passengerMatch[1]) : null;
  const range = passengers === 2
    ? passengerBudgetRanges[0]
    : passengers === 4
      ? passengerBudgetRanges[1]
      : passengers !== null && passengers >= 6
        ? passengerBudgetRanges[2]
        : { minimum: 50000, maximum: 210000 };
  const increment = 1000;
  const availablePrices = Math.floor((range.maximum - range.minimum) / increment) + 1;
  const stableOffset = Math.imul(Math.trunc(id), 0x9e3779b1) >>> 0;

  return range.minimum + (stableOffset % availablePrices) * increment;
}

export function formatZar(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
