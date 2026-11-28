export type Province = {
  slug: string;
  name: string;
  towns: string[];
  overview: string;
  useCases: string[];
  considerations: string;
};

export const provinces: Province[] = [
  {
    slug: "eastern-cape",
    name: "Eastern Cape",
    towns: ["Gqeberha", "East London", "Makhanda", "Kariega", "Mthatha"],
    overview:
      "The Eastern Cape spans coastal cities, smaller towns and rural destinations. If you are comparing a golf cart for a home, golf course, hospitality venue or worksite, share the intended use and town so the relevant specifications and arrangements can be discussed.",
    useCases: [
      "Golf and leisure facilities around Gqeberha and East London",
      "Guest transport at coastal and inland hospitality properties",
      "Movement around private properties and managed sites",
    ],
    considerations:
      "The province covers a wide area. Confirm the delivery destination, lead time and any transport costs before proceeding, and check that the cart suits the surface and daily distance you have in mind.",
  },
  {
    slug: "free-state",
    name: "Free State",
    towns: ["Bloemfontein", "Welkom", "Bethlehem", "Kroonstad", "Sasolburg"],
    overview:
      "From Bloemfontein to the towns across the interior, Free State enquiries can involve golf, accommodation, private-property or operational use. Start with the number of passengers, typical route and how often the cart will be used.",
    useCases: [
      "Short trips at golf clubs and leisure venues",
      "Guest movement at accommodation and event properties",
      "Everyday transport around private premises",
    ],
    considerations:
      "Distances between towns can affect transport arrangements. Ask for the full delivered cost and expected timing for your specific address, rather than relying on a province-wide estimate.",
  },
  {
    slug: "gauteng",
    name: "Gauteng",
    towns: ["Johannesburg", "Pretoria", "Centurion", "Midrand", "Sandton"],
    overview:
      "Gauteng enquiries come from a mix of residential estates, golf facilities, hospitality venues and business properties. To narrow down suitable options, share your suburb or estate, passenger requirements and whether you are considering a purchase or rental.",
    useCases: [
      "Golf courses, residential estates and leisure facilities",
      "Guest transport at hotels, venues and event properties",
      "Short-distance movement around campuses and work sites",
    ],
    considerations:
      "Access rules differ between estates, clubs and commercial properties. Check permission for golf-cart use at your destination and confirm delivery access and arrangements before placing an order.",
  },
  {
    slug: "kwazulu-natal",
    name: "KwaZulu-Natal",
    towns: ["Durban", "Pietermaritzburg", "Ballito", "Richards Bay", "Newcastle"],
    overview:
      "KwaZulu-Natal includes coastal centres, inland towns and holiday destinations. Tell us where the cart will be used and whether it is for a golf facility, guest accommodation, private property or another permitted purpose.",
    useCases: [
      "Golf and resort properties along the coast and inland",
      "Guest transport at accommodation and holiday venues",
      "Short-distance use around private or managed properties",
    ],
    considerations:
      "Coastal conditions, storage and the route surface can matter when choosing a cart. Confirm the cart's specifications, maintenance needs and transport arrangements for your particular location.",
  },
  {
    slug: "limpopo",
    name: "Limpopo",
    towns: ["Polokwane", "Tzaneen", "Bela-Bela", "Mokopane", "Phalaborwa"],
    overview:
      "Limpopo's towns and tourism destinations can have very different requirements. For an enquiry from Polokwane, Bela-Bela, Tzaneen or elsewhere in the province, describe the terrain, daily distance and passenger load you need to support.",
    useCases: [
      "Guest movement at lodges and tourism properties",
      "Golf and leisure facilities in towns and resort areas",
      "Short-distance transport around private properties",
    ],
    considerations:
      "For lodge, rural or uneven-ground use, confirm the vehicle's capabilities and intended operating environment with CartScout. Delivery feasibility and costs need to be checked for the exact destination.",
  },
  {
    slug: "mpumalanga",
    name: "Mpumalanga",
    towns: ["Mbombela (Nelspruit)", "White River", "Hazyview", "Secunda", "Ermelo"],
    overview:
      "Mpumalanga enquiries may come from towns, golf facilities, accommodation and tourism properties. Include the closest town, the route surface and how the cart will be used so that suitability and transport can be discussed clearly.",
    useCases: [
      "Guest transport at accommodation and tourism properties",
      "Golf courses and leisure venues around Mbombela and White River",
      "Movement around private estates and managed sites",
    ],
    considerations:
      "Properties near the escarpment or outside major towns may have specific access and terrain needs. Confirm that a cart is suitable for the route and check delivery details against the full address.",
  },
  {
    slug: "north-west",
    name: "North West",
    towns: ["Rustenburg", "Mahikeng", "Potchefstroom", "Klerksdorp", "Sun City"],
    overview:
      "North West combines university towns, regional centres and leisure destinations. A useful enquiry describes whether the cart is for a golf course, hospitality property, estate or worksite, along with the number of passengers and typical trip length.",
    useCases: [
      "Golf, resort and leisure properties",
      "Guest movement at accommodation and event venues",
      "Short trips around campuses and private sites",
    ],
    considerations:
      "A golf cart may not be suitable for every road or worksite. Check local operating rules, route conditions and any site permissions, then confirm availability and delivery for your destination.",
  },
  {
    slug: "northern-cape",
    name: "Northern Cape",
    towns: ["Kimberley", "Upington", "Kathu", "Springbok", "De Aar"],
    overview:
      "The Northern Cape is a large province with significant distances between towns. Whether your enquiry is from Kimberley, Upington or another area, the exact delivery address and intended use are important when checking a suitable cart and transport options.",
    useCases: [
      "Golf and leisure venues in regional centres",
      "Guest transport at accommodation and tourism properties",
      "Short-distance movement around large private premises",
    ],
    considerations:
      "Long-distance transport may affect cost and timing. Share the full destination and ask for delivery arrangements to be confirmed in writing before making a decision.",
  },
  {
    slug: "western-cape",
    name: "Western Cape",
    towns: ["Cape Town", "Stellenbosch", "Paarl", "George", "Knysna"],
    overview:
      "Western Cape enquiries span metropolitan areas, Winelands towns and Garden Route destinations. Share the town or suburb, passenger count and intended setting to help clarify which listed cart or rental request may be relevant.",
    useCases: [
      "Golf facilities and residential properties",
      "Guest transport at wine, hospitality and event venues",
      "Short-distance movement around managed properties",
    ],
    considerations:
      "A venue's access rules, terrain and route length can affect cart suitability. Confirm operating permissions and the full delivery or rental arrangements for your location.",
  },
];

