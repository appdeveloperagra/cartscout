import Link from "next/link";
import { FAQStructuredData } from "@/components/faq-structured-data";
import { getPublicFaqs } from "@/lib/cms";

export async function HomeFaq() {
  const homeFaqs = (await getPublicFaqs("general")).slice(0, 7);

  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      <FAQStructuredData questions={homeFaqs} />
      <div className="eyebrow"><span /> QUICK ANSWERS</div>
      <h2 id="home-faq-title">Golf cart FAQs</h2>
      <p className="home-faq-intro">Answers about ZAR prices, buying, and rental requests.</p>
      <div className="home-faq-list">
        {homeFaqs.map(({ question, answer }, index) => (
          <details className="home-faq-item" key={question} open={index === 0}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <p className="faq-all-link">
        <Link className="inline-link" href="/faq">See all golf cart FAQs <span aria-hidden="true">→</span></Link>
      </p>
    </section>
  );
}
