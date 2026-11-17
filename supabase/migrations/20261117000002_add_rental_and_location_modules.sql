ALTER TABLE public.faqs
  ADD COLUMN category text NOT NULL DEFAULT 'general'
  CHECK (category IN ('general', 'rental'));

CREATE INDEX faqs_public_category_order_idx
  ON public.faqs (category, display_order)
  WHERE is_published = true;

CREATE TABLE public.rental_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  passenger_capacity integer,
  daily_price_zar bigint NOT NULL CHECK (daily_price_zar >= 0),
  weekly_price_zar bigint NOT NULL CHECK (weekly_price_zar >= 0),
  monthly_price_zar bigint NOT NULL CHECK (monthly_price_zar >= 0),
  includes_delivery boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (passenger_capacity IS NULL OR passenger_capacity > 0)
);

CREATE INDEX rental_rates_public_order_idx
  ON public.rental_rates (display_order, name)
  WHERE is_published = true;

CREATE TABLE public.service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  towns jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(towns) = 'array'),
  overview text NOT NULL DEFAULT '',
  use_cases jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(use_cases) = 'array'),
  considerations text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX service_areas_public_order_idx
  ON public.service_areas (display_order, name)
  WHERE is_published = true;

CREATE TRIGGER rental_rates_set_updated_at
BEFORE UPDATE ON public.rental_rates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER service_areas_set_updated_at
BEFORE UPDATE ON public.service_areas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.rental_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY rental_rates_read_published
  ON public.rental_rates FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_superadmin()));
CREATE POLICY rental_rates_manage_superadmin
  ON public.rental_rates FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY service_areas_read_published
  ON public.service_areas FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_superadmin()));
CREATE POLICY service_areas_manage_superadmin
  ON public.service_areas FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

GRANT SELECT ON public.rental_rates, public.service_areas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.rental_rates, public.service_areas TO authenticated;
