-- Admin users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can read their own data
CREATE POLICY "Admins can read their own data"
  ON admin_users FOR SELECT
  USING (auth.uid()::text = id::text);

-- RLS Policy: Allow authenticated users to read admin table
CREATE POLICY "Authenticated users can read admin_users"
  ON admin_users FOR SELECT
  USING (auth.uid() IS NOT NULL);
