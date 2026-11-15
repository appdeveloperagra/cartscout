import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const endpoint =
  "https://mullensgolfcarts.com/wp-json/wc/store/v1/products";
const sourceUrl = "https://mullensgolfcarts.com/shop/";
const perPage = 100;
const products = new Map();
let totalPages = 1;

for (let page = 1; page <= totalPages; page += 1) {
  const url = new URL(endpoint);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  url.searchParams.set("search", "golf cart");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(
      `Mullens inventory request failed (${response.status} ${response.statusText})`,
    );
  }

  const pageProducts = await response.json();
  if (!Array.isArray(pageProducts)) {
    throw new Error("Mullens inventory response was not a product list.");
  }

  const pageCount = Number(response.headers.get("x-wp-totalpages"));
  if (page === 1) {
    if (!Number.isInteger(pageCount) || pageCount < 1) {
      throw new Error("Mullens inventory response did not include valid pagination.");
    }
    totalPages = pageCount;
  }

  for (const product of pageProducts) {
    if (!/golf carts?/i.test(product.name) || !/for sale/i.test(product.name)) continue;

    const minorUnit = Number(product.prices?.currency_minor_unit ?? 2);
    const minorPrice = Number(product.prices?.price);
    if (
      !Number.isInteger(product.id) ||
      typeof product.name !== "string" ||
      typeof product.permalink !== "string" ||
      !Number.isFinite(minorPrice) ||
      !Number.isInteger(minorUnit)
    ) {
      throw new Error(`Mullens product ${product.id ?? "(unknown)"} is missing catalog fields.`);
    }

    products.set(product.id, {
      id: product.id,
      name: product.name,
      price: minorPrice / 10 ** minorUnit,
      currency: product.prices.currency_code || "USD",
      url: product.permalink,
      imageUrl: product.images?.[0]?.src || null,
      inStock: Boolean(product.is_in_stock),
    });
  }
}

if (products.size === 0) {
  throw new Error("Mullens inventory import returned no golf cart listings.");
}

const output = {
  generatedAt: new Date().toISOString(),
  source: sourceUrl,
  products: [...products.values()],
};

const outputPath = join(process.cwd(), "src", "data", "products.json");
await mkdir(join(process.cwd(), "src", "data"), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Imported ${products.size} golf carts into ${outputPath}`);
