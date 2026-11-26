export type CatalogProduct = {
  id: number | string;
  slug?: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  url: string;
  imageUrl: string | null;
  imageGallery?: string[];
  inStock: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  attributes?: Record<string, string | number>;
};

export type SeatFilter = "Any seats" | "2" | "4" | "6+ seats";
export type CatalogSort = "featured" | "name" | "price-asc" | "price-desc";

export function normalizeCatalogName(name: string) {
  return name
    .replace(/&#215;/gi, "x")
    .replace(/\s+Golf Carts?.*$/gi, "")
    .replace(/\s+Golf Cart.*$/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*$/, "")
    .trim();
}

export function createProductTitle(name: string, variant?: string) {
  const capacity = getPassengerCapacity(name);
  const model = normalizeCatalogName(name)
    .replace(/\([^)]*\)/g, "")
    .replace(/\b[2-8](?:\s*Passenger|-Seater)\b/gi, "")
    .replace(/\b(Electric|Lithium(?:-Ion)?|Lifted|HP|Gas)\b/gi, "")
    .replace(/\b(Special Edition|Limited Edition|Sunday Red|Forward-Facing|Plus)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return `${model}${capacity ? ` ${capacity}-Seater` : ""}${variant ? ` ${variant}` : ""} Golf Cart`;
}

export function createCatalogDescription(product: CatalogProduct) {
  const capacityAttribute = product.attributes?.passenger_capacity;
  const capacityFromAttributes =
    typeof capacityAttribute === "number"
      ? capacityAttribute
      : typeof capacityAttribute === "string" && /^\d+$/.test(capacityAttribute.trim())
        ? Number(capacityAttribute)
        : null;
  const capacity = getPassengerCapacity(product.name) ?? capacityFromAttributes;
  const hasValidCapacity = capacity !== null && Number.isSafeInteger(capacity) && capacity > 0;
  const powertrainAttribute = product.attributes?.powertrain;
  const powertrain =
    typeof powertrainAttribute === "string" ? powertrainAttribute.trim().toLowerCase() : "";
  const details = [
    hasValidCapacity ? `${capacity}-passenger` : "",
    powertrain,
  ].filter(Boolean);
  const description = details.length
    ? `The ${product.name} is listed as a ${details.join(" ")} golf cart.`
    : `The ${product.name} is part of CartScout's golf cart collection.`;

  return `${description} Ask our team to confirm the specific cart's condition, included equipment, current availability, final price, and delivery arrangements for your location.`;
}

export function getProductMake(name: string) {
  const match = name.match(
    /\b(Club Car|E-Z-GO|EZGO|Yamaha|Evolution|Icon|Tomberlin|Star EV|Denago|Advanced EV|Bintelli|Garia)\b/i,
  );
  if (!match) return null;
  return /^ezgo$/i.test(match[0]) ? "E-Z-GO" : match[0];
}

export function createProductSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "golf-cart";
}

export function getPassengerCapacity(name: string) {
  const match = name.match(/\b([2-8])(?:\s*Passenger|-Seater)\b/i);
  return match ? Number(match[1]) : null;
}

export function parseSeatFilter(value: string | string[] | undefined): SeatFilter {
  if (value === "2" || value === "4" || value === "6+ seats") return value;
  if (value === "6plus") return "6+ seats";
  return "Any seats";
}

export function parseCatalogSort(value: string | string[] | undefined): CatalogSort {
  const sort = Array.isArray(value) ? value[0] : value;
  if (sort === "name" || sort === "price-asc" || sort === "price-desc") return sort;
  return "featured";
}
