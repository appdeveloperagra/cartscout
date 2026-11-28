export type UseCase = {
  slug: string;
  title: string;
  heading: string;
  description: string;
  overview: string;
  sections: { title: string; body: string }[];
  considerations: string[];
};

export const useCases: UseCase[] = [
  {
    slug: "golf-courses",
    title: "Golf Carts for Golf Courses",
    heading: "Golf carts for golf courses.",
    description: "Plan golf-course carts around player demand, course routes, charging, servicing and fleet downtime.",
    overview: "Course use involves repeated trips, equipment, route conditions and fleet turnover. Define the operating requirements before comparing individual carts or rental proposals.",
    sections: [
      { title: "Size the fleet for actual demand", body: "Review tee sheets, peak periods, events, cart-sharing rules and turnaround time. Estimate how many carts must be available at once, and whether the fleet needs different passenger or utility configurations." },
      { title: "Check course and route suitability", body: "Map slopes, surfaces, crossing points, daily distances and any turf-protection requirements. Ask about the exact cart's rated capacity and intended operating conditions; arrange a representative trial where possible." },
      { title: "Plan charging, service and downtime", body: "Identify charging locations, available charging windows and storage arrangements. Confirm battery and charger details, maintenance schedules, parts access, warranty and the response plan if a cart is unavailable." },
    ],
    considerations: ["Expected fleet size and peak use", "Passenger, bag and utility requirements", "Route, charging and maintenance needs"],
  },
  {
    slug: "residential-estates",
    title: "Golf Carts for Residential Estates",
    heading: "Golf carts for residential estates.",
    description: "Check estate rules, route conditions, passenger needs and charging before choosing a cart.",
    overview: "A cart may suit some short trips on private estate roads, but permission and vehicle suitability must be checked with the estate and seller before purchase or rental.",
    sections: [
      { title: "Get the estate's rules first", body: "Ask management which vehicles and routes are allowed, who may drive, and whether registration, safety equipment, parking or charging approval is required. Do not assume estate access permits travel on public roads." },
      { title: "Match the vehicle to regular trips", body: "List the destinations, distances, gradients, surfaces and passenger count. Check seat layout, load limits and any mobility or cargo needs against the exact model's specifications." },
      { title: "Plan storage and charging", body: "Confirm where the cart can be parked, whether it will be sheltered and how it can be charged safely. Ask for the fitted battery and charger details, care instructions and service support." },
    ],
    considerations: ["Written estate permission", "Route and passenger requirements", "Secure storage and suitable charging"],
  },
  {
    slug: "resorts-hospitality",
    title: "Golf Carts for Resorts and Hospitality",
    heading: "Golf carts for resorts and hospitality.",
    description: "Assess guest transport, accessibility, route operations, charging and support for hospitality carts.",
    overview: "Hospitality carts can support guest or staff movement on private property when the route and vehicle are suitable. Plan around service peaks, accessibility and safe operating procedures.",
    sections: [
      { title: "Map guest journeys", body: "Identify the locations guests need to reach, trip frequency, busy check-in or event periods, luggage needs and the routes between buildings. Consider whether one vehicle configuration can serve all tasks or whether separate passenger and utility carts are needed." },
      { title: "Consider access and supervision", body: "Check paths, ramps, turning space, loading points and site rules. Decide who may operate the carts, how keys are controlled and how guests request assistance. Confirm any accessibility requirements with the property and supplier." },
      { title: "Build an operating plan", body: "Estimate daily use, charging windows, parking, cleaning and routine inspections. Confirm battery and charger specifications, service support, delivery access and arrangements for replacing a cart during downtime." },
    ],
    considerations: ["Guest volume and peak periods", "Accessible routes and operating rules", "Charging, cleaning and maintenance"],
  },
  {
    slug: "campuses-businesses",
    title: "Golf Carts for Campuses and Businesses",
    heading: "Golf carts for campuses and businesses.",
    description: "Match a worksite or campus cart to passengers, cargo, route permissions and daily operating demands.",
    overview: "On a campus or business site, the cart should solve a specific short-distance transport task. Define the route and load before comparing passenger carts, utility carts or rental options.",
    sections: [
      { title: "Define the task and load", body: "List who or what needs to move, how often, the number of passengers, and the size and weight of tools or cargo. Check whether a passenger layout, utility bed or a combination of vehicles best suits the work." },
      { title: "Check site access and route conditions", body: "Ask the property operator which roads and paths are permitted. Review gradients, surfaces, pedestrian areas, crossings, loading points and storage access. Confirm the vehicle's capacity and intended use with the supplier." },
      { title: "Plan charging and responsibility", body: "Choose a safe parking and charging area, assign trained operators and set inspection procedures. Confirm battery type, charger compatibility, servicing, parts support and who is responsible for daily checks." },
    ],
    considerations: ["Passenger and cargo capacity", "Site permissions and route suitability", "Operator training and maintenance"],
  },
  {
    slug: "private-properties",
    title: "Golf Carts for Private Properties",
    heading: "Golf carts for private properties.",
    description: "Choose a golf cart for private-property use by checking terrain, distance, passengers and charging.",
    overview: "Private properties vary widely. A cart that works for short, level trips may not suit a long, steep or rough route, so assess the property and vehicle together.",
    sections: [
      { title: "Walk the route before choosing", body: "Measure typical trip distance and note gradients, surface changes, gates, turning space and weather exposure. Share these details with the seller and ask whether the exact model is designed for the conditions." },
      { title: "Check passengers, cargo and capacity", body: "Count the people who will travel together and identify any tools, bags or supplies to carry. Verify the seat layout, load limits and any utility accessories instead of relying on a generic model name." },
      { title: "Plan ownership and storage", body: "Confirm where the cart will be kept and charged, what maintenance is required and who can service it. For remote properties, ask about parts availability, support response and delivery arrangements for the exact address." },
    ],
    considerations: ["Surface, gradient and daily distance", "Passenger and cargo needs", "Charging, secure storage and service access"],
  },
  {
    slug: "events",
    title: "Golf Carts for Events",
    heading: "Golf carts for events.",
    description: "Plan event cart purchases or rentals around guest journeys, venue access, dates and transport.",
    overview: "Event transport has a fixed schedule and changing passenger demand. Build the route and operating plan first, then request a quote for a confirmed vehicle type and quantity.",
    sections: [
      { title: "Estimate demand and cart numbers", body: "Consider guest arrival and departure peaks, trip length, event duration, staff transport and luggage. Share the expected passenger flow and whether carts need to be continuously available or can make repeat trips." },
      { title: "Confirm venue access and safety", body: "Check the venue's vehicle rules, approved routes, surfaces, slopes, pedestrian crossings, parking and charging points. Agree who will drive the carts and whether the venue requires any specific operating procedure." },
      { title: "Coordinate the quote and schedule", body: "Provide event dates, setup and breakdown times, exact access address, contact person, cart quantity and passenger configuration. Confirm delivery and collection windows, included equipment, charges, cancellation terms and what happens if plans change." },
    ],
    considerations: ["Guest volume and trip pattern", "Venue access, routes and permissions", "Delivery schedule and rental terms"],
  },
];

export function getUseCase(slug: string) {
  return useCases.find((useCase) => useCase.slug === slug);
}
