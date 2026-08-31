-- Adds ORCID iD and Twitter/X profile link fields to the profiles table,
-- so the admin panel can capture them and the public pages can show them
-- alongside LinkedIn/Facebook/GitHub.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS orcid_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
