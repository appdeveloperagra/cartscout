"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LocationsMenu from "@/components/locations-menu";
import { PhoneIcon, WhatsAppIcon } from "@/components/contact-icons";

type LocationLink = {
  slug: string;
  name: string;
};

type MainNavigationProps = {
  locations: LocationLink[];
  phoneHref: string;
  phoneDisplay: string;
  whatsappHref: string;
};

export default function MainNavigation({
  locations,
  phoneHref,
  phoneDisplay,
  whatsappHref,
}: MainNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setIsOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function closeNavigation() {
    setIsOpen(false);
  }

  return (
    <nav aria-label="Main navigation" className="main-nav" ref={navigationRef}>
      <button
        aria-controls="main-navigation-links"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close main navigation" : "Open main navigation"}
        className="main-nav-toggle"
        onClick={() => setIsOpen((open) => !open)}
        ref={toggleRef}
        type="button"
      >
        <span className="main-nav-toggle-icon" aria-hidden="true"><span /><span /><span /></span>
      </button>
      <div className={`main-nav-links${isOpen ? " is-open" : ""}`} id="main-navigation-links">
        <Link href="/shop" aria-current={pathname === "/shop" || pathname.startsWith("/shop/") ? "page" : undefined} onClick={closeNavigation}>Shop</Link>
        <Link href="/rent" aria-current={pathname === "/rent" || pathname === "/rentals" ? "page" : undefined} onClick={closeNavigation}>Rent</Link>
        <Link href="/guides" aria-current={pathname === "/guides" || pathname.startsWith("/guides/") ? "page" : undefined} onClick={closeNavigation}>Guides</Link>
        <LocationsMenu
          locations={locations}
          onNavigate={closeNavigation}
        />
        <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined} onClick={closeNavigation}>Contact</Link>
        <a
          className="mobile-nav-contact"
          href={phoneHref}
          onClick={closeNavigation}
          aria-label={`Call CartScout at ${phoneDisplay}`}
          title={`Call ${phoneDisplay}`}
        >
          <PhoneIcon />
          <span>{phoneDisplay}</span>
        </a>
        <a
          className="mobile-nav-contact"
          href={whatsappHref}
          onClick={closeNavigation}
          rel="noreferrer"
          target="_blank"
          aria-label={`Chat with CartScout on WhatsApp at ${phoneDisplay}`}
          title={`WhatsApp ${phoneDisplay}`}
        >
          <WhatsAppIcon />
          <span>{phoneDisplay}</span>
        </a>
      </div>
    </nav>
  );
}
