ALTER TABLE public.product_categories
  ADD COLUMN is_rule_based boolean NOT NULL DEFAULT false;

ALTER TABLE public.products
  ADD COLUMN passenger_capacity smallint
    CHECK (passenger_capacity IS NULL OR passenger_capacity BETWEEN 1 AND 12),
  ADD COLUMN powertrain text
    CHECK (powertrain IS NULL OR powertrain IN ('electric', 'gas', 'other')),
  ADD COLUMN battery_type text
    CHECK (battery_type IS NULL OR battery_type IN ('lithium', 'lead-acid', 'other'));

UPDATE public.products
SET
  passenger_capacity = COALESCE(
    passenger_capacity,
    CASE
      WHEN attributes ->> 'passenger_capacity' ~ '^[1-9][0-2]?$'
        THEN (attributes ->> 'passenger_capacity')::smallint
      WHEN substring(name FROM '([2-8])[- ]?[Ss]eater') IS NOT NULL
        THEN substring(name FROM '([2-8])[- ]?[Ss]eater')::smallint
      WHEN substring(name FROM '([2-8])[[:space:]]+[Pp]assenger') IS NOT NULL
        THEN substring(name FROM '([2-8])[[:space:]]+[Pp]assenger')::smallint
      ELSE NULL
    END
  ),
  powertrain = COALESCE(
    powertrain,
    CASE
      WHEN lower(attributes ->> 'powertrain') IN ('electric', 'gas', 'other')
        THEN lower(attributes ->> 'powertrain')
      WHEN name ~* '(^|[^[:alnum:]])(gas|petrol)([^[:alnum:]]|$)' THEN 'gas'
      WHEN name ~* '(^|[^[:alnum:]])(electric|lithium|li[- ]?ion)([^[:alnum:]]|$)' THEN 'electric'
      ELSE NULL
    END
  ),
  battery_type = COALESCE(
    battery_type,
    CASE
      WHEN lower(attributes ->> 'battery_type') IN ('lithium', 'lead-acid', 'other')
        THEN lower(attributes ->> 'battery_type')
      WHEN name ~* '(^|[^[:alnum:]])(lithium|li[- ]?ion)([^[:alnum:]]|$)' THEN 'lithium'
      WHEN name ~* '(^|[^[:alnum:]])lead[- ]?acid([^[:alnum:]]|$)' THEN 'lead-acid'
      ELSE NULL
    END
  );

INSERT INTO public.product_categories
  (name, slug, description, display_order, is_active, is_rule_based)
VALUES
  ('Electric Golf Carts', 'electric-golf-carts', 'Products explicitly classified with an electric powertrain.', 1, true, true),
  ('2-Seater Golf Carts', '2-seater-golf-carts', 'Golf carts with a verified passenger capacity of two.', 2, true, true),
  ('4-Seater Golf Carts', '4-seater-golf-carts', 'Golf carts with a verified passenger capacity of four.', 3, true, true),
  ('6-Seater Golf Carts', '6-seater-golf-carts', 'Golf carts with a verified passenger capacity of six.', 4, true, true),
  ('Gas Golf Carts', 'gas-golf-carts', 'Products explicitly classified with a gas powertrain.', 5, true, true),
  ('Lithium Golf Carts', 'lithium-golf-carts', 'Products with a lithium battery type recorded.', 6, true, true),
  ('Club Car', 'club-car', 'Golf carts identified as Club Car models.', 7, true, true),
  ('E-Z-GO', 'e-z-go', 'Golf carts identified as E-Z-GO models.', 8, true, true),
  ('Yamaha', 'yamaha', 'Golf carts identified as Yamaha models.', 9, true, true),
  ('Denago', 'denago', 'Golf carts identified as Denago models.', 10, true, true),
  ('Evolution', 'evolution', 'Golf carts identified as Evolution models.', 11, true, true)
ON CONFLICT (slug) DO UPDATE
SET is_rule_based = EXCLUDED.is_rule_based;

