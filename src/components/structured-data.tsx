import { siteOrigin } from "@/lib/site-seo";

export function StructuredData({
  email,
  phone,
  address,
}: {
  email: string;
  phone: string;
  address: string[];
}) {
  const organizationId = siteOrigin ? `${siteOrigin}/#organization` : undefined;
  const graph = [
    {
      "@type": "Organization",
      ...(organizationId ? { "@id": organizationId, url: siteOrigin } : {}),
      name: "CartScout",
      email,
      telephone: phone,
      ...(address.length
        ? {
            address: {
              "@type": "PostalAddress",
              ...(address[0] ? { streetAddress: address[0] } : {}),
              ...(address[1] ? { addressLocality: address[1] } : {}),
              ...(address[3] ? { addressRegion: address[3] } : {}),
              ...(address[4] ? { postalCode: address[4] } : {}),
              addressCountry: "ZA",
            },
          }
        : {}),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: phone,
        email,
        areaServed: {
          "@type": "Country",
          name: "South Africa",
        },
        availableLanguage: "English",
      },
    },
    ...(siteOrigin
      ? [
          {
            "@type": "WebSite",
            "@id": `${siteOrigin}/#website`,
            url: siteOrigin,
            name: "CartScout",
            inLanguage: "en-ZA",
            publisher: { "@id": organizationId },
          },
        ]
      : []),
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
