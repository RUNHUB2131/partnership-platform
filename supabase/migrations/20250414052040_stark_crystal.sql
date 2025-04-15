/*
  # Fix Profile RLS Policies

  1. Changes
    - Drop all existing profile policies to ensure clean state
    - Add new policies with proper permissions for profile creation
    - Enable RLS on profiles table
    - Add policies for authenticated users and service role
    - Ensure proper access control for profiles

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users and service role
    - Ensure users can only access their own data
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
DROP POLICY IF EXISTS "Service role has full access to profiles" ON profiles;
DROP POLICY IF EXISTS "allow_profile_creation_on_signup" ON profiles;
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_service_role_all" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users creating their profile" ON profiles;
DROP POLICY IF EXISTS "Enable select for users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users modifying own profile" ON profiles;
DROP POLICY IF EXISTS "Enable all actions for service role" ON profiles;

-- Create new policies with proper permissions
CREATE POLICY "Enable all actions for service role"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users creating their profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  role IN ('brand', 'club')
);

CREATE POLICY "Enable select for users to read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Enable update for users modifying own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);