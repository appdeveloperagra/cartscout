-- Keep every product detail URL descriptive and deterministic.
WITH normalized_products AS (
  SELECT
    id,
    trim(both '-' FROM regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')) AS name_slug,
    COALESCE(source_product_id::text, replace(id::text, '-', '')) AS identifier
  FROM public.products
)
UPDATE public.products AS product
SET slug = COALESCE(NULLIF(normalized.name_slug, ''), 'golf-cart') || '-' || normalized.identifier
FROM normalized_products AS normalized
WHERE normalized.id = product.id;
