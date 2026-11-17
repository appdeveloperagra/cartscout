CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('superadmin', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'superadmin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_superadmin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_product_id bigint UNIQUE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_zar bigint NOT NULL CHECK (price_zar >= 0),
  source_price numeric(12, 2),
  source_currency text CHECK (source_currency IS NULL OR source_currency ~ '^[A-Z]{3}$'),
  exchange_rate_zar_per_unit numeric(12, 6),
  exchange_rate_as_of date,
  source_url text,
  image_url text,
  in_stock boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attributes) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (source_price IS NULL AND source_currency IS NULL
      AND exchange_rate_zar_per_unit IS NULL AND exchange_rate_as_of IS NULL)
    OR
    (source_price >= 0 AND source_currency IS NOT NULL
      AND exchange_rate_zar_per_unit > 0 AND exchange_rate_as_of IS NOT NULL)
  )
);

CREATE INDEX products_public_catalog_idx
  ON public.products (display_order, created_at DESC)
  WHERE is_published = true;
CREATE INDEX products_source_product_id_idx
  ON public.products (source_product_id)
  WHERE source_product_id IS NOT NULL;

CREATE TABLE public.product_category_assignments (
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.product_categories (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.blog_categories (id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  body_markdown text NOT NULL DEFAULT '',
  featured_image_url text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE INDEX blog_posts_public_listing_idx
  ON public.blog_posts (published_at DESC)
  WHERE status = 'published';

CREATE TABLE public.blog_post_tags (
  post_id uuid NOT NULL REFERENCES public.blog_posts (id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.blog_tags (id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT 'null'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER product_categories_set_updated_at
BEFORE UPDATE ON public.product_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER blog_categories_set_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER blog_posts_set_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER faqs_set_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER site_settings_set_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_category_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_read_self_or_superadmin
  ON public.profiles FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()) OR (SELECT public.is_superadmin()));
CREATE POLICY profiles_manage_superadmin
  ON public.profiles FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY product_categories_read_active
  ON public.product_categories FOR SELECT TO anon, authenticated
  USING (is_active OR (SELECT public.is_superadmin()));
CREATE POLICY product_categories_manage_superadmin
  ON public.product_categories FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY products_read_published
  ON public.products FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_superadmin()));
CREATE POLICY products_manage_superadmin
  ON public.products FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY product_category_assignments_read_published
  ON public.product_category_assignments FOR SELECT TO anon, authenticated
  USING (
    (SELECT public.is_superadmin())
    OR EXISTS (
      SELECT 1
      FROM public.products AS product
      JOIN public.product_categories AS category ON category.id = category_id
      WHERE product.id = product_id
        AND product.is_published
        AND category.is_active
    )
  );
CREATE POLICY product_category_assignments_manage_superadmin
  ON public.product_category_assignments FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY blog_categories_read_active
  ON public.blog_categories FOR SELECT TO anon, authenticated
  USING (is_active OR (SELECT public.is_superadmin()));
CREATE POLICY blog_categories_manage_superadmin
  ON public.blog_categories FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY blog_tags_read
  ON public.blog_tags FOR SELECT TO anon, authenticated
  USING (is_active OR (SELECT public.is_superadmin()));
CREATE POLICY blog_tags_manage_superadmin
  ON public.blog_tags FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY blog_posts_read_published
  ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (
    (status = 'published' AND published_at <= now())
    OR (SELECT public.is_superadmin())
  );
CREATE POLICY blog_posts_manage_superadmin
  ON public.blog_posts FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY blog_post_tags_read_published
  ON public.blog_post_tags FOR SELECT TO anon, authenticated
  USING (
    (SELECT public.is_superadmin())
    OR EXISTS (
      SELECT 1
      FROM public.blog_posts AS post
      WHERE post.id = post_id
        AND post.status = 'published'
        AND post.published_at <= now()
    )
  );
CREATE POLICY blog_post_tags_manage_superadmin
  ON public.blog_post_tags FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY faqs_read_published
  ON public.faqs FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_superadmin()));
CREATE POLICY faqs_manage_superadmin
  ON public.faqs FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY site_settings_read_public
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (is_public OR (SELECT public.is_superadmin()));
CREATE POLICY site_settings_manage_superadmin
  ON public.site_settings FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON
  public.product_categories,
  public.products,
  public.product_category_assignments,
  public.blog_categories,
  public.blog_tags,
  public.blog_posts,
  public.blog_post_tags,
  public.faqs,
  public.site_settings
TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.profiles,
  public.product_categories,
  public.products,
  public.product_category_assignments,
  public.blog_categories,
  public.blog_tags,
  public.blog_posts,
  public.blog_post_tags,
  public.faqs,
  public.site_settings
TO authenticated;
