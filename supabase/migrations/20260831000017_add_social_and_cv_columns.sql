-- Adds ResearchGate, Google Scholar and YouTube profile links plus a downloadable
-- CV file URL to the profiles table, so the admin Profile page can capture them and
-- the public pages (hero "Download CV" button, contact section, footer) can use them
-- instead of a hardcoded static file. Also creates a public "cv-files" storage bucket
-- so the CV PDF can be uploaded and replaced from the admin panel.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS researchgate_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS googlescholar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Storage bucket for the CV/resume file (public read, authenticated write).
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-files', 'cv-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to CV Files"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-files');

CREATE POLICY "Authenticated users can upload CV files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update CV files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cv-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete CV files"
ON storage.objects FOR DELETE
USING (bucket_id = 'cv-files' AND auth.uid() IS NOT NULL);
