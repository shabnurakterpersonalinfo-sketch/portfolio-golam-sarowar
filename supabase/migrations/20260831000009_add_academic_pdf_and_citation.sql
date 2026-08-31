-- Add PDF and citation count columns to publications table for academic publications
ALTER TABLE publications 
ADD COLUMN IF NOT EXISTS academic_pdf TEXT,
ADD COLUMN IF NOT EXISTS citation_count INTEGER DEFAULT 0;

-- Create storage bucket for academic PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('academic-pdfs', 'academic-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access to Academic PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload academic PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update academic PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete academic PDFs" ON storage.objects;

-- Allow public read access to academic PDFs
CREATE POLICY "Public Access to Academic PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'academic-pdfs');

-- Allow authenticated users to upload academic PDFs
CREATE POLICY "Authenticated users can upload academic PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'academic-pdfs' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update academic PDFs
CREATE POLICY "Authenticated users can update academic PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'academic-pdfs' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete academic PDFs
CREATE POLICY "Authenticated users can delete academic PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'academic-pdfs' AND auth.uid() IS NOT NULL);

