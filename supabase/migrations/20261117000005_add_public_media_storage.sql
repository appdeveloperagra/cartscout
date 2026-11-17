INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'catalog-media',
  'catalog-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY catalog_media_public_read
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'catalog-media');

CREATE POLICY catalog_media_superadmin_upload
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_superadmin())
  );

CREATE POLICY catalog_media_superadmin_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_superadmin())
  )
  WITH CHECK (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_superadmin())
  );

CREATE POLICY catalog_media_superadmin_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'catalog-media'
    AND (SELECT public.is_superadmin())
  );
