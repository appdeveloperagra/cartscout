import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";
import { createPageMetadata, siteOrigin } from "@/lib/site-seo";

type GuideProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: GuideProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return createPageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });
}

export default async function GuidePage({ params }: GuideProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const pageUrl = siteOrigin ? new URL(`/guides/${guide.slug}`, siteOrigin).toString() : undefined;

  return (
    <main className="content-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        ...(pageUrl ? { "@id": pageUrl, url: pageUrl } : {}),
        headline: guide.title,
        description: guide.description,
        inLanguage: "en-ZA",
      }).replace(/</g, "\\u003c") }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/guides">Guides</Link></li>
          <li aria-current="page">{guide.heading.replace(".", "")}</li>
        </ol>
      </nav>
      <div className="eyebrow"><span /> BUYING GUIDE</div>
      <h1>{guide.heading}</h1>
      <p className="page-intro">{guide.intro}</p>
      {guide.sections.map((section) => (
        <section className="location-section" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      <section className="location-cta">
        <div>
          <h2>Need help choosing or renting?</h2>
          <p>Tell CartScout the passenger count, intended use, location and preferred dates.</p>
        </div>
        <div className="page-actions">
          <Link className="button button-dark" href="/shop">Browse carts <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/rent">Request a rental <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
