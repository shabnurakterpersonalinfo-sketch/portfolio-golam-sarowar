-- Hero slider, round 2 (client feedback):
-- 1. A slide can show hand-picked entries instead of the latest ones:
--    selection_mode = 'latest' (newest `item_limit` entries) or 'selected' (the
--    entries listed in item_ids, in that order).
-- 2. The Introduction slide (name, title, bio, photo) becomes a row of its own so
--    it can be hidden and moved to any position. There is exactly one, it can't be
--    deleted from the admin, and it doesn't count toward the 5-slide limit.
-- Run after 20261021000000_hero_slides_and_entry_media.sql.

ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS selection_mode TEXT NOT NULL DEFAULT 'latest';
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS item_ids UUID[] NOT NULL DEFAULT '{}';

ALTER TABLE hero_slides DROP CONSTRAINT IF EXISTS hero_slides_selection_mode_check;
ALTER TABLE hero_slides ADD CONSTRAINT hero_slides_selection_mode_check
  CHECK (selection_mode IN ('latest', 'selected'));

ALTER TABLE hero_slides DROP CONSTRAINT IF EXISTS hero_slides_slide_type_check;
ALTER TABLE hero_slides ADD CONSTRAINT hero_slides_slide_type_check CHECK (
  slide_type IN (
    'introduction',
    'experiences',
    'education',
    'publications',
    'awards',
    'scholarly_activities',
    'certifications',
    'volunteering',
    'gallery'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS hero_slides_single_introduction
  ON hero_slides (slide_type)
  WHERE slide_type = 'introduction';

-- The 5-slide limit applies to section slides only.
CREATE OR REPLACE FUNCTION enforce_hero_slides_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slide_type <> 'introduction'
     AND (SELECT COUNT(*) FROM hero_slides WHERE slide_type <> 'introduction') >= 5 THEN
    RAISE EXCEPTION 'You can add at most 5 hero slides. Delete one before adding another.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the Introduction row once, in first position.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM hero_slides WHERE slide_type = 'introduction') THEN
    UPDATE hero_slides SET display_order = COALESCE(display_order, 0) + 1;
    INSERT INTO hero_slides (slide_type, is_active, display_order)
    VALUES ('introduction', true, 0);
  END IF;
END $$;
