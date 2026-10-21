-- Hero slider + LinkedIn-style media on Education and Experience entries.
--
-- 1. hero_slides: extra homepage hero slides the client picks from /admin/hero-slides.
--    The first hero slide (name, title, bio, photo) is always shown and is not stored
--    here. Each row names a section (slide_type) whose latest entries the slide
--    summarises, newest first. At most 5 rows are allowed (enforced by a trigger).
-- 2. education / experiences: a logo, a website link (institution or company page)
--    and a `media` list of photos, certificates and links, shown under each entry.
-- 3. entry-media storage bucket for those uploads.

CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_type TEXT NOT NULL CHECK (
    slide_type IN (
      'experiences',
      'education',
      'publications',
      'awards',
      'scholarly_activities',
      'certifications',
      'volunteering',
      'gallery'
    )
  ),
  heading TEXT,
  subheading TEXT,
  item_limit INTEGER NOT NULL DEFAULT 3 CHECK (item_limit BETWEEN 1 AND 4),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION enforce_hero_slides_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM hero_slides) >= 5 THEN
    RAISE EXCEPTION 'You can add at most 5 hero slides. Delete one before adding another.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS hero_slides_limit ON hero_slides;
CREATE TRIGGER hero_slides_limit
  BEFORE INSERT ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION enforce_hero_slides_limit();

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated users to insert hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated users to update hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated users to delete hero_slides" ON hero_slides;

CREATE POLICY "Allow public read access to hero_slides"
  ON hero_slides FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert hero_slides"
  ON hero_slides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hero_slides"
  ON hero_slides FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete hero_slides"
  ON hero_slides FOR DELETE
  TO authenticated
  USING (true);

-- media: [{ "type": "photo" | "certificate" | "link", "title": "...", "url": "...",
--           "thumbnail": "...", "description": "..." }]
ALTER TABLE education ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE experiences ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO storage.buckets (id, name, public)
VALUES ('entry-media', 'entry-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access to Entry Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload entry media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update entry media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete entry media" ON storage.objects;

CREATE POLICY "Public Access to Entry Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'entry-media');

CREATE POLICY "Authenticated users can upload entry media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'entry-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update entry media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'entry-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete entry media"
ON storage.objects FOR DELETE
USING (bucket_id = 'entry-media' AND auth.uid() IS NOT NULL);
