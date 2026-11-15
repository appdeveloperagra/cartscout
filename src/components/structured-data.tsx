import { contactEmail, contactPhone } from "@/lib/contact";
import { siteOrigin } from "@/lib/site-seo";

export function StructuredData() {
  const organizationId = siteOrigin ? `${siteOrigin}/#organization` : undefined;
  const graph = [
    {
      "@type": "Organization",
      ...(organizationId ? { "@id": organizationId, url: siteOrigin } : {}),
      name: "CartScout",
      email: contactEmail,
      telephone: contactPhone,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: contactPhone,
        email: contactEmail,
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
