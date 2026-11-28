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
  passengerCapacity?: number | null;
  powertrain?: Powertrain | null;
  batteryType?: BatteryType | null;
  categorySlugs?: string[];
  attributes?: Record<string, string | number>;
};

export type Powertrain = "electric" | "gas" | "other";
export type BatteryType = "lithium" | "lead-acid" | "other";
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
  const capacity = getCatalogPassengerCapacity(product);
  const powertrain = getCatalogPowertrain(product);
  const details = [
    capacity ? `${capacity}-passenger` : "",
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

function getAttributeValue(product: CatalogProduct, key: string) {
  const value = product.attributes?.[key];
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getCatalogPassengerCapacity(product: CatalogProduct) {
  const attribute = product.attributes?.passenger_capacity;
  const capacityFromAttribute =
    typeof attribute === "number"
      ? attribute
      : typeof attribute === "string" && /^\d+$/.test(attribute.trim())
        ? Number(attribute)
        : null;
  const capacity = product.passengerCapacity ?? capacityFromAttribute ?? getPassengerCapacity(product.name);
  return capacity !== null && Number.isSafeInteger(capacity) && capacity > 0 ? capacity : null;
}

export function getCatalogPowertrain(product: CatalogProduct): Powertrain | null {
  const value = product.powertrain ?? getAttributeValue(product, "powertrain");
  if (value === "electric" || value === "gas" || value === "other") return value;
  if (/\b(gas|petrol)\b/i.test(value)) return "gas";
  if (/\b(electric)\b/i.test(value)) return "electric";
  if (/\b(gas|petrol)\b/i.test(product.name)) return "gas";
  if (/\b(electric|lithium)\b|\bli[- ]?ion\b/i.test(product.name)) return "electric";
  return null;
}

export function getCatalogBatteryType(product: CatalogProduct): BatteryType | null {
  const value = product.batteryType ?? getAttributeValue(product, "battery_type");
  if (value === "lithium" || value === "lead-acid" || value === "other") return value;
  if (/\b(lithium)\b|\bli[- ]?ion\b/i.test(value)) return "lithium";
  if (/\blead[- ]?acid\b/i.test(value)) return "lead-acid";
  if (/\b(lithium)\b|\bli[- ]?ion\b/i.test(product.name)) return "lithium";
  if (/\blead[- ]?acid\b/i.test(product.name)) return "lead-acid";
  return null;
}

export function getDerivedCategorySlugs(product: CatalogProduct) {
  const categories: string[] = [];
  const capacity = getCatalogPassengerCapacity(product);
  const powertrain = getCatalogPowertrain(product);
  const batteryType = getCatalogBatteryType(product);
  const make = getProductMake(product.name)?.toLowerCase();

  if (powertrain === "electric") categories.push("electric-golf-carts");
  if (powertrain === "gas") categories.push("gas-golf-carts");
  if (batteryType === "lithium") categories.push("lithium-golf-carts");
  if (capacity === 2) categories.push("2-seater-golf-carts");
  if (capacity === 4) categories.push("4-seater-golf-carts");
  if (capacity === 6) categories.push("6-seater-golf-carts");
  if (make === "club car") categories.push("club-car");
  if (make === "e-z-go") categories.push("e-z-go");
  if (make === "yamaha") categories.push("yamaha");
  if (make === "denago") categories.push("denago");
  if (make === "evolution") categories.push("evolution");

  return categories;
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
