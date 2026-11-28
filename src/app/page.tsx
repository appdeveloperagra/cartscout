import { Suspense } from "react";
import { createPageMetadata } from "@/lib/site-seo";
import HomePage from "@/components/home-page";
import { getPublicProducts } from "@/lib/cms";

export const metadata = createPageMetadata({
  title: "Electric Golf Carts for Sale & Hire in South Africa",
  description:
    "Browse electric golf carts by make, passenger capacity and recorded battery type. Confirm product specifications, availability, pricing, rentals and delivery with CartScout.",
  path: "/",
});

async function HomeContent() {
  const products = await getPublicProducts();
  return <HomePage products={products} totalProductCount={products.length} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="home-page-loading route-loading" role="status">
          <span>Loading CartScout...</span>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
