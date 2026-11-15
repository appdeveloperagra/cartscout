import Link from "next/link";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "About CartScout",
  description:
    "Learn how CartScout helps people in South Africa explore golf cart listings, compare options, and ask about rental availability.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <div className="eyebrow"><span /> ABOUT CARTSCOUT</div>
          <h1 id="about-title">Golf cart choices, made clearer.</h1>
          <p>
            Whether you&apos;re considering a cart to buy or looking into a
            rental, CartScout gives you one place to explore your options and
            start the conversation in South Africa.
          </p>
          <div className="about-hero-actions">
            <Link className="button button-dark" href="/inventory">Explore carts <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/rentals">Explore rental options</Link>
          </div>
        </div>
        <aside className="about-hero-card">
          <span className="about-card-kicker">A PRACTICAL PLACE TO START</span>
          <h2>Explore first. Confirm the details before you decide.</h2>
          <p>
            Browse purchase listings, check the rental rate guide, and send us
            the details of what you&apos;re looking for.
          </p>
          <Link href="/contact">Talk to CartScout <span aria-hidden="true">→</span></Link>
        </aside>
      </section>

      <section className="about-purpose" aria-labelledby="about-purpose-title">
        <div className="about-section-label">
          <div className="eyebrow"><span /> OUR PURPOSE</div>
          <h2 id="about-purpose-title">A helpful first step, without the guesswork.</h2>
        </div>
        <div className="about-purpose-copy">
          <p>
            Finding a golf cart can mean comparing different models, passenger
            sizes, prices, and rental needs. CartScout brings those starting
            points together so you can narrow down what to ask about.
          </p>
          <p>
            We aim to be clear about what the website can show and what still
            needs checking. Listings and guide prices are not a promise of
            current stock, a final quote, or a confirmed booking.
          </p>
        </div>
      </section>

      <section className="about-options" aria-labelledby="about-options-title">
        <div className="about-section-heading">
          <div className="eyebrow"><span /> WHAT YOU CAN DO HERE</div>
          <h2 id="about-options-title">Two ways to get started.</h2>
          <p>Choose the path that fits what you have in mind.</p>
        </div>
        <div className="about-options-grid">
          <article className="about-option-card">
            <span className="about-option-number">01 / PURCHASE</span>
            <h3>Explore golf cart listings</h3>
            <p>
              Browse the catalogue and follow a listing to its dealer source.
              Ask about the specific cart and confirm its current price,
              specifications, stock, and delivery arrangements before
              proceeding.
            </p>
            <Link href="/inventory">Browse the inventory <span aria-hidden="true">→</span></Link>
          </article>
          <article className="about-option-card">
            <span className="about-option-number">02 / RENTAL</span>
            <h3>Plan a golf cart rental</h3>
            <p>
              Review the daily, weekly, and monthly rate guide, then send your
              dates, group size, and location. Availability and arrangements
              must be checked for each request.
            </p>
            <Link href="/rentals">View rental rates <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

      <section className="about-transparency" aria-labelledby="about-transparency-title">
        <div>
          <div className="eyebrow"><span /> HOW WE WORK</div>
          <h2 id="about-transparency-title">Useful information. Clear next steps.</h2>
          <p>
            CartScout&apos;s purchase catalogue is based on public listings from
            Mullens Golf Carts. The ZAR amounts shown on cart cards are sample
            planning figures, not dealer prices or confirmed offers. Check the
            original listing and ask for current details.
          </p>
          <p>
            Rental rates are shown as a guide for the listed rental periods.
            Send your location and dates so availability and the details of
            your request can be confirmed.
          </p>
        </div>
        <ul className="about-principles">
          <li><span>01</span><div><strong>Check the source</strong><p>Dealer listings can change; confirm details with the source and CartScout.</p></div></li>
          <li><span>02</span><div><strong>Ask for the specifics</strong><p>Confirm price, availability, delivery, inclusions, and terms for your request.</p></div></li>
          <li><span>03</span><div><strong>Decide when you&apos;re ready</strong><p>An enquiry is only a conversation. It does not create an order or reserve a rental.</p></div></li>
        </ul>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title">
        <div>
          <div className="eyebrow"><span /> YOUR NEXT STEP</div>
          <h2 id="about-contact-title">Have a cart or rental in mind?</h2>
          <p>Tell us what you&apos;re looking for, and include the details that will help us check your enquiry.</p>
        </div>
        <div className="about-contact-actions">
          <Link className="button button-dark" href="/contact">Contact CartScout <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/locations">Browse location guides</Link>
        </div>
      </section>
    </main>
  );
}
