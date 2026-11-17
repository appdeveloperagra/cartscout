import { Suspense } from "react";
import { getPublicContactSettings } from "@/lib/cms";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "Terms of Use",
  description: "Terms for browsing CartScout's golf cart collection and sending purchase or rental enquiries.",
  path: "/terms",
});

async function TermsContent() {
  const contact = await getPublicContactSettings();

  return (
    <main className="content-page legal-page">
      <div className="eyebrow"><span /> LEGAL</div>
      <h1>Terms of use</h1>
      <p className="page-intro">These terms explain the current purpose and limits of the CartScout website.</p>

      <section>
        <h2>Our catalogue and prices</h2>
        <p>
          Catalogue prices are displayed in whole-rand ZAR after conversion from the listed USD price using the exchange rate shown on the inventory page. Prices and availability can change; the written sale quote will state the agreed price and any applicable delivery or other charges.
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
          CartScout&apos;s email, telephone, and WhatsApp contact options are provided for convenience. These services may be operated by third parties and may have separate terms.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to <a className="inline-link" href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </section>
      <p className="small-print">
        These general website terms do not replace a purchase agreement or rental contract. Have them reviewed for the business&apos;s legal name, location, and applicable law before launch.
      </p>
    </main>
  );
}

export default function TermsPage() {
  return (
    <Suspense fallback={<main className="content-page" role="status">Loading terms information...</main>}>
      <TermsContent />
    </Suspense>
  );
}
