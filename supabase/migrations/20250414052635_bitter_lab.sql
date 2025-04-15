/*
  # Fix Profile RLS Policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Create new policies that properly handle profile creation
    - Ensure authenticated users can create their own profile
    - Maintain security while allowing necessary operations

  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Profile creation during signup
      - Profile reading/updating for own user
      - Service role access for system operations
*/

-- First enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable all actions for service role" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users creating their profile" ON profiles;
DROP POLICY IF EXISTS "Enable select for users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users modifying own profile" ON profiles;

-- Create new policies with proper security rules
CREATE POLICY "Enable all actions for service role"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow profile creation during signup
CREATE POLICY "Enable insert for users creating their profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  role IN ('brand', 'club')
);

-- Allow users to read their own profile
CREATE POLICY "Enable select for users to read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for users modifying own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);