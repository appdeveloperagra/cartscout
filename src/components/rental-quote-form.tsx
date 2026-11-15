"use client";

import { useRef, useState, type ChangeEvent } from "react";

export default function RentalQuoteForm({ whatsappHref }: { whatsappHref: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [request, setRequest] = useState({
    location: "",
    dates: "",
    passengers: "2",
    cartCount: "1",
    details: "",
  });
  const message = [
      "Hi CartScout, I would like to request a golf cart rental quote.",
      `Location: ${request.location}`,
      `Preferred dates or rental duration: ${request.dates}`,
      `Number of passengers: ${request.passengers}`,
      `Number of carts: ${request.cartCount}`,
      `Intended use or other details: ${request.details || "Not specified"}`,
    ].join("\n");

  function handleChange(event: ChangeEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    const field = target.dataset.field;
    if (
      field === "location" ||
      field === "dates" ||
      field === "passengers" ||
      field === "cartCount" ||
      field === "details"
    ) {
      setRequest((previous) => ({ ...previous, [field]: target.value }));
    }
  }

  return (
    <form className="rental-quote-form" onChange={handleChange} ref={formRef}>
      <label>
        Town or delivery address
        <input
          autoComplete="address-level2"
          data-field="location"
          placeholder="e.g. Stellenbosch"
          required
        />
      </label>
      <label>
        Preferred dates or duration
        <input
          data-field="dates"
          placeholder="e.g. 12–14 December, or one week"
          required
        />
      </label>
      <div className="rental-form-row">
        <label>
          Number of passengers
          <input data-field="passengers" type="number" min="1" max="99" value={request.passengers} required />
        </label>
        <label>
          Number of carts
          <input data-field="cartCount" type="number" min="1" max="99" value={request.cartCount} required />
        </label>
      </div>
      <label>
        Intended use or other details <span className="rental-form-optional">(optional)</span>
        <textarea
          data-field="details"
          rows={3}
          placeholder="Share event details, route or any questions."
        />
      </label>
      <a
        className="button button-dark"
        href={`${whatsappHref}?text=${encodeURIComponent(message)}`}
        onClick={(event) => {
          if (!formRef.current?.reportValidity()) event.preventDefault();
        }}
        rel="noreferrer"
        target="_blank"
      >
        Continue to WhatsApp <span aria-hidden="true">↗</span>
      </a>
      <p className="rental-form-note">
        WhatsApp opens in a new tab with a draft message. Review it and press Send to contact
        CartScout. Availability and booking are confirmed separately.
      </p>
    </form>
  );
}
