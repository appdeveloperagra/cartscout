import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUseCase, useCases } from "@/lib/use-cases";
import { createPageMetadata } from "@/lib/site-seo";

type UseCaseProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return useCases.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: UseCaseProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};
  return createPageMetadata({ title: useCase.title, description: useCase.description, path: `/uses/${useCase.slug}` });
}

export default async function UseCasePage({ params }: UseCaseProps) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  return (
    <main className="content-page location-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/uses">Uses</Link></li>
          <li aria-current="page">{useCase.heading.replace(".", "")}</li>
        </ol>
      </nav>
      <div className="eyebrow"><span /> GOLF CARTS BY USE</div>
      <h1>{useCase.heading}</h1>
      <p className="page-intro">{useCase.overview}</p>
      {useCase.sections.map((section) => (
        <section className="location-section" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      <section className="location-section">
        <h2>Details to include in an enquiry</h2>
        <ul className="location-use-list">
          {useCase.considerations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section className="location-cta">
        <div>
          <h2>Compare available carts</h2>
          <p>Share your location, passenger count and route so CartScout can confirm which listings may fit your requirements.</p>
        </div>
        <div className="page-actions">
          <Link className="button button-dark" href="/shop">Browse the shop <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/rent">Ask about hire <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
