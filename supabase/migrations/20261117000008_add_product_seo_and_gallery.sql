ALTER TABLE public.products
  ADD COLUMN seo_title text,
  ADD COLUMN seo_description text,
  ADD COLUMN image_gallery jsonb NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(image_gallery) = 'array');
