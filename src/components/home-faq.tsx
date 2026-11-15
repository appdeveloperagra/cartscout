import Link from "next/link";

const questions = [
  {
    question: "Where do the golf cart listings come from?",
    answer:
      "The catalog is imported from public Mullens Golf Carts listings. Product details, prices, and availability can change, so check the dealer listing and confirm the latest information with CartScout.",
  },
  {
    question: "What currency are the displayed prices in?",
    answer:
      "The current catalog prices are shown in USD, matching the source listings. Confirm the final price and any applicable charges before proceeding.",
  },
  {
    question: "Does an enquiry reserve a cart?",
    answer:
      "No. An enquiry does not reserve a cart or create an order. Availability, final price, and arrangements must be confirmed separately.",
  },
  {
    question: "How do I enquire about a cart?",
    answer:
      "Select “Enquire to buy” on a product card. The form prepares an email in your email app; you must send it to complete the enquiry.",
  },
  {
    question: "Can I book a rental online?",
    answer:
      "The website does not confirm rental bookings. Availability is checked manually after you send your preferred dates, passenger count, and location.",
  },
];

export function HomeFaq() {
  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      <div className="eyebrow"><span /> QUICK ANSWERS</div>
      <h2 id="home-faq-title">Frequently asked questions</h2>
      <p className="home-faq-intro">Useful details about listings, enquiries, and rental requests.</p>
      <div className="home-faq-list">
        {questions.map(({ question, answer }, index) => (
          <details className="home-faq-item" key={question} open={index === 0}>
            <summary>{question}</summary>
            <p>
              {answer}
              {index === 3 && <> Browse <Link href="/inventory">the full inventory</Link>.</>}
              {index === 4 && <> Visit <Link href="/rentals">rental requests</Link>.</>}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
