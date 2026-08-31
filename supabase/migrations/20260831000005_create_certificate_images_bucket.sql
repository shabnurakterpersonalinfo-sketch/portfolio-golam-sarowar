-- Create storage bucket for certificate images
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-images', 'certificate-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to certificate images
CREATE POLICY "Public Access to Certificate Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-images');

-- Allow authenticated users to upload certificate images
CREATE POLICY "Authenticated users can upload certificate images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificate-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update certificate images
CREATE POLICY "Authenticated users can update certificate images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificate-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete certificate images
CREATE POLICY "Authenticated users can delete certificate images"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificate-images' AND auth.uid() IS NOT NULL);

