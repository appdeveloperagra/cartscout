export type RentalRate = {
  id?: string;
  name: string;
  passenger_capacity: number | null;
  daily_price_zar: number;
  weekly_price_zar: number;
  monthly_price_zar: number;
  includes_delivery: boolean;
  is_published?: boolean;
  display_order?: number;
};

export type RentalFAQ = {
  question: string;
  answer: string;
};

export const rentalRates: RentalRate[] = [
  {
    name: "2-Seater Golf Cart",
    passenger_capacity: 2,
    daily_price_zar: 850,
    weekly_price_zar: 5100,
    monthly_price_zar: 25000,
    includes_delivery: true,
    display_order: 0,
  },
  {
    name: "4-Seater Golf Cart",
    passenger_capacity: 4,
    daily_price_zar: 1100,
    weekly_price_zar: 6800,
    monthly_price_zar: 30000,
    includes_delivery: true,
    display_order: 1,
  },
  {
    name: "6-Seater Golf Cart",
    passenger_capacity: 6,
    daily_price_zar: 1400,
    weekly_price_zar: 8000,
    monthly_price_zar: 38000,
    includes_delivery: true,
    display_order: 2,
  },
  {
    name: "Utility Golf Cart",
    passenger_capacity: null,
    daily_price_zar: 1500,
    weekly_price_zar: 9200,
    monthly_price_zar: 41000,
    includes_delivery: true,
    display_order: 3,
  },
];

export const rentalFaqs: RentalFAQ[] = [
  {
    question: "Which areas can I request golf cart hire in?",
    answer:
      "Share your town or full delivery address, dates and passenger requirements. CartScout will confirm whether a rental can be arranged for that location, along with delivery, collection and any related costs.",
  },
  {
    question: "How much does golf cart hire cost?",
    answer:
      "The rental rates table lists daily, weekly, and monthly rates for 2-seater, 4-seater, 6-seater, and utility carts. Confirm your dates and any request-specific terms with CartScout.",
  },
  {
    question: "Can I hire for a day, a week, or longer?",
    answer:
      "The rate guide includes daily, weekly, and monthly periods. For a different duration or multiple carts, include your dates and requirements in a request for custom pricing.",
  },
  {
    question: "Is the cart booked when I send a request?",
    answer:
      "No. A WhatsApp message, call, or email is only an enquiry. Your rental is not booked until CartScout confirms availability and you agree to the quote and rental terms.",
  },
  {
    question: "Can I request carts for an event or group?",
    answer:
      "You can include the number of carts, passenger needs, location, dates, and intended use in your enquiry. CartScout will check whether the request can be accommodated.",
  },
  {
    question: "What is included in the rental price?",
    answer:
      "Each rate states whether delivery and collection are included. Confirm timing, any additional costs, vehicle inclusions, and rental conditions for your request before accepting a quote.",
  },
];
