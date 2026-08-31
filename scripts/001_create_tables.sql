-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profile table (single row for the portfolio owner)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  profile_image TEXT,
  linkedin_url TEXT,
  facebook_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  cgpa TEXT,
  location TEXT,
  achievements TEXT,
  status TEXT DEFAULT 'Completed',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professional Experience table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  project_name TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  location TEXT,
  employment_type TEXT DEFAULT 'Full Time',
  description TEXT,
  responsibilities TEXT[],
  category TEXT DEFAULT 'Research',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  journal TEXT,
  publication_date TEXT,
  status TEXT DEFAULT 'Published',
  category TEXT DEFAULT 'Academic Publication',
  citations INTEGER DEFAULT 0,
  keywords TEXT[],
  abstract TEXT,
  url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency TEXT DEFAULT 'Advanced',
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Awards and Honors table
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  certificate_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteering table
CREATE TABLE IF NOT EXISTS volunteering (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarly Activities table
CREATE TABLE IF NOT EXISTS scholarly_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  organization TEXT,
  date TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  published_date TEXT NOT NULL,
  featured_image TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteering ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarly_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access for all tables
CREATE POLICY "Allow public read access to profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to education"
  ON education FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to publications"
  ON publications FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to awards"
  ON awards FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to volunteering"
  ON volunteering FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to scholarly_activities"
  ON scholarly_activities FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to blogs"
  ON blogs FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to certifications"
  ON certifications FOR SELECT
  USING (true);

-- RLS Policies: Allow authenticated users (admin) full access
CREATE POLICY "Allow authenticated users full access to profiles"
  ON profiles FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to education"
  ON education FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to experiences"
  ON experiences FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to publications"
  ON publications FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to skills"
  ON skills FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to awards"
  ON awards FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to volunteering"
  ON volunteering FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to scholarly_activities"
  ON scholarly_activities FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to blogs"
  ON blogs FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users full access to certifications"
  ON certifications FOR ALL
  USING (auth.uid() IS NOT NULL);
