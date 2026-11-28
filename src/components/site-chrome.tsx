import Image from "next/image";
import Link from "next/link";
import MainNavigation from "@/components/main-navigation";
import { getPublicContactSettings, getPublicServiceAreas } from "@/lib/cms";
import { EmailIcon, PhoneIcon, WhatsAppIcon } from "@/components/contact-icons";

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
          <Link href="/shop">Shop carts</Link>
          <Link href="/rent">Rental requests</Link>
          <Link href="/uses">Golf carts by use</Link>
          <Link href="/guides">Buying guides</Link>
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
