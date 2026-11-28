import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPublicContactSettings, getPublicServiceAreas } from "@/lib/cms";
import { RequestTimeMarker } from "@/components/request-time-marker";
import { createPageMetadata, siteOrigin } from "@/lib/site-seo";
import { getCityLocation } from "@/lib/provinces";

type ProvincePageProps = {
  params: Promise<{ province: string }>;
};

export async function generateMetadata({
  params,
}: ProvincePageProps): Promise<Metadata> {
  const { province: slug } = await params;
  const city = getCityLocation(slug);
  if (city) {
    return {
      ...createPageMetadata({
      title: `Golf Cart Enquiries in ${city.name}`,
      description: `What to include when asking about golf cart purchase or rental options in ${city.name}. Availability and delivery are confirmed for each address.`,
      path: `/locations/${city.slug}`,
      }),
      robots: { index: false, follow: true },
    };
  }
  const provinces = await getPublicServiceAreas();
  const province = provinces.find((item) => item.slug === slug);
  if (!province) return {};

  return createPageMetadata({
    title: `Golf Cart Enquiries in ${province.name}`,
    description: `Golf cart purchase and rental considerations for ${province.name}. Ask CartScout to confirm availability and delivery for your address.`,
    path: `/locations/${province.slug}`,
  });
}

function ProvinceStructuredData({
  provinceSlug,
  provinceName,
}: {
  provinceSlug: string;
  provinceName: string;
}) {
  const origin = siteOrigin;
  const pageUrl = origin
    ? new URL(`/locations/${provinceSlug}`, origin).toString()
    : undefined;
  const breadcrumbId = pageUrl ? `${pageUrl}#breadcrumb` : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...(pageUrl ? { "@id": pageUrl, url: pageUrl } : {}),
        name: `Golf Carts in ${provinceName}`,
        description: `Nationwide CartScout golf cart sales and rentals in ${provinceName}, South Africa.`,
        inLanguage: "en-ZA",
        ...(breadcrumbId ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      },
      ...(origin && pageUrl
        ? [
            {
              "@type": "BreadcrumbList",
              "@id": breadcrumbId,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: origin },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Locations",
                  item: new URL("/locations", origin).toString(),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: provinceName,
                  item: pageUrl,
                },
              ],
            },
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

