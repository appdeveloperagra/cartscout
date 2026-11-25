import Image from "next/image";
import Link from "next/link";
import MainNavigation from "@/components/main-navigation";
import { getPublicContactSettings, getPublicServiceAreas } from "@/lib/cms";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h3l2 5-2.2 1.8a15 15 0 0 0 4.4 4.4L16 12l5 2v3c0 1.1-.9 2-2 2C10.7 19 5 13.3 5 6c0-1.7.7-3 2-3Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.8a8.2 8.2 0 1 1 16-3.5Z" />
      <path d="M8.2 7.7c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.4.7 1.1 1.4 1.8 1.8.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.3.6-.1.6-.5 1.2-1 1.5-.5.4-1.2.5-2 .3-1-.3-2.2-.9-3.4-2.1-1.1-1.1-1.8-2.4-2-3.3-.2-.8 0-1.5.4-2Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export async function SiteHeader() {
  const [locations, contact] = await Promise.all([
    getPublicServiceAreas(),
    getPublicContactSettings(),
  ]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="CartScout home">
          <Image
            className="brand-logo"
            src="/cartscout-logo.png"
            alt=""
            width={536}
            height={82}
            priority
          />
        </Link>
        <MainNavigation
          locations={locations.map(({ slug, name }) => ({ slug, name }))}
          phoneHref={contact.phone_href}
          phoneDisplay={contact.phone_display}
          whatsappHref={contact.whatsapp_href}
        />
        <a className="header-link" href={contact.phone_href}>
          <PhoneIcon />
          <span>{contact.phone_display}</span>
        </a>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const contact = await getPublicContactSettings();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-about">
          <Link className="brand footer-brand" href="/" aria-label="CartScout home">
            <Image
              className="brand-logo"
              src="/cartscout-logo.png"
              alt=""
              width={536}
              height={82}
            />
          </Link>
          <p>Find a ride for wherever the day takes you.</p>
        </div>
        <nav className="footer-group" aria-label="Explore">
          <h2>Explore</h2>
          <Link href="/inventory">Shop carts</Link>
          <Link href="/rentals">Rental requests</Link>
          <Link href="/locations">Locations by province</Link>
          <Link href="/about">About CartScout</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-group">
          <h2>Get in touch</h2>
          <a className="footer-contact-link" href={contact.phone_href}>
            <PhoneIcon />
            <span>{contact.phone_display}</span>
          </a>
          <a className="footer-contact-link" href={contact.whatsapp_href} target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            <span>WhatsApp us</span>
          </a>
          <a className="footer-contact-link" href={`mailto:${contact.email}`}>
            <EmailIcon />
            <span>{contact.email}</span>
          </a>
        </div>
        <nav className="footer-group" aria-label="Policies">
          <h2>Information</h2>
          <Link href="/faq">Golf cart FAQs</Link>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© CartScout</span>
        <span>Here&apos;s to finding the right ride for your next adventure.</span>
      </div>
    </footer>
  );
}

export async function FloatingContactLinks() {
  const contact = await getPublicContactSettings();

  return (
    <aside className="floating-contact" aria-label="Contact CartScout">
      <a className="floating-contact-link floating-call" href={contact.phone_href} aria-label={`Call CartScout at ${contact.phone_display}`} title="Call CartScout">
        <PhoneIcon />
      </a>
      <a className="floating-contact-link floating-whatsapp" href={contact.whatsapp_href} target="_blank" rel="noreferrer" aria-label={`Chat with CartScout on WhatsApp at ${contact.phone_display}`} title="Chat on WhatsApp">
        <WhatsAppIcon />
      </a>
    </aside>
  );
}
