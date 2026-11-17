ALTER TABLE public.profiles
  DROP CONSTRAINT profiles_role_check,
  ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('superadmin', 'admin', 'staff'));

CREATE OR REPLACE FUNCTION public.is_admin()
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
      AND role IN ('superadmin', 'admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

DROP POLICY profiles_read_self_or_superadmin ON public.profiles;
DROP POLICY profiles_manage_superadmin ON public.profiles;

CREATE POLICY profiles_read_self_or_admin
  ON public.profiles FOR SELECT TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR (SELECT public.is_superadmin())
    OR ((SELECT public.is_admin()) AND role <> 'superadmin')
  );

CREATE POLICY profiles_manage_superadmin
  ON public.profiles FOR ALL TO authenticated
  USING ((SELECT public.is_superadmin()))
  WITH CHECK ((SELECT public.is_superadmin()));

CREATE POLICY profiles_manage_admin
  ON public.profiles FOR ALL TO authenticated
  USING (
    (SELECT public.is_admin())
    AND role <> 'superadmin'
    AND id <> (SELECT auth.uid())
  )
  WITH CHECK (
    (SELECT public.is_admin())
    AND role <> 'superadmin'
    AND id <> (SELECT auth.uid())
  );

DROP POLICY product_categories_read_active ON public.product_categories;
DROP POLICY product_categories_manage_superadmin ON public.product_categories;
CREATE POLICY product_categories_read_active
  ON public.product_categories FOR SELECT TO anon, authenticated
  USING (is_active OR (SELECT public.is_admin()));
CREATE POLICY product_categories_manage_admin
  ON public.product_categories FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY products_read_published ON public.products;
DROP POLICY products_manage_superadmin ON public.products;
CREATE POLICY products_read_published
  ON public.products FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_admin()));
CREATE POLICY products_manage_admin
  ON public.products FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY product_category_assignments_read_published ON public.product_category_assignments;
DROP POLICY product_category_assignments_manage_superadmin ON public.product_category_assignments;
CREATE POLICY product_category_assignments_read_published
  ON public.product_category_assignments FOR SELECT TO anon, authenticated
  USING (
    (SELECT public.is_admin())
    OR EXISTS (
      SELECT 1
      FROM public.products AS product
      JOIN public.product_categories AS category ON category.id = category_id
      WHERE product.id = product_id
        AND product.is_published
        AND category.is_active
    )
  );
CREATE POLICY product_category_assignments_manage_admin
  ON public.product_category_assignments FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY blog_categories_read_active ON public.blog_categories;
DROP POLICY blog_categories_manage_superadmin ON public.blog_categories;
CREATE POLICY blog_categories_read_active
  ON public.blog_categories FOR SELECT TO anon, authenticated
  USING (is_active OR (SELECT public.is_admin()));
CREATE POLICY blog_categories_manage_admin
  ON public.blog_categories FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY blog_tags_read ON public.blog_tags;
DROP POLICY blog_tags_manage_superadmin ON public.blog_tags;
CREATE POLICY blog_tags_read
  ON public.blog_tags FOR SELECT TO anon, authenticated
  USING (is_active OR (SELECT public.is_admin()));
CREATE POLICY blog_tags_manage_admin
  ON public.blog_tags FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY blog_posts_read_published ON public.blog_posts;
DROP POLICY blog_posts_manage_superadmin ON public.blog_posts;
CREATE POLICY blog_posts_read_published
  ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (
    (status = 'published' AND published_at <= now())
    OR (SELECT public.is_admin())
  );
CREATE POLICY blog_posts_manage_admin
  ON public.blog_posts FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY blog_post_tags_read_published ON public.blog_post_tags;
DROP POLICY blog_post_tags_manage_superadmin ON public.blog_post_tags;
CREATE POLICY blog_post_tags_read_published
  ON public.blog_post_tags FOR SELECT TO anon, authenticated
  USING (
    (SELECT public.is_admin())
    OR EXISTS (
      SELECT 1
      FROM public.blog_posts AS post
      WHERE post.id = post_id
        AND post.status = 'published'
        AND post.published_at <= now()
    )
  );
CREATE POLICY blog_post_tags_manage_admin
  ON public.blog_post_tags FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY faqs_read_published ON public.faqs;
DROP POLICY faqs_manage_superadmin ON public.faqs;
CREATE POLICY faqs_read_published
  ON public.faqs FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_admin()));
CREATE POLICY faqs_manage_admin
  ON public.faqs FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY site_settings_read_public ON public.site_settings;
DROP POLICY site_settings_manage_superadmin ON public.site_settings;
CREATE POLICY site_settings_read_public
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (is_public OR (SELECT public.is_admin()));
CREATE POLICY site_settings_manage_admin
  ON public.site_settings FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY rental_rates_read_published ON public.rental_rates;
DROP POLICY rental_rates_manage_superadmin ON public.rental_rates;
CREATE POLICY rental_rates_read_published
  ON public.rental_rates FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_admin()));
CREATE POLICY rental_rates_manage_admin
  ON public.rental_rates FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY service_areas_read_published ON public.service_areas;
DROP POLICY service_areas_manage_superadmin ON public.service_areas;
CREATE POLICY service_areas_read_published
  ON public.service_areas FOR SELECT TO anon, authenticated
  USING (is_published OR (SELECT public.is_admin()));
CREATE POLICY service_areas_manage_admin
  ON public.service_areas FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY catalog_media_superadmin_upload ON storage.objects;
DROP POLICY catalog_media_superadmin_update ON storage.objects;
DROP POLICY catalog_media_superadmin_delete ON storage.objects;
CREATE POLICY catalog_media_admin_upload
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_admin())
  );
CREATE POLICY catalog_media_admin_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_admin())
  )
  WITH CHECK (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_admin())
  );
CREATE POLICY catalog_media_admin_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_admin())
  );
