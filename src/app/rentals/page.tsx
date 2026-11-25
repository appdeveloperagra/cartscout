import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RentalQuoteForm from "@/components/rental-quote-form";
import { getPublicContactSettings, getPublicFaqs, getPublicRentalRates } from "@/lib/cms";
import { formatZar } from "@/lib/pricing";
import { createPageMetadata, siteOrigin } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Golf Cart Hire in South Africa",
  description:
    "Rent golf carts from CartScout throughout South Africa. We deal in all makes and models, with nationwide delivery and collection.",
  path: "/rentals",
});

function RentalStructuredData({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const pageUrl = siteOrigin ? new URL("/rentals", siteOrigin).toString() : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...(pageUrl ? { "@id": pageUrl, url: pageUrl } : {}),
        name: "Golf Cart Hire & Rental Enquiries",
        description:
          "CartScout rents all makes and models of golf carts throughout South Africa, with delivery and collection arranged nationwide.",
        inLanguage: "en-ZA",
      },
      {
        "@type": "FAQPage",
        mainEntity: questions.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

async function RentalsContent() {
  const [rentalRates, rentalQuestions, contact] = await Promise.all([
    getPublicRentalRates(),
    getPublicFaqs("rental"),
    getPublicContactSettings(),
  ]);

  return (
    <main className="rental-page">
      <RentalStructuredData questions={rentalQuestions} />
      <section className="rental-hero" aria-labelledby="rental-title">
        <div className="rental-hero-copy">
          <div className="eyebrow"><span /> RENTALS NATIONWIDE</div>
          <h1 id="rental-title">Rent a golf cart anywhere in South Africa.</h1>
          <p>
            CartScout rents all makes and models throughout South Africa. Tell
            us when and where you need a cart, how many people will ride, and
            how many carts you need. We&apos;ll arrange delivery and confirm
            your request details.
          </p>
          <div className="rental-hero-actions">
            <a className="button button-dark" href="#rental-quote">
              Request a rental quote <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href={contact.phone_href}>Call {contact.phone_display}</a>
          </div>
          <p className="rental-hero-note">
            An enquiry is not a booking. Your rental is confirmed only after
            availability and terms are agreed.
          </p>
        </div>
        <aside className="rental-hero-card" aria-label="Rental enquiry checklist">
          <span className="rental-card-kicker">A CLEAR REQUEST STARTS HERE</span>
          <h2>Share the details that matter.</h2>
          <ul>
            <li>Your town or delivery address</li>
            <li>Preferred rental dates or duration</li>
            <li>Passenger count and number of carts</li>
            <li>How and where you plan to use them</li>
          </ul>
        </aside>
      </section>

      <section className="rental-capacities" aria-labelledby="rental-capacities-title">
        <div className="rental-section-heading">
          <div className="eyebrow"><span /> START WITH YOUR GROUP</div>
          <h2 id="rental-capacities-title">How many passengers?</h2>
          <p>
            Choose the passenger capacity that fits your group. We rent golf
            carts throughout South Africa; share your group size and location
            so we can help find the right option.
          </p>
        </div>
        <div className="rental-capacity-grid">
          <a className="rental-capacity-card" href="#rental-quote">
            <span className="rental-capacity-count">01–02</span>
            <strong>A couple or solo trip</strong>
            <span>For one or two passengers</span>
            <span className="rental-capacity-link">Ask about availability <span aria-hidden="true">→</span></span>
          </a>
          <a className="rental-capacity-card" href="#rental-quote">
            <span className="rental-capacity-count">03–04</span>
            <strong>Family or small group</strong>
            <span>For three or four passengers</span>
            <span className="rental-capacity-link">Ask about availability <span aria-hidden="true">→</span></span>
          </a>
          <a className="rental-capacity-card" href="#rental-quote">
            <span className="rental-capacity-count">05+</span>
            <strong>Larger group or event</strong>
            <span>Share your total passenger count</span>
            <span className="rental-capacity-link">Ask about availability <span aria-hidden="true">→</span></span>
          </a>
        </div>
      </section>

      <section className="rental-rates" aria-labelledby="rental-rates-title">
        <div className="rental-section-heading rental-rates-heading">
          <div className="eyebrow"><span /> PRICING</div>
          <h2 id="rental-rates-title">Golf cart rental rates.</h2>
          <p>
            Each rate shows whether delivery and collection are included.
            Share your address and dates with us to arrange your rental. Contact us for
            custom multi-cart pricing.
          </p>
        </div>
        <div className="rental-rates-table-wrap">
          <table className="rental-rates-table">
            <caption className="sr-only">Golf cart rental rates by vehicle type and rental period</caption>
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Daily</th>
                <th scope="col">Weekly</th>
                <th scope="col">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {rentalRates.map((rate) => (
                <tr key={rate.id ?? rate.name}>
                  <th scope="row">
                    {rate.name}
                    <span className="rental-rate-delivery">
                      {rate.includes_delivery ? "Delivery and collection included" : "Delivery and collection quoted separately"}
                    </span>
                  </th>
                  <td>{formatZar(rate.daily_price_zar)}</td>
                  <td>{formatZar(rate.weekly_price_zar)}</td>
                  <td>{formatZar(rate.monthly_price_zar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rental-quote-band" aria-labelledby="rental-pricing-title">
        <div>
          <div className="eyebrow"><span /> CUSTOM REQUESTS</div>
          <h2 id="rental-pricing-title">Need a tailored rental quote?</h2>
          <p>
            For multiple carts, a different rental period, or a specific
            location, send us your dates and requirements. We&apos;ll check
            availability and confirm the details before you decide.
          </p>
        </div>
        <a className="button button-light" href="#rental-quote">
          Request your quote <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className="rental-inclusions" aria-labelledby="rental-inclusions-title">
        <div className="rental-section-heading">
          <div className="eyebrow"><span /> BEFORE YOU ACCEPT</div>
          <h2 id="rental-inclusions-title">Know what your quote covers.</h2>
          <p>
            Inclusions can vary. Ask us to confirm each item for your request
            so there are no surprises.
          </p>
        </div>
        <div className="rental-inclusion-grid">
          <article>
            <span>01</span>
            <h3>Cart and accessories</h3>
            <p>Confirm the cart specifications, condition, charger, and any accessories included.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Transport arrangements</h3>
            <p>Check the rate table for delivery and collection inclusions. Share your address so we can confirm timing, access, and any quoted transport costs.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Rental terms and charges</h3>
            <p>Review the rental period, any deposit or additional charges, and the agreed terms before booking.</p>
          </article>
        </div>
      </section>

      <section className="rental-process" aria-labelledby="rental-process-title">
        <div className="rental-section-heading">
          <div className="eyebrow"><span /> HOW IT WORKS</div>
          <h2 id="rental-process-title">From enquiry to confirmed plans.</h2>
        </div>
        <ol className="rental-process-grid">
          <li>
            <span>01</span>
            <h3>Send your request</h3>
            <p>Share your dates, location, passenger count, quantity, and intended use.</p>
          </li>
          <li>
            <span>02</span>
            <h3>We check the details</h3>
            <p>Availability, suitability, transport arrangements, and costs are checked for your request.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Review your quote</h3>
            <p>Read the price, inclusions, and rental terms before deciding whether to proceed.</p>
          </li>
          <li>
            <span>04</span>
            <h3>Confirm the rental</h3>
            <p>A booking exists only once availability is confirmed and the rental terms are agreed.</p>
          </li>
        </ol>
      </section>

      <section className="rental-request" id="rental-quote" aria-labelledby="rental-form-title">
        <div className="rental-request-copy">
          <div className="eyebrow"><span /> START AN ENQUIRY</div>
          <h2 id="rental-form-title">Tell us what you need.</h2>
          <p>
            Complete the details and continue to WhatsApp or email. Send your
            request from your chosen app and our team will follow up.
          </p>
          <p className="rental-request-alternative">
            Prefer email? <a href={`mailto:${contact.email}?subject=Golf%20cart%20rental%20enquiry`}>{contact.email}</a>
          </p>
        </div>
        <RentalQuoteForm contactEmail={contact.email} whatsappHref={contact.whatsapp_href} />
      </section>

      <section className="rental-faq" aria-labelledby="rental-faq-title">
        <div className="eyebrow"><span /> RENTAL FAQ</div>
        <h2 id="rental-faq-title">Rental questions answered.</h2>
        <p className="rental-faq-intro">We serve rental customers nationwide. Include your location and request details so we can arrange delivery and collection.</p>
        <div className="home-faq-list">
          {rentalQuestions.map(({ question, answer }, index) => (
            <details className="home-faq-item" key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>
                {answer}
                {index === 0 && <> Explore the <Link href="/locations">location guides</Link>.</>}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="rental-final-cta" aria-labelledby="rental-final-cta-title">
        <div>
          <div className="eyebrow"><span /> READY WHEN YOU ARE</div>
          <h2 id="rental-final-cta-title">Let&apos;s check your rental request.</h2>
          <p>Share the details with us. We&apos;ll confirm what is possible before anything is booked.</p>
        </div>
        <div className="rental-final-actions">
          <a className="button button-dark" href="#rental-quote">Request a quote <span aria-hidden="true">↓</span></a>
          <a className="text-link" href={contact.phone_href}>Call {contact.phone_display}</a>
        </div>
      </section>
    </main>
  );
}

export default function RentalsPage() {
  return (
    <Suspense fallback={<main className="rental-page" role="status">Loading rental information...</main>}>
      <RentalsContent />
    </Suspense>
  );
}
