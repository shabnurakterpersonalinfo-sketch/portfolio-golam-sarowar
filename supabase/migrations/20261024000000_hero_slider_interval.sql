-- Hero slider, round 3 (client feedback): how long each slide stays on screen
-- before the homepage slider moves on, set from the admin Hero Slides list.
-- Stored on the single profiles row, next to the other site-wide settings.
-- Run after 20261023000000_hero_slides_selection_and_intro.sql.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hero_slide_interval_seconds INTEGER NOT NULL DEFAULT 5;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_hero_slide_interval_seconds_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_hero_slide_interval_seconds_check
  CHECK (hero_slide_interval_seconds BETWEEN 2 AND 30);
