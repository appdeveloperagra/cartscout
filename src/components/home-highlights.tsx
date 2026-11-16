"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const highlights = [
  {
    title: "A golf cart dealership for all makes and models.",
    description: "CartScout sells and rents golf carts throughout South Africa. Contact us for the current details.",
  },
  {
    title: "Confirm the details before you decide.",
    description: "Send an enquiry to check current availability, price, and purchase arrangements.",
  },
  {
    title: "An enquiry is not a reservation.",
    description: "An email or WhatsApp message does not reserve a cart or confirm a rental.",
  },
  {
    title: "Sales and rentals across South Africa.",
    description: "Share your preferred model, dates, passenger count, and location with our team.",
  },
];

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerReducedMotionPreference() {
  return true;
}

export function HomeHighlights() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    getServerReducedMotionPreference,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const activeHighlight = highlights[activeIndex];
  const isInteracting = isHovered || isFocused;

  useEffect(() => {
    function updatePageVisibility() {
      setIsPageVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", updatePageVisibility);
    return () => document.removeEventListener("visibilitychange", updatePageVisibility);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || isInteracting || !isPageVisible) return;

    const timer = window.setTimeout(() => {
      if (!document.hidden) {
        setActiveIndex((index) => (index + 1) % highlights.length);
      }
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isInteracting, isPageVisible, isPaused, prefersReducedMotion]);

  function showHighlight(nextIndex: number) {
    setActiveIndex((nextIndex + highlights.length) % highlights.length);
  }

  return (
    <section
      className="home-highlights"
      aria-label="What to expect"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="home-highlights-heading">
        <div className="eyebrow"><span /> GOOD TO KNOW</div>
        <h2>Before you enquire</h2>
      </div>
      <div
        className="home-highlight-slide"
        role="group"
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} of ${highlights.length}`}
        aria-live={prefersReducedMotion || isPaused || isInteracting ? "polite" : "off"}
      >
        <h3>{activeHighlight.title}</h3>
        <p>{activeHighlight.description}</p>
      </div>
      <div className="home-highlights-controls" aria-label="Carousel controls">
        <button type="button" onClick={() => showHighlight(activeIndex - 1)} aria-label="Previous highlight">
          <span aria-hidden="true">←</span>
        </button>
        {highlights.map((highlight, index) => (
          <button
            className="home-highlight-dot"
            key={highlight.title}
            type="button"
            onClick={() => showHighlight(index)}
            aria-label={`Show highlight ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
        <button type="button" onClick={() => showHighlight(activeIndex + 1)} aria-label="Next highlight">
          <span aria-hidden="true">→</span>
        </button>
        <button
          className="home-highlight-toggle"
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          disabled={prefersReducedMotion}
          aria-label={
            prefersReducedMotion
              ? "Automatic rotation is off because reduced motion is enabled"
              : isPaused
                ? "Resume automatic rotation"
                : "Pause automatic rotation"
          }
        >
          {prefersReducedMotion ? "Auto off" : isPaused ? "Play" : "Pause"}
        </button>
      </div>
    </section>
  );
}
