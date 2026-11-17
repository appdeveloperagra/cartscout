import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublicServiceAreas } from "@/lib/cms";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart Sales & Hire by Province",
  description:
    "CartScout sells and rents golf carts throughout all nine South African provinces. Explore all makes and models and arrange nationwide delivery.",
  path: "/locations",
});

async function LocationsContent() {
  const provinces = await getPublicServiceAreas();

  return (
    <main className="content-page locations-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li aria-current="page">Locations</li>
        </ol>
      </nav>
      <div className="eyebrow"><span /> SOUTH AFRICA</div>
      <h1>Golf cart locations</h1>
      <p className="page-intro">
        CartScout is a golf cart dealership serving every province in South
        Africa. We deal in all makes and models for sale and rent, with
        nationwide delivery and collection.
      </p>
      <p className="location-disclaimer">
        Whether you are buying or renting, contact us from anywhere in South
        Africa. Share your location and requirements so we can arrange the
        right cart, delivery, and collection.
      </p>
      <section className="province-grid" aria-label="Golf cart guides by province">
        {provinces.map((province) => (
          <article className="province-card" key={province.slug}>
            <div className="eyebrow"><span /> PROVINCE GUIDE</div>
            <h2><Link href={`/locations/${province.slug}`}>{province.name}</Link></h2>
            <p>{province.overview}</p>
            <p className="province-card-towns">{province.towns.join(" · ")}</p>
            <Link className="inline-link" href={`/locations/${province.slug}`}>
              Explore {province.name} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function LocationsPage() {
  return (
    <Suspense fallback={<main className="content-page locations-page" role="status">Loading locations...</main>}>
      <LocationsContent />
    </Suspense>
  );
}
