# CartScout

A customer-facing golf cart shop for purchase enquiries and rental requests, built with Next.js, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Refresh the catalog

```bash
npm run import:inventory
```

The importer reads the public Mullens Golf Carts product API and writes the cart listing fields to `src/data/products.json`. It imports names, prices, stock status, product links, and the dealer's image URL; it does not copy the full product descriptions.

The purchase and rental forms prepare an email in the customer's default email app; rental requests also offer WhatsApp as an alternative. The public contact email is `info@cartscout.co.za` and is fixed in the site so a deployment environment override cannot change it. Customers must send the prepared message themselves. No enquiry is stored or sent automatically, and a request is not a confirmed sale or booking.

The homepage highlights a small selection of carts; the complete searchable catalog is available at `/inventory`. The site also includes About, Rentals, FAQs, Contact, Privacy, and Terms pages. The privacy and terms pages describe the current website behavior and should be reviewed against the business's legal identity, location, and applicable laws before launch. The catalog is imported from public Mullens Golf Carts listings. Individual cards show stable sample amounts in ZAR assigned within the supplied passenger-capacity ranges. These are unverified placeholders, not seller quotes, confirmed offers, or prices suitable for a Google Merchant Center feed. Confirm the actual South African price, stock, delivery, and any transport or import costs before purchase.

The permanent site URL defaults to `https://cartscout.co.za`. Copy `.env.example` to `.env.local` for local builds, and set `NEXT_PUBLIC_SITE_URL=https://cartscout.co.za` in Hostinger's build environment so the deployment uses the same canonical domain. Do not use the temporary Hostinger URL as the canonical domain. The public domain now serves the CartScout app over HTTPS; the currently deployed build still disallows crawling and returns an empty sitemap, so deploy this configuration to publish canonical URLs, allow indexing, and populate the sitemap.

The provided rental sources do not expose bookable availability, so rental requests are sent for manual confirmation. Fast Eddie's inventory page currently exposes a gallery rather than individual product details. Apex Golf Carts' `robots.txt` disallows crawling, so its product listings are not imported. Product prices and stock should be confirmed before purchase.
