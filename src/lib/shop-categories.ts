import type { CatalogSort, SeatFilter } from "@/lib/products";

export type ShopCategory = {
  slug: string;
  title: string;
  heading: string;
  description: string;
  make: string;
  seats: SeatFilter;
  sort: CatalogSort;
};

export type ProductCategory = {
  slug: string;
  name: string;
  description: string;
  displayOrder: number;
  isRuleBased: boolean;
};

export const shopCategories: ShopCategory[] = [
  { slug: "electric-golf-carts", title: "Electric Golf Carts for Sale in South Africa", heading: "Electric golf carts.", description: "Browse golf carts classified with an electric powertrain. Confirm the exact model's battery, specifications, availability and delivery arrangements with CartScout.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "2-seater-golf-carts", title: "2-Seater Golf Carts for Sale in South Africa", heading: "2-seater golf carts.", description: "Browse golf carts with a recorded capacity of two passengers. Confirm the exact configuration and included equipment before purchase.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "4-seater-golf-carts", title: "4-Seater Golf Carts for Sale in South Africa", heading: "4-seater golf carts.", description: "Compare golf carts recorded with a four-passenger capacity. Ask CartScout to confirm each model's configuration and availability.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "6-seater-golf-carts", title: "6-Seater Golf Carts for Sale in South Africa", heading: "6-seater golf carts.", description: "Explore golf carts recorded with a six-passenger capacity. Confirm seating configuration, specifications and delivery arrangements for each cart.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "gas-golf-carts", title: "Gas Golf Carts for Sale in South Africa", heading: "Gas golf carts.", description: "Browse golf carts classified with a gas powertrain. Confirm the exact engine, condition, availability and delivery arrangements with CartScout.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "lithium-golf-carts", title: "Lithium Golf Carts for Sale in South Africa", heading: "Lithium golf carts.", description: "Browse carts recorded with a lithium battery. Confirm battery condition, charger, warranty and powertrain details for the specific cart.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "club-car", title: "Club Car Golf Carts for Sale in South Africa", heading: "Club Car golf carts.", description: "Explore catalogue listings identified as Club Car. Confirm the exact model, specifications, availability and delivery arrangements.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "e-z-go", title: "E-Z-GO Golf Carts for Sale in South Africa", heading: "E-Z-GO golf carts.", description: "Explore catalogue listings identified as E-Z-GO. Confirm the exact model, specifications, availability and delivery arrangements.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "yamaha", title: "Yamaha Golf Carts for Sale in South Africa", heading: "Yamaha golf carts.", description: "Browse catalogue listings identified as Yamaha. Confirm the exact model, specifications, availability and delivery arrangements.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "denago", title: "Denago Golf Carts for Sale in South Africa", heading: "Denago golf carts.", description: "Browse catalogue listings identified as Denago. Confirm the exact model, specifications, availability and delivery arrangements.", make: "All makes", seats: "Any seats", sort: "featured" },
  { slug: "evolution", title: "Evolution Golf Carts for Sale in South Africa", heading: "Evolution golf carts.", description: "Browse catalogue listings identified as Evolution. Confirm the exact model, specifications, availability and delivery arrangements.", make: "All makes", seats: "Any seats", sort: "featured" },
];

export function getFallbackProductCategories(): ProductCategory[] {
  return shopCategories.map((category, index) => ({
    slug: category.slug,
    name: category.heading.replace(/\.$/, ""),
    description: category.description,
    displayOrder: index,
    isRuleBased: true,
  }));
}

export function getShopCategory(
  slug: string,
  categories: ProductCategory[] = getFallbackProductCategories(),
) {
  const category = categories.find((item) => item.slug === slug);
  if (!category) return undefined;

  const curatedCategory = shopCategories.find((item) => item.slug === slug);
  if (curatedCategory) return curatedCategory;

  return {
    slug: category.slug,
    title: `${category.name} for Sale in South Africa`,
    heading: `${category.name}.`,
    description: category.description || `Browse golf carts in the ${category.name.toLowerCase()} collection.`,
    make: "All makes",
    seats: "Any seats" as SeatFilter,
    sort: "featured" as CatalogSort,
  };
}
