/*
  # Complete Database Installation Script for RUNHUB

  This script provides a complete database setup including:
  1. Tables
    - profiles (extends auth.users)
    - brands
    - run_clubs
    - opportunities
    - applications
  
  2. Functions
    - validate_profile_on_create
    - check_brand_role
    - check_club_role
  
  3. Security
    - Row Level Security (RLS) policies
    - Validation triggers
    - Role checks
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects to ensure clean installation
DO $$ 
BEGIN
    -- Drop tables if they exist
    DROP TABLE IF EXISTS applications CASCADE;
    DROP TABLE IF EXISTS opportunities CASCADE;
    DROP TABLE IF EXISTS run_clubs CASCADE;
    DROP TABLE IF EXISTS brands CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;

    -- Drop functions if they exist
    DROP FUNCTION IF EXISTS validate_profile_on_create() CASCADE;
    DROP FUNCTION IF EXISTS check_brand_role() CASCADE;
    DROP FUNCTION IF EXISTS check_club_role() CASCADE;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Create profiles table
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('brand', 'club')),
    email text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create brands table
CREATE TABLE brands (
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
CREATE TABLE run_clubs (
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
CREATE TABLE opportunities (
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
CREATE TABLE applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    club_id uuid NOT NULL REFERENCES run_clubs(id) ON DELETE CASCADE,
    proposal text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(opportunity_id, club_id)
);

-- Create profile validation function
CREATE OR REPLACE FUNCTION validate_profile_on_create()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id != auth.uid() THEN
        RAISE EXCEPTION 'User ID must match authenticated user';
    END IF;
    
    IF NEW.role NOT IN ('brand', 'club') THEN
        RAISE EXCEPTION 'Invalid role specified';
    END IF;
    
    IF NEW.email != (auth.jwt()->>'email') THEN
        RAISE EXCEPTION 'Email must match authenticated user';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create brand role check function
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

-- Create club role check function
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
CREATE TRIGGER validate_profile_trigger
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_profile_on_create();

CREATE TRIGGER ensure_brand_role
    BEFORE INSERT OR UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION check_brand_role();

CREATE TRIGGER ensure_club_role
    BEFORE INSERT OR UPDATE ON run_clubs
    FOR EACH ROW
    EXECUTE FUNCTION check_club_role();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "service_role_all_access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_create_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id 
    AND role IN ('brand', 'club')
    AND email = auth.jwt()->>'email'
);

CREATE POLICY "authenticated_read_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "authenticated_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "authenticated_delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Brands table policies
CREATE POLICY "brands_read_own"
ON brands FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "brands_update_own"
ON brands FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "brands_create_own"
ON brands FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "brands_public_read"
ON brands FOR SELECT
TO anon
USING (true);

-- Run clubs table policies
CREATE POLICY "run_clubs_read_own"
ON run_clubs FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "run_clubs_update_own"
ON run_clubs FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "run_clubs_create_own"
ON run_clubs FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "run_clubs_public_read"
ON run_clubs FOR SELECT
TO anon
USING (true);

-- Opportunities table policies
CREATE POLICY "opportunities_brand_all"
ON opportunities FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM brands
        WHERE brands.id = opportunities.brand_id
        AND brands.user_id = auth.uid()
    )
);

CREATE POLICY "opportunities_public_read"
ON opportunities FOR SELECT
TO anon
USING (true);

-- Applications table policies
CREATE POLICY "applications_club_manage"
ON applications FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM run_clubs
        WHERE run_clubs.id = applications.club_id
        AND run_clubs.user_id = auth.uid()
    )
);

CREATE POLICY "applications_brand_read"
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_run_clubs_user_id ON run_clubs(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_brand_id ON opportunities(brand_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_club_id ON applications(club_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);