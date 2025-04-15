/*
  # Fix authentication and profile creation issues

  1. Changes
    - Add additional validation to profile creation
    - Improve RLS policies for profile management
    - Add indexes for better performance
    - Add trigger for profile email validation

  2. Security
    - Ensure proper role validation
    - Add email validation
    - Improve RLS policies
*/

-- Add email validation function
CREATE OR REPLACE FUNCTION validate_profile_email()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email != (auth.jwt()->>'email') THEN
        RAISE EXCEPTION 'Email must match authenticated user email';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email validation
CREATE TRIGGER validate_profile_email_trigger
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_profile_email();

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update profile creation policy to be more permissive during signup
DROP POLICY IF EXISTS "authenticated_create_own_profile" ON profiles;
CREATE POLICY "authenticated_create_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id 
    AND role = ANY (ARRAY['brand'::text, 'club'::text])
    AND email = (auth.jwt()->>'email'::text)
);

-- Add policy for service role to manage profiles
DROP POLICY IF EXISTS "service_role_all_access" ON profiles;
CREATE POLICY "service_role_all_access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);