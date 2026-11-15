import Catalog, { type CatalogProduct } from "@/components/catalog";
import inventory from "@/data/products.json";

export default function Home() {
  return <Catalog products={inventory.products as CatalogProduct[]} />;
}
