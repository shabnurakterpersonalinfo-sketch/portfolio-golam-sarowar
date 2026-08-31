-- Add image column to awards table
ALTER TABLE awards 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Create storage bucket for award images
INSERT INTO storage.buckets (id, name, public)
VALUES ('award-images', 'award-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access to Award Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload award images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update award images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete award images" ON storage.objects;

-- Allow public read access to award images
CREATE POLICY "Public Access to Award Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'award-images');

-- Allow authenticated users to upload award images
CREATE POLICY "Authenticated users can upload award images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'award-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update award images
CREATE POLICY "Authenticated users can update award images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'award-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete award images
CREATE POLICY "Authenticated users can delete award images"
ON storage.objects FOR DELETE
USING (bucket_id = 'award-images' AND auth.uid() IS NOT NULL);

