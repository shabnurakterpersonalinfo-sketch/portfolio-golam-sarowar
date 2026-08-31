-- Step 1: Add conference-specific columns to publications table
ALTER TABLE publications 
ADD COLUMN IF NOT EXISTS conference_title TEXT,
ADD COLUMN IF NOT EXISTS conference_organizer TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS conference_images TEXT[],
ADD COLUMN IF NOT EXISTS conference_paper_pdf TEXT;

-- Step 2: Update category constraint to include Conference Publication
-- Note: Since category is TEXT, no constraint update needed, but we ensure it's available

-- Step 3: Create index for better query performance on category
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(category);

