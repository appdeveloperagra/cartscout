import type { Metadata } from "next";
import Link from "next/link";
import RentalQuoteForm from "@/components/rental-quote-form";
import { contactEmail, contactPhoneDisplay, contactPhoneHref, whatsappHref } from "@/lib/contact";
import { createPageMetadata, siteOrigin } from "@/lib/site-seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Golf Cart Hire in South Africa",
    description:
      "Request a golf cart hire quote in South Africa. Share your dates and location to check rental availability, price, and delivery arrangements.",
    path: "/rentals",
  }),
};

const rentalQuestions = [
  {
    question: "Which areas can I request golf cart hire in?",
    answer:
      "Send your exact town or delivery address and CartScout will check whether arrangements can be made. The locations pages are regional guides, not confirmation of delivery coverage.",
  },
  {
    question: "How much does golf cart hire cost?",
    answer:
      "There are no fixed rental rates published on this page. Request a quote with your dates, location, passenger count, and number of carts so availability and applicable costs can be confirmed.",
  },
  {
    question: "Can I hire for a day, a week, or longer?",
    answer:
      "Include your preferred dates and rental duration in the request. Available periods, rates, and terms are confirmed individually before you decide.",
  },
  {
    question: "Is the cart booked when I send a request?",
    answer:
      "No. A WhatsApp message, call, or email is only an enquiry. Your rental is not booked until CartScout confirms availability and you agree to the quote and rental terms.",
  },
  {
    question: "Can I request carts for an event or group?",
    answer:
      "You can include the number of carts, passenger needs, location, dates, and intended use in your enquiry. CartScout will check whether the request can be accommodated.",
  },
  {
    question: "What is included in the rental price?",
    answer:
      "Inclusions, delivery or collection arrangements, any additional costs, and rental conditions must be confirmed in your quote before you accept it.",
  },
];

function RentalStructuredData() {
  const pageUrl = siteOrigin ? new URL("/rentals", siteOrigin).toString() : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...(pageUrl ? { "@id": pageUrl, url: pageUrl } : {}),
        name: "Golf Cart Hire & Rental Enquiries",
        description:
          "Request golf cart hire and ask CartScout to confirm availability, quote details, and arrangements for your location.",
        inLanguage: "en-ZA",
      },
      {
        "@type": "FAQPage",
        mainEntity: rentalQuestions.map(({ question, answer }) => ({
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

export default function RentalsPage() {
  return (
    <main className="rental-page">
      <RentalStructuredData />
      <section className="rental-hero" aria-labelledby="rental-title">
        <div className="rental-hero-copy">
          <div className="eyebrow"><span /> RENTAL ENQUIRIES</div>
          <h1 id="rental-title">Request golf cart hire in South Africa.</h1>
          <p>
            Tell us when and where you need a cart, how many people will ride,
            and how many carts you are looking for. We&apos;ll check the request
            and confirm availability and pricing before you decide.
          </p>
          <div className="rental-hero-actions">
            <a className="button button-dark" href="#rental-quote">
              Request a rental quote <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href={contactPhoneHref}>Call {contactPhoneDisplay}</a>
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
            These are planning categories, not a list of confirmed rental
            vehicles. Tell us your group size and we&apos;ll check what may suit
            your request.
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

      <section className="rental-quote-band" aria-labelledby="rental-pricing-title">
        <div>
          <div className="eyebrow"><span /> PRICING</div>
          <h2 id="rental-pricing-title">Get a quote for your dates and location.</h2>
          <p>
            Rental prices are not published as fixed rates. Ask for a quote
            based on your preferred dates, rental duration, location, and
            number of carts. Request the quote in ZAR and confirm delivery or
            collection costs and rental terms before accepting.
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
            <p>Check whether delivery and collection can be arranged for your exact address and what they cost.</p>
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
            Complete the details and choose email or WhatsApp. Review the
            prepared message and send it to contact CartScout.
          </p>
          <p className="rental-request-alternative">
            Prefer email? <a href={`mailto:${contactEmail}?subject=Golf%20cart%20rental%20enquiry`}>{contactEmail}</a>
          </p>
        </div>
        <RentalQuoteForm contactEmail={contactEmail} whatsappHref={whatsappHref} />
      </section>

      <section className="rental-faq" aria-labelledby="rental-faq-title">
        <div className="eyebrow"><span /> RENTAL FAQ</div>
        <h2 id="rental-faq-title">Rental questions answered.</h2>
        <p className="rental-faq-intro">If you have a question about a specific location or request, include it in your enquiry.</p>
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
          <a className="text-link" href={contactPhoneHref}>Call {contactPhoneDisplay}</a>
        </div>
      </section>
    </main>
  );
}
