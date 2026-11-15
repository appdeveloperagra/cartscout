import type { Metadata } from "next";
import Link from "next/link";
import { provinces } from "@/lib/provinces";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart Locations in South Africa",
  description:
    "Explore golf cart information for all nine South African provinces. Browse current listings or ask CartScout to confirm purchase and rental availability for your location.",
  path: "/locations",
});

export default function LocationsPage() {
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
        Explore information for all nine provinces. Each guide highlights major
        towns, possible golf-cart uses, and the details to check before you
        enquire. Choose a province to get started.
      </p>
      <p className="location-disclaimer">
        These guides are regional information, not a promise of local stock,
        delivery coverage, or rental availability. Confirm arrangements for
        your exact location with CartScout.
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
