ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_scheduled_requires_date
  CHECK (status <> 'scheduled' OR published_at IS NOT NULL);
