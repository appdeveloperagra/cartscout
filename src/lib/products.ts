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
};

export type SeatFilter = "Any seats" | "2" | "4" | "6+ seats";

export function createProductSlug(name: string, identifier: number | string) {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${baseSlug || "golf-cart"}-${identifier}`;
}

export function getPassengerCapacity(name: string) {
  const match = name.match(/\b([2-8])\s*Passenger/i);
  return match ? Number(match[1]) : null;
}

export function parseSeatFilter(value: string | string[] | undefined): SeatFilter {
  if (value === "2" || value === "4" || value === "6+ seats") return value;
  if (value === "6plus") return "6+ seats";
  return "Any seats";
}
