"use client";

import type { FormEvent } from "react";

export default function ContactForm({ whatsappHref }: { whatsappHref: string }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const body = [
      "Hi CartScout, I have a golf cart sales or rental enquiry.",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.open(`${whatsappHref}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Your name
        <input name="name" autoComplete="name" required />
      </label>
      <div className="contact-form-row">
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone number <span className="contact-form-optional">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label>
        How can we help?
        <textarea
          name="message"
          rows={5}
          required
        />
      </label>
      <button className="button button-dark" type="submit">
        Continue to WhatsApp <span aria-hidden="true">→</span>
      </button>
      <p className="contact-form-note">
        WhatsApp opens in a new tab with your message ready. Tap Send there to submit your enquiry to CartScout.
      </p>
    </form>
  );
}
