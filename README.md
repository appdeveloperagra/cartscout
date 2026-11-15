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

The purchase and rental forms prepare an email in the customer's default email app. The public contact email defaults to `golfcartsrentals@gmail.com`; copy `.env.example` to `.env.local` if you need to override it, then restart the app. No enquiry is stored or sent automatically, and a request is not a confirmed sale or booking.

The site includes About, Rentals, Contact, Privacy, and Terms pages. The privacy and terms pages describe the current website behavior and should be reviewed against the business's legal identity, location, and applicable laws before launch. The catalog is imported from public Mullens Golf Carts listings; price and stock should be confirmed before purchase.

Set `NEXT_PUBLIC_SITE_URL` to the permanent HTTPS domain before launch. Canonical URLs, crawlable sitemap entries, and search indexing are intentionally disabled until that domain is configured; the temporary Hostinger URL should not be indexed as the final site.

The provided rental sources do not expose bookable availability, so rental requests are sent for manual confirmation. Fast Eddie's inventory page currently exposes a gallery rather than individual product details. Apex Golf Carts' `robots.txt` disallows crawling, so its product listings are not imported. Product prices and stock should be confirmed before purchase.
