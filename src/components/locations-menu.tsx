"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type LocationLink = {
  slug: string;
  name: string;
};

export default function LocationsMenu({
  locations,
  onNavigate,
}: {
  locations: LocationLink[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function closeOnOutsideFocus(event: FocusEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("focusin", closeOnOutsideFocus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("focusin", closeOnOutsideFocus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
    onNavigate?.();
  }

  return (
    <div className="locations-nav" ref={containerRef}>
      <button
        aria-controls="locations-menu"
        aria-expanded={isOpen}
        className="locations-nav-toggle"
        onClick={() => setIsOpen((open) => !open)}
        ref={buttonRef}
        type="button"
      >
        Locations
      </button>
      <div
        aria-label="Location pages"
        className="locations-menu"
        hidden={!isOpen}
        id="locations-menu"
        role="group"
      >
        <Link className="locations-menu-index" href="/locations" aria-current={pathname === "/locations" ? "page" : undefined} onClick={closeMenu}>
          All locations
        </Link>
        {locations.map(({ slug, name }) => (
          <Link href={`/locations/${slug}`} key={slug} aria-current={pathname === `/locations/${slug}` ? "page" : undefined} onClick={closeMenu}>
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