export type CityLocation = {
  slug: string;
  name: string;
  provinceSlug: string;
  provinceName: string;
  overview: string;
  useCases: string[];
};

export const cityLocations: CityLocation[] = [
  {
    slug: "johannesburg",
    name: "Johannesburg",
    provinceSlug: "gauteng",
    provinceName: "Gauteng",
    overview: "For a golf cart enquiry in Johannesburg, start with the suburb, intended route, passenger count and whether you are considering a purchase or rental. Availability and delivery must be confirmed for the exact address.",
    useCases: ["Golf courses and residential estates", "Hotels, event venues and guest transport", "Campuses and managed properties"],
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    provinceSlug: "western-cape",
    provinceName: "Western Cape",
    overview: "For a Cape Town golf cart enquiry, include the suburb, intended setting, passenger count and whether you need a purchase or rental. Ask CartScout to confirm availability and transport for the exact address.",
    useCases: ["Golf and residential properties", "Wine estates and hospitality venues", "Events and managed sites"],
  },
  {
    slug: "pretoria",
    name: "Pretoria",
    provinceSlug: "gauteng",
    provinceName: "Gauteng",
    overview: "When enquiring from Pretoria, share the intended setting, route, passenger count and preferred purchase or rental dates. CartScout must confirm current options and arrangements for your address.",
    useCases: ["Estates and golf facilities", "Campuses and large private properties", "Hospitality and event venues"],
  },
  {
    slug: "durban",
    name: "Durban",
    provinceSlug: "kwazulu-natal",
    provinceName: "KwaZulu-Natal",
    overview: "A Durban golf cart enquiry should include the intended property, route, passenger count and dates. Discuss coastal storage conditions and access, and confirm whether the cart and delivery can be arranged for the address.",
    useCases: ["Resorts and coastal hospitality properties", "Golf venues and estates", "Events and private properties"],
  },
  {
    slug: "ballito",
    name: "Ballito",
    provinceSlug: "kwazulu-natal",
    provinceName: "KwaZulu-Natal",
    overview: "For a Ballito enquiry, share the property address, passenger capacity, intended use and whether you are considering a purchase or rental. Confirm availability, delivery access and any storage requirements.",
    useCases: ["Residential estates and holiday properties", "Golf and leisure facilities", "Accommodation and event transport"],
  },
];

export function getProvince(slug: string) {
  return provinces.find((province) => province.slug === slug);
}

export function getCityLocation(slug: string) {
  return cityLocations.find((city) => city.slug === slug);
}
