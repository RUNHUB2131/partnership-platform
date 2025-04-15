/*
  # Fix profile policies and ensure clean state

  1. Changes
    - Drop existing policies to ensure clean state
    - Enable RLS on profiles table
    - Add policies for authenticated users and service role
    - Ensure proper access control for profiles

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users and service role
    - Ensure users can only access their own data
*/

-- Enable RLS on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Service role has full access" ON public.profiles;
    DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Service role has full access to profiles" ON public.profiles;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Create new policies with consistent naming
CREATE POLICY "profiles_read_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_service_role_all"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);