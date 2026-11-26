import { Suspense } from "react";
import { createPageMetadata } from "@/lib/site-seo";
import HomePage from "@/components/home-page";
import { getPublicProducts } from "@/lib/cms";

export const metadata = createPageMetadata({
  title: "Golf Cart Dealership | Sales & Rentals Nationwide",
  description:
    "CartScout is a golf cart dealership for all makes and models, selling and renting throughout South Africa. Contact our team for sales, rentals, and delivery.",
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
