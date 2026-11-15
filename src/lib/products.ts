export type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  currency: string;
  url: string;
  imageUrl: string | null;
  inStock: boolean;
};

export type SeatFilter = "Any seats" | "2" | "4" | "6+ seats";

export function parseSeatFilter(value: string | string[] | undefined): SeatFilter {
  if (value === "2" || value === "4" || value === "6+ seats") return value;
  if (value === "6plus") return "6+ seats";
  return "Any seats";
}