CREATE OR REPLACE FUNCTION public.sync_product_category_assignments()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.product_category_assignments AS assignment
  USING public.product_categories AS category
  WHERE assignment.product_id = NEW.id
    AND assignment.category_id = category.id
    AND category.is_rule_based;

  INSERT INTO public.product_category_assignments (product_id, category_id)
  SELECT NEW.id, category.id
  FROM public.product_categories AS category
  WHERE category.is_rule_based
    AND (
      (category.slug = 'electric-golf-carts' AND NEW.powertrain = 'electric')
      OR (category.slug = '2-seater-golf-carts' AND NEW.passenger_capacity = 2)
      OR (category.slug = '4-seater-golf-carts' AND NEW.passenger_capacity = 4)
      OR (category.slug = '6-seater-golf-carts' AND NEW.passenger_capacity = 6)
      OR (category.slug = 'gas-golf-carts' AND NEW.powertrain = 'gas')
      OR (category.slug = 'lithium-golf-carts' AND NEW.battery_type = 'lithium')
      OR (category.slug = 'club-car' AND NEW.name ILIKE '%Club Car%')
      OR (category.slug = 'e-z-go' AND NEW.name ~* '(E-Z-GO|EZGO)')
      OR (category.slug = 'yamaha' AND NEW.name ILIKE '%Yamaha%')
      OR (category.slug = 'denago' AND NEW.name ILIKE '%Denago%')
      OR (category.slug = 'evolution' AND NEW.name ILIKE '%Evolution%')
    )
  ON CONFLICT (product_id, category_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER products_sync_rule_based_categories
AFTER INSERT OR UPDATE OF name, passenger_capacity, powertrain, battery_type
ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.sync_product_category_assignments();

REVOKE ALL ON FUNCTION public.sync_product_category_assignments() FROM PUBLIC;

DELETE FROM public.product_category_assignments AS assignment
USING public.product_categories AS category
WHERE assignment.category_id = category.id
  AND category.is_rule_based;

INSERT INTO public.product_category_assignments (product_id, category_id)
SELECT product.id, category.id
FROM public.products AS product
CROSS JOIN public.product_categories AS category
WHERE category.is_rule_based
  AND (
    (category.slug = 'electric-golf-carts' AND product.powertrain = 'electric')
    OR (category.slug = '2-seater-golf-carts' AND product.passenger_capacity = 2)
    OR (category.slug = '4-seater-golf-carts' AND product.passenger_capacity = 4)
    OR (category.slug = '6-seater-golf-carts' AND product.passenger_capacity = 6)
    OR (category.slug = 'gas-golf-carts' AND product.powertrain = 'gas')
    OR (category.slug = 'lithium-golf-carts' AND product.battery_type = 'lithium')
    OR (category.slug = 'club-car' AND product.name ILIKE '%Club Car%')
    OR (category.slug = 'e-z-go' AND product.name ~* '(E-Z-GO|EZGO)')
    OR (category.slug = 'yamaha' AND product.name ILIKE '%Yamaha%')
    OR (category.slug = 'denago' AND product.name ILIKE '%Denago%')
    OR (category.slug = 'evolution' AND product.name ILIKE '%Evolution%')
  )
ON CONFLICT (product_id, category_id) DO NOTHING;

UPDATE public.faqs
SET answer = 'The catalogue lists golf carts for enquiry. Contact CartScout about a specific make or model and confirm current availability, sales or rental options, and any delivery arrangements for your address.'
WHERE category = 'general'
  AND question = 'Are the golf carts in CartScout''s collection available in South Africa?';

UPDATE public.faqs
SET answer = 'Share your full address and preferred timing. CartScout will confirm whether delivery can be arranged, its cost and timing, and current availability for your purchase.'
WHERE category = 'general'
  AND question = 'Can a golf cart be delivered to my province?';

UPDATE public.faqs
SET answer = 'Send the event location, dates, passenger count and number of carts. CartScout will check whether the request can be accommodated and confirm availability, delivery, collection and rental terms.'
WHERE category = 'general'
  AND question = 'Can I request carts for an event or group?';

UPDATE public.faqs
SET answer = 'Share your town or full delivery address, dates and passenger requirements. CartScout will confirm whether a rental can be arranged for that location, along with delivery, collection and any related costs.'
WHERE category = 'rental'
  AND question = 'Which areas can I request golf cart hire in?';
