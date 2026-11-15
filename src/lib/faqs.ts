export type FAQItem = {
  question: string;
  answer: string;
};

export const faqs: FAQItem[] = [
  {
    question: "How much does a golf cart cost in South Africa?",
    answer:
      "The ZAR planning guide shows R50 000–R90 000 for 2-seaters, R90 000–R150 000 for 4-seaters, and R120 000–R210 000 for 6-seaters. These are unverified budgeting ranges, not market averages, dealer quotes, or prices for specific carts. Request a current quote before making a decision.",
  },
  {
    question: "Are the ZAR ranges the actual prices of the listed carts?",
    answer:
      "No. The ranges are for planning only and are not linked to individual listings. CartScout does not currently have confirmed South African prices or landed costs for each listed cart, so ask for a current ZAR quote.",
  },
  {
    question: "Are CartScout's price ranges shown in South African rand?",
    answer:
      "Yes. The budget guide uses South African rand (ZAR). CartScout does not convert a third-party listing into a confirmed local price; the original dealer page may show its own currency.",
  },
  {
    question: "Are the golf carts in the listings available in South Africa?",
    answer:
      "The catalog is sourced from public Mullens Golf Carts listings. Those listings do not confirm South African stock, import arrangements, or delivery to your address. Ask CartScout to check before relying on availability.",
  },
  {
    question: "How do I request a golf cart price in rand?",
    answer:
      "Choose “Enquire to buy” on a cart, send the prepared email, and include your town or province. Ask for the current ZAR price and confirm whether any transport or import costs apply. The enquiry is not an order.",
  },
  {
    question: "How much does golf cart hire or rental cost?",
    answer:
      "There are no fixed rental rates on the site. Request a quote with your location, dates, duration, passenger count, and number of carts. Ask for the total in ZAR and confirm availability, delivery, inclusions, and terms before booking.",
  },
  {
    question: "Does sending an enquiry reserve a golf cart or confirm a rental?",
    answer:
      "No. An email, call, or WhatsApp message is only an enquiry. A purchase or rental is confirmed only after availability, the final price, and the applicable terms are agreed.",
  },
  {
    question: "What affects the price of a golf cart?",
    answer:
      "Price can depend on make, model, year, passenger capacity, condition, battery or powertrain, accessories, and transport. For an imported cart, ask whether any import-related costs apply and get the full amount confirmed in writing.",
  },
  {
    question: "How many seats should I choose?",
    answer:
      "Start with the number of passengers and any equipment or cargo you need to carry. Check the listed capacity and intended use with the seller; the budget guide covers 2-, 4-, and 6-seater planning ranges only.",
  },
  {
    question: "Are the listed golf carts new or used?",
    answer:
      "Do not infer a cart's condition from its model year or listing title. Ask the seller to confirm whether it is new or used, its condition, service history, and any warranty before proceeding.",
  },
  {
    question: "Does a golf cart include its battery and charger?",
    answer:
      "Inclusions vary by listing. Confirm the battery type and condition, charger, accessories, and warranty directly with the seller before agreeing to a purchase.",
  },
  {
    question: "Can a golf cart be delivered to my province?",
    answer:
      "The province guides are informational and do not confirm delivery coverage. Share your exact town or address and ask for delivery feasibility, timing, and cost to be confirmed.",
  },
  {
    question: "Can I drive a golf cart on public roads in South Africa?",
    answer:
      "Do not assume a golf cart is permitted on public roads. Requirements can depend on the vehicle, road, and applicable national or local rules. Check with the relevant traffic authority and municipality before using one on a public road.",
  },
  {
    question: "Can I request carts for an event or group?",
    answer:
      "You can send a rental request with the event location, dates, passenger count, and number of carts. Availability, delivery, and suitability are checked individually; an enquiry does not guarantee that the request can be accommodated.",
  },
  {
    question: "How can I check a cart before buying it?",
    answer:
      "Review the source listing and ask the seller for current photos, condition details, service and battery history, included equipment, documentation, warranty, and whether an inspection can be arranged. Confirm all details and terms before paying.",
  },
];

export const homeFaqs = faqs.slice(0, 7);
