"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LocationsMenu from "@/components/locations-menu";

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
        <span>{isOpen ? "Close" : "Menu"}</span>
      </button>
      <div className={`main-nav-links${isOpen ? " is-open" : ""}`} id="main-navigation-links">
        <Link href="/" onClick={closeNavigation}>Home</Link>
        <Link href="/inventory" onClick={closeNavigation}>Buy</Link>
        <Link href="/rentals" onClick={closeNavigation}>Rentals</Link>
        <Link href="/blog" onClick={closeNavigation}>Journal</Link>
        <LocationsMenu
          locations={locations}
          onNavigate={closeNavigation}
        />
        <Link href="/about" onClick={closeNavigation}>About</Link>
        <Link href="/contact" onClick={closeNavigation}>Contact</Link>
        <a className="mobile-nav-contact" href={phoneHref} onClick={closeNavigation}>
          Call {phoneDisplay}
        </a>
        <a
          className="mobile-nav-contact"
          href={whatsappHref}
          onClick={closeNavigation}
          rel="noreferrer"
          target="_blank"
        >
          WhatsApp us
        </a>
      </div>
    </nav>
  );
}
