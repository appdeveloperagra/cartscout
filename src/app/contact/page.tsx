import {
  contactEmail,
  contactPhoneDisplay,
  contactPhoneHref,
  whatsappHref,
} from "@/lib/contact";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact CartScout by phone, WhatsApp, or email about golf cart purchases and rental enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="content-page">
      <div className="eyebrow"><span /> CONTACT</div>
      <h1>Let&apos;s talk carts.</h1>
      <p className="page-intro">
        Ask about a listed golf cart or tell us what you need for a rental. We&apos;ll help confirm the details before you make a decision.
      </p>

      <section className="contact-card-grid" aria-label="Contact options">
        <a className="contact-card" href={contactPhoneHref}>
          <span className="contact-card-label">CALL</span>
          <strong>{contactPhoneDisplay}</strong>
          <span>Call CartScout</span>
        </a>
        <a className="contact-card" href={whatsappHref} target="_blank" rel="noreferrer">
          <span className="contact-card-label">WHATSAPP</span>
          <strong>Chat with us</strong>
          <span>Opens WhatsApp in a new tab</span>
        </a>
        <a className="contact-card" href={`mailto:${contactEmail}`}>
          <span className="contact-card-label">EMAIL</span>
          <strong>{contactEmail}</strong>
          <span>Send a purchase or rental enquiry</span>
        </a>
      </section>

      <section className="content-note">
        <h2>What to include</h2>
        <p>
          For a purchase enquiry, include the cart name. For a rental request, include your preferred dates, passenger count, and location so availability can be checked.
        </p>
        <p className="small-print">
          Email enquiries open your email app; they are not sent automatically. A message or call is not a confirmed order or rental booking.
        </p>
      </section>
    </main>
  );
}
