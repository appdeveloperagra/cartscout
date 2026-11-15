import Link from "next/link";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "About",
  description: "Learn how CartScout helps you explore golf cart listings and ask about rental availability.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="content-page">
      <div className="eyebrow"><span /> ABOUT CARTSCOUT</div>
      <h1>A simpler way to find your next ride.</h1>
      <p className="page-intro">
        CartScout brings golf cart listings and rental enquiries together in one place. Browse, ask questions, and confirm the details before you decide.
      </p>

      <section className="content-card-grid" aria-label="How CartScout works">
        <article className="content-card">
          <span className="content-card-number">01</span>
          <h2>Explore listings</h2>
          <p>Review the cart details and listed price, then follow the source listing to check the latest information.</p>
        </article>
        <article className="content-card">
          <span className="content-card-number">02</span>
          <h2>Ask about a purchase</h2>
          <p>Send an enquiry about a specific cart. Price, stock, specifications, delivery, and sale arrangements must be confirmed.</p>
        </article>
        <article className="content-card">
          <span className="content-card-number">03</span>
          <h2>Request a rental</h2>
          <p>Tell us your preferred dates and passenger count. Rental availability is checked manually and is not reserved by submitting an enquiry.</p>
        </article>
      </section>

      <section className="content-note">
        <h2>Clear information matters</h2>
        <p>
          The current purchase catalog is sourced from public listings on Mullens Golf Carts. Product details, prices, and availability may change; use the dealer listing and contact CartScout to confirm them before proceeding. This website does not take payment or confirm a sale or rental booking.
        </p>
      </section>
      <Link className="button button-dark page-cta" href="/contact">Get in touch <span aria-hidden="true">→</span></Link>
    </main>
  );
}
