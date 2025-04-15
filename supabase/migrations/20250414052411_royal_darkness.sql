/*
  # Fix profiles table RLS policies

  1. Changes
    - Update RLS policies for profiles table to allow new user creation
    - Add policy for service role to manage profiles
    - Add policy for authenticated users to create their own profile
    
  2. Security
    - Maintain strict RLS while allowing necessary operations
    - Ensure users can only create their own profile with valid role
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable all actions for service role" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users creating their profile" ON profiles;
DROP POLICY IF EXISTS "Enable select for users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users modifying own profile" ON profiles;

-- Recreate policies with correct permissions
CREATE POLICY "Enable all actions for service role"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users creating their profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id 
  AND role = ANY (ARRAY['brand'::text, 'club'::text])
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