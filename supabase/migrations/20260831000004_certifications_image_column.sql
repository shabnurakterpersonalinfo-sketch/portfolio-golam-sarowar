-- Step 1: Create a temporary table to backup existing data
CREATE TABLE IF NOT EXISTS certifications_backup AS
SELECT * FROM certifications;

-- Step 2: Drop the old certifications table
DROP TABLE IF EXISTS certifications CASCADE;

-- Step 3: Recreate certifications table with image column
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_url TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Restore data from backup (image will be NULL for existing records)
INSERT INTO certifications (id, name, issuer, issue_date, credential_url, display_order, created_at, updated_at)
SELECT id, name, issuer, issue_date, credential_url, display_order, created_at, updated_at
FROM certifications_backup;

-- Step 5: Drop the backup table
DROP TABLE IF EXISTS certifications_backup;

-- Step 6: Enable Row Level Security
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Step 7: Recreate RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to certifications" ON certifications;
DROP POLICY IF EXISTS "Allow authenticated users full access to certifications" ON certifications;

-- Public read access
CREATE POLICY "Allow public read access to certifications"
  ON certifications FOR SELECT
  USING (true);

-- Authenticated users full access
CREATE POLICY "Allow authenticated users full access to certifications"
  ON certifications FOR ALL
  USING (auth.uid() IS NOT NULL);

