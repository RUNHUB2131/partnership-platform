/*
  # Initial Schema Setup for Run Club Platform

  1. New Tables
    - `profiles`: Extends Supabase auth.users with role and profile info
    - `brands`: Brand-specific profile information
    - `run_clubs`: Run club-specific profile information
    - `opportunities`: Brand-created event opportunities
    - `applications`: Run club applications to opportunities

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Ensure users can only access their own data
    - Public read access for opportunities
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('brand', 'club')),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create run_clubs table
CREATE TABLE IF NOT EXISTS run_clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  location text NOT NULL,
  member_count integer DEFAULT 0,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  budget_range text NOT NULL,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  requirements text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  club_id uuid NOT NULL REFERENCES run_clubs(id) ON DELETE CASCADE,
  proposal text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(opportunity_id, club_id)
);

-- Create functions and triggers for role validation
CREATE OR REPLACE FUNCTION check_brand_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.user_id AND role = 'brand'
  ) THEN
    RAISE EXCEPTION 'User must have brand role to create brand profile';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_club_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.user_id AND role = 'club'
  ) THEN
    RAISE EXCEPTION 'User must have club role to create run club profile';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER ensure_brand_role
  BEFORE INSERT OR UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION check_brand_role();

CREATE TRIGGER ensure_club_role
  BEFORE INSERT OR UPDATE ON run_clubs
  FOR EACH ROW
  EXECUTE FUNCTION check_club_role();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Brands policies
CREATE POLICY "Brands can read own profile"
  ON brands FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Brands can update own profile"
  ON brands FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can read brand profiles"
  ON brands FOR SELECT
  TO anon
  USING (true);

-- Run clubs policies
CREATE POLICY "Run clubs can read own profile"
  ON run_clubs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Run clubs can update own profile"
  ON run_clubs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can read run club profiles"
  ON run_clubs FOR SELECT
  TO anon
  USING (true);

-- Opportunities policies
CREATE POLICY "Brands can CRUD own opportunities"
  ON opportunities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = opportunities.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read opportunities"
  ON opportunities FOR SELECT
  TO anon
  USING (true);

-- Applications policies
CREATE POLICY "Run clubs can create and read own applications"
  ON applications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM run_clubs
      WHERE run_clubs.id = applications.club_id
      AND run_clubs.user_id = auth.uid()
    )
  );

CREATE POLICY "Brands can read applications for their opportunities"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM opportunities
      JOIN brands ON brands.id = opportunities.brand_id
      WHERE opportunities.id = applications.opportunity_id
      AND brands.user_id = auth.uid()
    )
  );