/*
  # Fix Authentication and RLS Policies

  1. Changes
    - Drop all existing RLS policies for clean slate
    - Create new policies with proper security rules
    - Add explicit policies for all operations
    - Fix profile creation permissions

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
    - Add service role bypass policy
    - Ensure proper role validation
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure clean state
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable all actions for service role" ON profiles;
    DROP POLICY IF EXISTS "Enable insert for authenticated users creating their profile" ON profiles;
    DROP POLICY IF EXISTS "Enable select for users to read own profile" ON profiles;
    DROP POLICY IF EXISTS "Enable update for users modifying own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
    DROP POLICY IF EXISTS "Service role has full access" ON profiles;
    DROP POLICY IF EXISTS "allow_profile_creation_on_signup" ON profiles;
    DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
    DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
    DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
    DROP POLICY IF EXISTS "profiles_service_role_all" ON profiles;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Create service role policy (must be first to ensure system operations work)
CREATE POLICY "service_role_all_access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create policy for profile creation during signup
CREATE POLICY "authenticated_create_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id 
    AND role IN ('brand', 'club')
    AND email = auth.jwt()->>'email'
);

-- Create policy for reading own profile
CREATE POLICY "authenticated_read_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy for updating own profile
CREATE POLICY "authenticated_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
);

-- Create policy for deleting own profile (if needed)
CREATE POLICY "authenticated_delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Create function to validate profile creation
CREATE OR REPLACE FUNCTION public.validate_profile_on_create()
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

-- Create trigger for profile validation
DROP TRIGGER IF EXISTS validate_profile_trigger ON profiles;
CREATE TRIGGER validate_profile_trigger
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_profile_on_create();