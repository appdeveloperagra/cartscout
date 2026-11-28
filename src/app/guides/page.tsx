import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Electric Golf Cart Buying & Rental Guides",
  description: "Practical golf cart buying, rental, battery and South Africa location guides from CartScout.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <main className="content-page blog-page">
      <div className="eyebrow"><span /> CARTSCOUT GUIDES</div>
      <h1>Electric golf cart guides.</h1>
      <p className="page-intro">Practical advice for buying, renting and using golf carts in South Africa.</p>
      <div className="blog-grid">
        {guides.map((guide) => (
          <article className="blog-card" key={guide.slug}>
            <h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2>
            <p>{guide.description}</p>
            <Link className="inline-link" href={`/guides/${guide.slug}`}>Read guide <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </div>
    </main>
  );
}
