-- Add video column to publications table for conference videos
ALTER TABLE publications 
ADD COLUMN IF NOT EXISTS conference_videos TEXT[];

-- Create storage bucket for conference videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('conference-videos', 'conference-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access to Conference Videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload conference videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update conference videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete conference videos" ON storage.objects;

-- Allow public read access to conference videos
CREATE POLICY "Public Access to Conference Videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'conference-videos');

-- Allow authenticated users to upload conference videos
CREATE POLICY "Authenticated users can upload conference videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'conference-videos' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update conference videos
CREATE POLICY "Authenticated users can update conference videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'conference-videos' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete conference videos
CREATE POLICY "Authenticated users can delete conference videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'conference-videos' AND auth.uid() IS NOT NULL);

