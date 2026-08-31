-- Create storage bucket for conference images
INSERT INTO storage.buckets (id, name, public)
VALUES ('conference-images', 'conference-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access to Conference Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload conference images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update conference images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete conference images" ON storage.objects;

-- Allow public read access to conference images
CREATE POLICY "Public Access to Conference Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'conference-images');

-- Allow authenticated users to upload conference images
CREATE POLICY "Authenticated users can upload conference images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'conference-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update conference images
CREATE POLICY "Authenticated users can update conference images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'conference-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete conference images
CREATE POLICY "Authenticated users can delete conference images"
ON storage.objects FOR DELETE
USING (bucket_id = 'conference-images' AND auth.uid() IS NOT NULL);

-- Create storage bucket for conference PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('conference-pdfs', 'conference-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access to Conference PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload conference PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update conference PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete conference PDFs" ON storage.objects;

-- Allow public read access to conference PDFs
CREATE POLICY "Public Access to Conference PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'conference-pdfs');

-- Allow authenticated users to upload conference PDFs
CREATE POLICY "Authenticated users can upload conference PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'conference-pdfs' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update conference PDFs
CREATE POLICY "Authenticated users can update conference PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'conference-pdfs' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete conference PDFs
CREATE POLICY "Authenticated users can delete conference PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'conference-pdfs' AND auth.uid() IS NOT NULL);

