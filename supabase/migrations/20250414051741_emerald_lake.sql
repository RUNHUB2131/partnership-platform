/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new policies that allow:
      - Profile creation during signup
      - Profile reading by authenticated users
      - Profile updates by owners
      - Service role access for all operations

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
    - Add policies for service role
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "allow_profile_creation_on_signup" ON profiles;
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "service_role_manage_all_profiles" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users creating their profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users to read own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Enable update for users modifying own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable all actions for service role" 
ON profiles FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);