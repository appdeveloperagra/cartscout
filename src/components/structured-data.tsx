import { siteOrigin } from "@/lib/site-seo";

export function StructuredData({
  email,
  phone,
}: {
  email: string;
  phone: string;
}) {
  const organizationId = siteOrigin ? `${siteOrigin}/#organization` : undefined;
  const graph = [
    {
      "@type": "Organization",
      ...(organizationId ? { "@id": organizationId, url: siteOrigin } : {}),
      name: "CartScout",
      email,
      telephone: phone,
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
