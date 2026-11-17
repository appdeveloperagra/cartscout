import Link from "next/link";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "About CartScout",
  description:
    "CartScout is a golf cart dealership for all makes and models, selling and renting throughout South Africa.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <div className="eyebrow"><span /> ABOUT CARTSCOUT</div>
          <h1 id="about-title">Your nationwide golf cart dealership.</h1>
          <p>
            We deal in all makes and models of golf carts. CartScout sells and
            rents throughout South Africa, helping you find a cart for your
            business, venue, or personal use.
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
            Browse our golf cart collection, review the rental rate guide, and
            tell us what you&apos;re looking for.
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
            As a golf cart dealership, we offer a wide range of makes and
            models for sale and rent. Tell us where in South Africa you are
            and how you plan to use the cart so our team can help.
          </p>
          <p>
            We aim to make the next steps clear. Contact us to confirm current
            availability, final pricing, delivery, and rental arrangements for
            your needs.
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
            <h3>Shop our golf cart collection</h3>
            <p>
              Explore our carts and contact CartScout about a specific model,
              its listed price, specifications, availability, and delivery
              arrangements.
            </p>
            <Link href="/inventory">Browse the inventory <span aria-hidden="true">→</span></Link>
          </article>
          <article className="about-option-card">
            <span className="about-option-number">02 / RENTAL</span>
            <h3>Plan a golf cart rental</h3>
            <p>
              Review the daily, weekly, and monthly rental rates, then send your
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
            CartScout offers the golf carts shown in our collection. Listed prices are
            displayed in whole-rand ZAR, converted from the catalogue USD price
            using the rate shown on the inventory page.
          </p>
          <p>
            Review the daily, weekly, and monthly rental rates.
            Send your location and dates so availability and the details of
            your request can be confirmed.
          </p>
        </div>
        <ul className="about-principles">
          <li><span>01</span><div><strong>Confirm availability</strong><p>Contact CartScout for current availability and details about a specific cart.</p></div></li>
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