async function ProvinceContent({ params }: ProvincePageProps) {
  const { province: slug } = await params;
  const city = getCityLocation(slug);
  if (city) {
    const contact = await getPublicContactSettings();
    const pageUrl = siteOrigin ? new URL(`/locations/${city.slug}`, siteOrigin).toString() : undefined;
    const rentalMessage = encodeURIComponent(
      `Hi CartScout, I am based in ${city.name} and would like to ask about golf cart availability for a purchase or rental.`,
    );
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          ...(pageUrl ? { "@id": pageUrl, url: pageUrl } : {}),
          name: `Golf Carts in ${city.name}`,
          description: `Golf cart sales and rental enquiries in ${city.name}, South Africa.`,
          inLanguage: "en-ZA",
        },
      ],
    };

    return (
      <main className="content-page location-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/locations">Locations</Link></li>
            <li aria-current="page">{city.name}</li>
          </ol>
        </nav>
        <div className="eyebrow"><span /> GOLF CARTS · {city.name.toUpperCase()}</div>
        <h1>Golf carts in {city.name}</h1>
        <p className="page-intro">{city.overview}</p>

        <section className="location-section">
          <h2>Buying or renting a golf cart in {city.name}</h2>
          <p>
            Share your suburb or exact address, passenger count, intended use and
            preferred dates. CartScout must confirm whether the requested cart,
            rental and transport arrangements are available for that location.
          </p>
        </section>

        <section className="location-section">
          <h2>Information to include in a {city.name} enquiry</h2>
          <ul className="location-use-list">
            {city.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}
          </ul>
        </section>

        <section className="location-section location-faq" aria-labelledby="city-faq-title">
          <h2 id="city-faq-title">Golf cart questions for {city.name}</h2>
          <details className="home-faq-item">
            <summary>Can I buy a golf cart for delivery in {city.name}?</summary>
            <p>
              Browse the <Link href="/shop">CartScout inventory</Link>, then ask
              whether the specific cart and delivery to your address are available.
            </p>
          </details>
          <details className="home-faq-item">
            <summary>Can I hire a golf cart in {city.name}?</summary>
            <p>
              Send a <Link href="/rent">rental request</Link> with your dates,
              address, passenger count and number of carts. Availability must be confirmed.
            </p>
          </details>
        </section>

        <section className="location-cta">
          <div>
            <h2>Enquiring from {city.name}?</h2>
            <p>Tell us the suburb, cart capacity, intended use and whether you want to buy or rent. We will confirm whether the request can be accommodated.</p>
          </div>
          <div className="page-actions">
            <Link className="button button-dark" href="/shop">Browse inventory <span aria-hidden="true">→</span></Link>
            <a className="text-link" href={`${contact.whatsapp_href}?text=${rentalMessage}`} target="_blank" rel="noreferrer">
              Ask on WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <nav className="other-provinces" aria-label="Other location guides">
          <h2>Explore nearby location guides</h2>
          <div>
            <Link href={`/locations/${city.provinceSlug}`}>{city.provinceName}</Link>
            <Link href="/locations/gauteng">Gauteng</Link>
            <Link href="/locations/western-cape">Western Cape</Link>
            <Link href="/locations/kwazulu-natal">KwaZulu-Natal</Link>
          </div>
        </nav>
      </main>
    );
  }

  const [provinces, contact] = await Promise.all([
    getPublicServiceAreas(),
    getPublicContactSettings(),
  ]);
  const province = provinces.find((item) => item.slug === slug);
  if (!province) notFound();

  const rentalMessage = encodeURIComponent(
    `Hi CartScout, I am based in ${province.name} and would like to ask about golf cart availability. I am interested in a purchase or rental.`,
  );

  return (
    <main className="content-page location-page">
      <ProvinceStructuredData provinceSlug={province.slug} provinceName={province.name} />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/locations">Locations</Link></li>
          <li aria-current="page">{province.name}</li>
        </ol>
      </nav>
      <div className="eyebrow"><span /> GOLF CART GUIDE · {province.name.toUpperCase()}</div>
      <h1>Golf carts in {province.name}</h1>
      <p className="page-intro">{province.overview}</p>

      <section className="location-section">
        <h2>Areas in this {province.name} guide</h2>
        <p>
          These towns are examples of destinations in the province, not a
          guarantee of delivery or rental coverage. Confirm arrangements for
          your exact address before proceeding.
        </p>
        <ul className="town-list">
          {province.towns.map((town) => <li key={town}>{town}</li>)}
        </ul>
      </section>

      <section className="location-section">
        <h2>Golf cart uses to consider</h2>
        <p>
          The right cart depends on the route, passengers, and rules at your
          destination. Common settings to consider in {province.name} include:
        </p>
        <ul className="location-use-list">
          {province.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}
        </ul>
      </section>

      <section className="content-note">
        <h2>Check location and suitability before proceeding</h2>
        <p>{province.considerations}</p>
        <p>
          Send your town or full address with the request. CartScout will
          confirm whether sales, rentals, delivery or collection can be
          arranged for that destination. Rental bookings require confirmed
          availability and agreed terms.
        </p>
      </section>

      <section className="location-section location-faq" aria-labelledby="province-faq-title">
        <h2 id="province-faq-title">Golf cart questions for {province.name}</h2>
        <details className="home-faq-item">
          <summary>Can I buy a golf cart in {province.name}?</summary>
          <p>
            Browse the <Link href="/shop">current inventory</Link> and contact
            CartScout about a specific cart. Availability and any delivery
            arrangement must be confirmed for your address.
          </p>
        </details>
        <details className="home-faq-item">
          <summary>Can I request a golf cart rental in {province.name}?</summary>
          <p>
            Send a <Link href="/rent">rental request</Link> with your location,
            dates and passenger count. Coverage and availability must be
            confirmed; an enquiry is not a booking.
          </p>
        </details>
        <details className="home-faq-item">
          <summary>Which areas are included in this guide?</summary>
          <p>
            Examples include {province.towns.join(", ")}. These are geographic
            examples, not confirmation of delivery coverage.
          </p>
        </details>
      </section>

      <section className="location-cta">
        <div>
          <h2>Enquiring from {province.name}?</h2>
          <p>Share your town, intended use, dates and passenger needs so CartScout can confirm whether the request can be accommodated.</p>
        </div>
        <div className="page-actions">
          <Link className="button button-dark" href="/shop">Browse inventory <span aria-hidden="true">→</span></Link>
          <a className="text-link" href={`${contact.whatsapp_href}?text=${rentalMessage}`} target="_blank" rel="noreferrer">
            Ask on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <nav className="other-provinces" aria-label="Other province guides">
        <h2>Explore other provinces</h2>
        <div>
          {provinces.filter(({ slug: provinceSlug }) => provinceSlug !== province.slug).map((other) => (
            <Link key={other.slug} href={`/locations/${other.slug}`}>{other.name}</Link>
          ))}
        </div>
      </nav>
    </main>
  );
}

export default function ProvincePage({ params }: ProvincePageProps) {
  return (
    <>
      <Suspense fallback={null}><RequestTimeMarker /></Suspense>
      <Suspense fallback={<main className="content-page location-page"><p role="status">Loading province guide...</p></main>}>
        <ProvinceContent params={params} />
      </Suspense>
    </>
  );
}
