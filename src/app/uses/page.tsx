import type { Metadata } from "next";
import Link from "next/link";
import { useCases } from "@/lib/use-cases";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Carts by Use",
  description: "Find golf cart options for golf courses, estates, resorts, businesses, private properties and events.",
  path: "/uses",
});

export default function UsesPage() {
  return (
    <main className="content-page locations-page">
      <div className="eyebrow"><span /> GOLF CARTS BY USE</div>
      <h1>Find the right cart for your setting.</h1>
      <p className="page-intro">Choose a use case, then share your passenger, route and location requirements with CartScout.</p>
      <section className="province-grid" aria-label="Golf carts by use">
        {useCases.map((useCase) => (
          <article className="province-card" key={useCase.slug}>
            <h2><Link href={`/uses/${useCase.slug}`}>{useCase.heading.replace(".", "")}</Link></h2>
            <p>{useCase.description}</p>
            <Link className="inline-link" href={`/uses/${useCase.slug}`}>Explore this use <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </section>
    </main>
  );
}
