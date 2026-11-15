import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProvince, provinces } from "@/lib/provinces";
import { createPageMetadata, siteOrigin } from "@/lib/site-seo";
import { whatsappHref } from "@/lib/contact";

type ProvincePageProps = {
  params: Promise<{ province: string }>;
};

export function generateStaticParams() {
  return provinces.map(({ slug }) => ({ province: slug }));
}

export async function generateMetadata({
  params,
}: ProvincePageProps): Promise<Metadata> {
  const { province: slug } = await params;
  const province = getProvince(slug);
  if (!province) return {};

  return createPageMetadata({
    title: `Golf Carts in ${province.name} | Sales & Hire`,
    description: `Golf cart enquiries in ${province.name}, including ${province.towns[0]}. Browse listings or request hire; confirm stock, delivery, and rental availability.`,
    path: `/locations/${province.slug}`,
  });
}

function ProvinceStructuredData({
  provinceSlug,
  provinceName,
  towns,
}: {
  provinceSlug: string;
  provinceName: string;
  towns: string[];
}) {
  const origin = siteOrigin;
  const pageUrl = origin
    ? new URL(`/locations/${provinceSlug}`, origin).toString()
    : undefined;
  const breadcrumbId = pageUrl ? `${pageUrl}#breadcrumb` : undefined;
  const questions = [
    {
      question: `Can I buy a golf cart in ${provinceName}?`,
      answer:
        "Browse the current inventory and enquire about a specific listing. Stock and delivery arrangements for your location must be confirmed; the online catalog does not guarantee local availability.",
    },
    {
      question: `Can I request a golf cart rental in ${provinceName}?`,
      answer:
        "You can send a rental request with your location, preferred dates, and passenger count. Availability is checked manually, and an enquiry is not a confirmed booking.",
    },
    {
      question: `Which areas are included in this ${provinceName} guide?`,
      answer: `The guide includes examples such as ${towns.join(", ")}. These examples do not confirm delivery coverage or local stock. Ask CartScout to check arrangements for your exact address.`,
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        ...(pageUrl ? { "@id": pageUrl, url: pageUrl } : {}),
        name: `Golf Carts in ${provinceName}`,
        description: `Golf cart listing and enquiry information for ${provinceName}, South Africa.`,
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
      {
        "@type": "FAQPage",
        mainEntity: questions.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
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
  const province = getProvince(slug);
  if (!province) notFound();

  const rentalMessage = encodeURIComponent(
    `Hi CartScout, I would like to ask about golf cart availability in ${province.name}. My town is __. I am interested in a purchase or rental.`,
  );

  return (
    <main className="content-page location-page">
      <ProvinceStructuredData provinceSlug={province.slug} provinceName={province.name} towns={province.towns} />
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
          These towns are examples to help you identify your region. They are
          not a published delivery map or confirmation of local stock.
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
          CartScout&apos;s online purchase catalog is sourced from public
          Mullens Golf Carts listings. Listings do not guarantee stock or
          province-specific delivery. Rental requests are checked manually;
          neither an enquiry nor a message books a cart.
        </p>
      </section>

      <section className="location-section location-faq" aria-labelledby="province-faq-title">
        <h2 id="province-faq-title">Golf cart questions for {province.name}</h2>
        <details className="home-faq-item">
          <summary>Can I buy a golf cart in {province.name}?</summary>
          <p>
            Browse the <Link href="/inventory">current inventory</Link> and
            enquire about a specific listing. Stock and delivery arrangements
            for your location must be confirmed; the online catalog does not
            guarantee local availability.
          </p>
        </details>
        <details className="home-faq-item">
          <summary>Can I request a golf cart rental in {province.name}?</summary>
          <p>
            You can send a <Link href="/rentals">rental request</Link> with your
            location, preferred dates, and passenger count. Availability is
            checked manually, and an enquiry is not a confirmed booking.
          </p>
        </details>
        <details className="home-faq-item">
          <summary>Which areas are included in this guide?</summary>
          <p>
            The guide includes examples such as {province.towns.join(", ")}.
            These examples do not confirm delivery coverage or local stock.
            Ask CartScout to check arrangements for your exact address.
          </p>
        </details>
      </section>

      <section className="location-cta">
        <div>
          <h2>Enquiring from {province.name}?</h2>
          <p>Share your town, intended use, dates, and passenger needs so the relevant arrangements can be checked.</p>
        </div>
        <div className="page-actions">
          <Link className="button button-dark" href="/inventory">Browse inventory <span aria-hidden="true">→</span></Link>
          <a className="text-link" href={`${whatsappHref}?text=${rentalMessage}`} target="_blank" rel="noreferrer">
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
    <Suspense fallback={<main className="content-page location-page"><p role="status">Loading province guide…</p></main>}>
      <ProvinceContent params={params} />
    </Suspense>
  );
}
