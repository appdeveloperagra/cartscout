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

The importer reads the current catalog source and writes product names, USD prices, stock status, links, and image URLs to `src/data/products.json`. The site displays those prices in whole ZAR using the fixed rate recorded in `src/lib/pricing.ts`.

## Supabase database

The database schema and initial catalogue, rental rates, service areas, and FAQs are versioned in `supabase/migrations`. Do not edit a migration that has already been applied; add a new migration for later database changes.

1. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key. Admin account management also requires `SUPABASE_SERVICE_ROLE_KEY`; keep this server-only key private and never prefix it with `NEXT_PUBLIC_`. Set the public Supabase variables and the service-role key in the production environment.
2. Create a Supabase project, then link this checkout once:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Apply pending migrations to the linked database:

   ```bash
   npm run db:push
   ```

   Check migration status with `npm run db:status`. Both commands explicitly target the linked remote project. Each checked-in migration is applied once; running `db:push` again does not re-seed or overwrite products you manage.

For local development, run `npm run db:local:start` (Docker required). `npm run db:local:reset` recreates the local database and reapplies every migration.

After applying migrations, create the first user in Supabase Auth and grant that account superadmin access once in the Supabase SQL editor:

```sql
UPDATE public.profiles AS profile
SET role = 'superadmin'
FROM auth.users AS auth_user
WHERE profile.id = auth_user.id
  AND auth_user.email = 'your-admin@example.com';
```

Sign in at `/admin`. **Admin → Admin access** creates accounts immediately from an email, display name, password, and role; it does not send an invitation email. Share initial credentials with the user securely. Superadmins can manage all roles. Admins can manage Admin and Staff accounts but cannot view or manage Superadmin accounts. Admins and Superadmins can manage all site content; Staff accounts are read-only and see published content only. Any signed-in team member can change their own password from **Change password** in the sidebar. Product records include SEO title and description fields, a featured image, and a multi-image gallery (up to 12 images); published products have detail pages at `/{slug}`. Product and blog image uploads use the public `catalog-media` Storage bucket. RLS policies enforce these role boundaries.

Once Supabase is configured and migrations are applied, the public catalogue, FAQs, rental rates, location pages, and contact details read published records from the database. Blog articles publish at `/blog`. If Supabase is not configured in local development, catalogue, FAQs, rental rates, location pages, and contact details use the checked-in initial content.

Manage the public contact email, phone number, WhatsApp destination, and business address in **Admin → Site settings** by editing the `public_contact` record. Its value is JSON with `email`, `phone`, `phone_display`, and `address` (an array of address lines); keep **Available to public pages** enabled. The purchase and rental forms prepare a message in the customer's email app or WhatsApp, and customers must send it themselves. No enquiry is stored or sent automatically, and a request is not a confirmed sale or booking.

The homepage highlights a small selection of carts; the complete searchable catalog is available at `/inventory`. Product detail URLs use a stable, descriptive slug based on the product name and source identifier. The site also includes About, Rentals, FAQs, Contact, Privacy, Terms, and Journal pages. Review the privacy and terms pages against the business's legal identity, location, and applicable laws before launch.

The permanent site URL defaults to `https://cartscout.co.za`. Copy `.env.example` to `.env.local` for local builds, and set `NEXT_PUBLIC_SITE_URL=https://cartscout.co.za` in Hostinger's build environment so the deployment uses the same canonical domain. Do not use the temporary Hostinger URL as the canonical domain. The public domain serves the CartScout app over HTTPS, while search indexing remains disabled during development.

Search indexing is intentionally disabled while the site is being completed: `robots.txt` disallows all crawlers and page metadata uses `noindex, nofollow`. Re-enable indexing in `src/app/robots.ts`, `src/app/layout.tsx`, and `src/lib/site-seo.ts` before launch.

Rental availability is checked manually, and enquiries are not reservations. Fast Eddie's inventory page exposes a gallery rather than individual product details. Apex Golf Carts' `robots.txt` disallows crawling, so its product listings are not imported.
