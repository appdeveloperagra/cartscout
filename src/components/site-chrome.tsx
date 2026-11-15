import Link from "next/link";
import {
  contactEmail,
  contactPhoneDisplay,
  contactPhoneHref,
  whatsappHref,
} from "@/lib/contact";
import { provinces } from "@/lib/provinces";

function CartIcon() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true">
      <path d="M7 4h22a4 4 0 0 1 4 4v13H7z" />
      <path d="M33 12h6l4 6v3H33zM4 23h39" />
      <circle cx="13" cy="25" r="4" />
      <circle cx="36" cy="25" r="4" />
    </svg>
  );
}

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

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="CartScout home">
          <span className="brand-mark"><CartIcon /></span>
          <span>cart<span className="brand-accent">scout</span></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/inventory">Buy</Link>
          <Link href="/rentals">Rentals</Link>
          <details className="locations-nav">
            <summary>Locations</summary>
            <div className="locations-menu">
              <Link className="locations-menu-index" href="/locations">All locations</Link>
              {provinces.map(({ slug, name }) => (
                <Link href={`/locations/${slug}`} key={slug}>{name}</Link>
              ))}
            </div>
          </details>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <a className="header-link" href={contactPhoneHref}>
          <PhoneIcon />
          <span>{contactPhoneDisplay}</span>
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-about">
          <Link className="brand footer-brand" href="/" aria-label="CartScout home">
            <span className="brand-mark"><CartIcon /></span>
            <span>cart<span className="brand-accent">scout</span></span>
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
          <a className="footer-contact-link" href={contactPhoneHref}>
            <PhoneIcon />
            <span>{contactPhoneDisplay}</span>
          </a>
          <a className="footer-contact-link" href={whatsappHref} target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            <span>WhatsApp us</span>
          </a>
          <a className="footer-contact-link" href={`mailto:${contactEmail}`}>
            <EmailIcon />
            <span>{contactEmail}</span>
          </a>
        </div>
        <nav className="footer-group" aria-label="Policies">
          <h2>Information</h2>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© CartScout</span>
        <span>Prices and availability are confirmed before any purchase or rental is agreed.</span>
      </div>
    </footer>
  );
}

export function FloatingContactLinks() {
  return (
    <aside className="floating-contact" aria-label="Contact CartScout">
      <a className="floating-contact-link floating-call" href={contactPhoneHref} aria-label={`Call CartScout at ${contactPhoneDisplay}`} title="Call CartScout">
        <PhoneIcon />
      </a>
      <a className="floating-contact-link floating-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`Chat with CartScout on WhatsApp at ${contactPhoneDisplay}`} title="Chat on WhatsApp">
        <WhatsAppIcon />
      </a>
    </aside>
  );
}
