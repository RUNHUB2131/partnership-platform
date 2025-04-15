/*
  # Fix RLS Policies and Profile Creation

  1. Changes
    - Consolidate and fix RLS policies for profiles table
    - Remove redundant triggers
    - Add proper error handling
    - Ensure proper order of policy execution
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users and service role
    - Ensure proper access control
*/

-- First, enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and triggers to ensure clean state
DO $$ 
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "service_role_all_access" ON profiles;
    DROP POLICY IF EXISTS "authenticated_create_own_profile" ON profiles;
    DROP POLICY IF EXISTS "authenticated_read_own_profile" ON profiles;
    DROP POLICY IF EXISTS "authenticated_update_own_profile" ON profiles;
    DROP POLICY IF EXISTS "authenticated_delete_own_profile" ON profiles;
    
    -- Drop existing triggers
    DROP TRIGGER IF EXISTS validate_profile_email_trigger ON profiles;
    DROP TRIGGER IF EXISTS validate_profile_trigger ON profiles;
    
    -- Drop existing functions
    DROP FUNCTION IF EXISTS validate_profile_email();
    DROP FUNCTION IF EXISTS validate_profile_on_create();
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Create new policies with proper permissions
-- Service role policy must be first
CREATE POLICY "service_role_all_access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy for creating own profile
CREATE POLICY "authenticated_create_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id 
    AND role = ANY (ARRAY['brand'::text, 'club'::text])
);

-- Policy for reading own profile
CREATE POLICY "authenticated_read_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy for updating own profile
CREATE POLICY "authenticated_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = ANY (ARRAY['brand'::text, 'club'::text])
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);