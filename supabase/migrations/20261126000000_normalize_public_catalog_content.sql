-- Use CartScout product titles, stable short slugs, and locally hosted photos.
WITH cleaned AS (
  SELECT
    product.id,
    product.source_product_id,
    btrim(regexp_replace(
      regexp_replace(
        regexp_replace(product.name, '&#215;', 'x', 'gi'),
        '\s+Golf Carts?.*$',
        '',
        'gi'
      ),
      '\s+Golf Cart.*$',
      '',
      'gi'
    )) AS base_name,
    NULLIF(substring(product.name FROM '\m([2-8])\s+Passenger\M'), '') AS capacity
  FROM public.products AS product
  WHERE product.is_published = true
    AND product.source_product_id IS NOT NULL
), titles AS (
  SELECT
    cleaned.id,
    cleaned.source_product_id,
    btrim(regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(cleaned.base_name, '\([^)]*\)', '', 'g'),
          '\m[2-8]\s*Passenger\M',
          '',
          'gi'
        ),
        '\m(Electric|Lithium(-Ion)?|Lifted|HP|Gas)\M',
        '',
        'gi'
      ),
      '\m(Special Edition|Limited Edition|Sunday Red|Forward-Facing|Plus)\M',
      '',
      'gi'
    ),
      '\s+',
      ' ',
      'g'
    )) || CASE
      WHEN cleaned.capacity IS NOT NULL THEN ' ' || cleaned.capacity || '-Seater'
      ELSE ''
    END || ' Golf Cart' AS title
  FROM cleaned
)
UPDATE public.products AS product
SET
  name = titles.title,
  slug = regexp_replace(lower(titles.title), '[^a-z0-9]+', '-', 'g')
    || '-' || titles.source_product_id::text,
  description = 'The ' || titles.title || ' is listed in CartScout''s golf cart collection. Contact our team to confirm its condition, specifications, included equipment, current availability, final rand price, and delivery arrangements for your location.',
  seo_title = titles.title,
  seo_description = 'Explore this CartScout listing. Enquire to confirm specifications, current availability, final rand price, and delivery arrangements.',
  source_url = NULL,
  image_url = '/images/carts/'
    || regexp_replace(lower(titles.title), '[^a-z0-9]+', '-', 'g')
    || '-' || titles.source_product_id::text || '.webp',
  source_price = NULL,
  source_currency = NULL,
  exchange_rate_zar_per_unit = NULL,
  exchange_rate_as_of = NULL,
  image_gallery = '[]'::jsonb,
  updated_at = now()
FROM titles
WHERE product.id = titles.id;

UPDATE public.faqs AS faq
SET
  question = 'How are catalogue prices shown?',
  answer = 'Catalogue amounts are shown in South African rand for comparison only; they are estimates, not confirmed offers. Ask CartScout to confirm the final price, delivery charges, and availability.',
  updated_at = now()
WHERE faq.category = 'general'
  AND faq.question = 'How are catalogue prices calculated?';
