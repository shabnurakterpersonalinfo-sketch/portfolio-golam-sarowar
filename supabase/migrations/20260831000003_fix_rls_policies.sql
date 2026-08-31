-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow authenticated users full access to education" ON education;
DROP POLICY IF EXISTS "Allow authenticated users full access to experiences" ON experiences;
DROP POLICY IF EXISTS "Allow authenticated users full access to publications" ON publications;
DROP POLICY IF EXISTS "Allow authenticated users full access to skills" ON skills;
DROP POLICY IF EXISTS "Allow authenticated users full access to awards" ON awards;
DROP POLICY IF EXISTS "Allow authenticated users full access to volunteering" ON volunteering;
DROP POLICY IF EXISTS "Allow authenticated users full access to scholarly_activities" ON scholarly_activities;
DROP POLICY IF EXISTS "Allow authenticated users full access to blogs" ON blogs;
DROP POLICY IF EXISTS "Allow authenticated users full access to certifications" ON certifications;
DROP POLICY IF EXISTS "Allow authenticated users full access to profiles" ON profiles;

-- Create separate policies for INSERT, UPDATE, DELETE operations
-- Education table policies
CREATE POLICY "Allow authenticated users to insert education"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update education"
  ON education FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete education"
  ON education FOR DELETE
  TO authenticated
  USING (true);

-- Experiences table policies
CREATE POLICY "Allow authenticated users to insert experiences"
  ON experiences FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update experiences"
  ON experiences FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete experiences"
  ON experiences FOR DELETE
  TO authenticated
  USING (true);

-- Publications table policies
CREATE POLICY "Allow authenticated users to insert publications"
  ON publications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update publications"
  ON publications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete publications"
  ON publications FOR DELETE
  TO authenticated
  USING (true);

-- Skills table policies
CREATE POLICY "Allow authenticated users to insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

-- Awards table policies
CREATE POLICY "Allow authenticated users to insert awards"
  ON awards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update awards"
  ON awards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete awards"
  ON awards FOR DELETE
  TO authenticated
  USING (true);

-- Volunteering table policies
CREATE POLICY "Allow authenticated users to insert volunteering"
  ON volunteering FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update volunteering"
  ON volunteering FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete volunteering"
  ON volunteering FOR DELETE
  TO authenticated
  USING (true);

-- Scholarly activities table policies
CREATE POLICY "Allow authenticated users to insert scholarly_activities"
  ON scholarly_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update scholarly_activities"
  ON scholarly_activities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete scholarly_activities"
  ON scholarly_activities FOR DELETE
  TO authenticated
  USING (true);

-- Blogs table policies
CREATE POLICY "Allow authenticated users to insert blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (true);

-- Certifications table policies
CREATE POLICY "Allow authenticated users to insert certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update certifications"
  ON certifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete certifications"
  ON certifications FOR DELETE
  TO authenticated
  USING (true);

-- Profiles table policies
CREATE POLICY "Allow authenticated users to insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (true);
