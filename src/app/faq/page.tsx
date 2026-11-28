import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FAQStructuredData } from "@/components/faq-structured-data";
import { createPageMetadata } from "@/lib/site-seo";
import { getPublicFaqs } from "@/lib/cms";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart FAQs: Prices, Buying & Hire",
  description:
    "Answers about golf cart prices, specifications, purchase and rental enquiries.",
  path: "/faq",
});

async function FAQContent() {
  const faqs = await getPublicFaqs("general");

  return (
    <main className="content-page faq-page">
      <FAQStructuredData questions={faqs} />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li aria-current="page">FAQs</li>
        </ol>
      </nav>
      <div className="eyebrow"><span /> BUYING, PRICES & RENTALS</div>
      <h1>Golf cart questions answered</h1>
      <p className="page-intro">
        Practical answers about comparing golf carts and confirming purchase, rental and delivery details.
      </p>
      <section className="faq-page-list" aria-label="Golf cart frequently asked questions">
        {faqs.map(({ question, answer }, index) => (
          <details className="home-faq-item" key={question} open={index === 0}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <div className="faq-page-cta">
        <p>Need details for a specific cart or rental request?</p>
        <Link className="button button-dark" href="/shop">Browse our golf carts <span aria-hidden="true">→</span></Link>
        <Link className="text-link" href="/rent">Ask about a rental <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}

export default function FAQPage() {
  return (
    <Suspense fallback={<main className="content-page faq-page" role="status">Loading FAQs...</main>}>
      <FAQContent />
    </Suspense>
  );
}
