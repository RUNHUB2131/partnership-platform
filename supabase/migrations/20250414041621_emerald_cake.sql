/*
  # Fix Profile RLS Policies

  1. Changes
    - Add policy to allow profile creation during signup
    - Add policy to allow service role to manage profiles
    - Remove admin user deletion on profile creation failure
  
  2. Security
    - Enable RLS on profiles table (if not already enabled)
    - Add policies for profile management
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_service_role_all" ON profiles;

-- Add policy for profile creation during signup
CREATE POLICY "allow_profile_creation_on_signup"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id 
  AND role IN ('brand', 'club')
);

-- Add policy for service role to manage all profiles
CREATE POLICY "service_role_manage_all_profiles"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);