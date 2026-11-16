import {
  contactEmail,
  contactPhoneDisplay,
  contactPhoneHref,
  whatsappHref,
} from "@/lib/contact";
import ContactForm from "@/components/contact-form";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact CartScout, a South African golf cart dealership selling and renting all makes and models nationwide.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="content-page">
      <div className="eyebrow"><span /> CONTACT</div>
      <h1>Let&apos;s talk carts.</h1>
      <p className="page-intro">
        We sell and rent all makes and models of golf carts throughout South Africa. Call, WhatsApp, email, or tell us what you need using the form below.
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

      <section className="contact-form-section" aria-labelledby="contact-form-title">
        <div className="contact-form-grid">
          <div>
            <h2 id="contact-form-title">Send us a message</h2>
            <p className="contact-form-intro">
              Share the cart or rental details you have in mind, and our team will be in touch.
            </p>
            <ContactForm />
          </div>
          <aside className="contact-address-card" aria-labelledby="contact-address-title">
            <span className="contact-card-label">BUSINESS ADDRESS</span>
            <h2 id="contact-address-title">Visit CartScout</h2>
            <address className="contact-address">
              135 Rivonia Road<br />
              Sandton (Sandown / Central Sandton)<br />
              City of Johannesburg Metropolitan Municipality<br />
              Gauteng<br />
              2196<br />
              South Africa
            </address>
          </aside>
        </div>
      </section>
    </main>
  );
}
