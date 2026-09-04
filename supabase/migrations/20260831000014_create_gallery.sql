-- Gallery: a photo/story timeline the client can add to from /admin/gallery,
-- shown as a "Media Coverage"-style teaser on the homepage (big preview + list,
-- click an entry to swap the preview) and as a full chronological timeline on the
-- dedicated /gallery page.

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  story TEXT,
  image TEXT,
  event_date TEXT NOT NULL,
  location TEXT,
  external_link TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to gallery_items"
  ON gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert gallery_items"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update gallery_items"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete gallery_items"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (true);

-- Storage bucket for gallery photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access to Gallery Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON storage.objects;

CREATE POLICY "Public Access to Gallery Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated users can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);
