/*
  # Add RLS policies for profiles table

  1. Security Changes
    - Add INSERT policy to allow authenticated users to create their own profile
    - Add policy for service role to bypass RLS (needed for initial profile creation)

  Note: Existing SELECT and UPDATE policies are already in place
*/

-- Allow authenticated users to create their own profile
CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow service role to bypass RLS (needed for initial profile creation)
CREATE POLICY "Service role has full access to profiles"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);