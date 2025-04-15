/*
  # Authentication System Setup

  1. Tables
    - profiles: Extends Supabase auth.users with role information
  
  2. Security
    - Enable RLS
    - Add policies for profile management
    - Ensure proper role validation
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('brand', 'club')),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for authenticated users with valid role"
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = id 
  AND role = ANY (ARRAY['brand'::text, 'club'::text])
);

CREATE POLICY "Enable read access to own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Enable update access to own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable service role full access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);