export type FAQItem = {
  id?: string;
  category?: "general" | "rental";
  question: string;
  answer: string;
  display_order?: number;
  is_published?: boolean;
};

export const faqs: FAQItem[] = [
  {
    question: "How are catalogue prices shown?",
    answer:
      "Catalogue amounts are shown in South African rand for comparison only; they are estimates, not confirmed offers. Ask CartScout to confirm the final price, delivery charges, and availability.",
  },
  {
    question: "Are catalogue prices shown in South African rand?",
    answer:
      "Yes. Catalogue estimates and passenger-capacity ranges are displayed in whole-rand South African rand (ZAR), but are not confirmed offers.",
  },
  {
    question: "Are the golf carts in CartScout's collection available in South Africa?",
    answer:
      "CartScout sells and rents golf carts throughout South Africa. Contact us about your preferred make and model, and we will arrange delivery to your location.",
  },
  {
    question: "How do I request a golf cart price in rand?",
    answer:
      "Select “Enquire to buy” on a cart and include your town or province in the purchase enquiry. The listed catalogue price is shown on the product card.",
  },
  {
    question: "How much does golf cart hire or rental cost?",
    answer:
      "The rentals page shows daily, weekly, and monthly rates for several passenger capacities and utility carts. For custom dates, multiple carts, or special requirements, send your location and details to CartScout for a quote.",
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
      "Start with the number of passengers and any equipment or cargo you need to carry. Check the stated capacity and intended use with CartScout; the price guide groups listed carts by passenger capacity.",
  },
  {
    question: "Are the listed golf carts new or used?",
    answer:
      "Do not infer a cart's condition from its model year or product title. Ask CartScout to confirm whether it is new or used, its condition, service history, and any warranty before proceeding.",
  },
  {
    question: "Does a golf cart include its battery and charger?",
    answer:
      "Inclusions vary by cart. Confirm the battery type and condition, charger, accessories, and warranty with CartScout before agreeing to a purchase.",
  },
  {
    question: "Can a golf cart be delivered to my province?",
    answer:
      "Yes. CartScout serves customers across South Africa. Share your full address and preferred timing so we can arrange delivery and confirm the details for your purchase.",
  },
  {
    question: "Can I drive a golf cart on public roads in South Africa?",
    answer:
      "Do not assume a golf cart is permitted on public roads. Requirements can depend on the vehicle, road, and applicable national or local rules. Check with the relevant traffic authority and municipality before using one on a public road.",
  },
  {
    question: "Can I request carts for an event or group?",
    answer:
      "Yes. CartScout rents golf carts throughout South Africa. Share the event location, dates, passenger count, and number of carts so we can arrange delivery and confirm availability.",
  },
  {
    question: "How can I check a cart before buying it?",
    answer:
      "Contact CartScout to arrange a vehicle inspection and discuss the cart specifications, service history, included equipment, and applicable warranty.",
  },
];

export const homeFaqs = faqs.slice(0, 7);
