import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublicServiceAreas } from "@/lib/cms";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart Location Guides",
  description:
    "Browse South African province guides for golf cart purchase and rental enquiries. Confirm availability and delivery arrangements for your address.",
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
      <h1>Golf cart location guides</h1>
      <p className="page-intro">
        Choose a province to review golf cart considerations and example
        destinations. Ask CartScout to confirm whether sales, rental, delivery
        or collection can be arranged for your exact address.
      </p>
      <p className="location-disclaimer">
        Coverage, availability, delivery costs and timing are confirmed for
        each request; a location guide is not a guarantee of service.
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
