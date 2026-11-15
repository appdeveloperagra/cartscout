import type { Metadata } from "next";
import { contactEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for browsing CartScout listings and sending purchase or rental enquiries.",
};

export default function TermsPage() {
  return (
    <main className="content-page legal-page">
      <div className="eyebrow"><span /> LEGAL</div>
      <h1>Terms of use</h1>
      <p className="page-intro">These terms explain the current purpose and limits of the CartScout website.</p>

      <section>
        <h2>Listings and prices</h2>
        <p>
          Product information in the catalog is sourced from public Mullens Golf Carts listings. Details, listed prices, currency, and availability may change or contain errors. Follow the source listing and confirm all details before relying on them.
        </p>
      </section>
      <section>
        <h2>Enquiries are not orders or bookings</h2>
        <p>
          CartScout does not accept payment through this website. Sending an email, calling, or messaging us does not create a purchase, reserve a cart, or confirm a rental. A sale or rental proceeds only after availability, final price, applicable charges, and terms are confirmed separately and accepted by the parties.
        </p>
      </section>
      <section>
        <h2>Rental requests</h2>
        <p>
          Rental availability is checked manually. Dates, location, passenger capacity, rates, deposits, insurance, delivery, eligibility, and cancellation terms must be confirmed before a rental is accepted. Do not treat an enquiry as a reservation.
        </p>
      </section>
      <section>
        <h2>External services</h2>
        <p>
          Links to dealer listings, email, telephone, and WhatsApp services are provided for convenience. Those services are operated by third parties and may have separate terms.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to <a className="inline-link" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
      <p className="small-print">
        These general website terms do not replace a purchase agreement or rental contract. Have them reviewed for the business&apos;s legal name, location, and applicable law before launch.
      </p>
    </main>
  );
}
