import Link from "next/link";
import { contactEmail, whatsappHref } from "@/lib/contact";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "Golf Cart Rentals",
  description: "Request golf cart rental availability from CartScout. Share your dates, passenger count, and rental location for confirmation.",
  path: "/rentals",
});

const rentalMessage = encodeURIComponent(
  "Hi CartScout, I would like to ask about golf cart rental availability. My preferred dates are __ and my location is __. We are __ passengers.",
);

export default function RentalsPage() {
  return (
    <main className="content-page">
      <div className="eyebrow"><span /> RENTAL REQUESTS</div>
      <h1>Need a cart for a while?</h1>
      <p className="page-intro">
        Send your preferred dates, passenger count, and location. We&apos;ll check availability and follow up with the details.
      </p>

      <section className="content-note">
        <h2>Before you request</h2>
        <p>
          Rental availability is confirmed manually. A call, email, or WhatsApp message is only an enquiry; your rental is not booked until CartScout confirms it and you agree to the rental terms.
        </p>
      </section>
      <div className="page-actions">
        <a className="button button-dark" href={`${whatsappHref}?text=${rentalMessage}`} target="_blank" rel="noreferrer">
          Ask on WhatsApp <span aria-hidden="true">→</span>
        </a>
        <a className="text-link" href={`mailto:${contactEmail}?subject=Golf%20cart%20rental%20enquiry`}>
          Email a rental enquiry <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className="small-print">Include dates, passenger count, and rental location. Availability and all applicable charges will be confirmed before a booking is accepted.</p>
      <Link className="inline-link" href="/contact">View all contact options</Link>
    </main>
  );
}
