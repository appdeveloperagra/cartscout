export type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  currency: string;
  url: string;
  imageUrl: string | null;
  inStock: boolean;
};

export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
