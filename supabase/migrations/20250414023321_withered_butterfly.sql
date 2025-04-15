/*
  # Add Run Clubs RLS Policies

  1. Changes
    - Add RLS policies for run clubs table to allow:
      - Authenticated users to create their own profile
      - Users to read and update their own profile
      - Public read access to all profiles

  2. Security
    - Ensures users can only create/modify their own profiles
    - Maintains public read access for all profiles
*/

-- Add policy for creating run club profiles
CREATE POLICY "Users can create their own run club profile"
ON run_clubs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add policy for updating run club profiles
CREATE POLICY "Users can update their own run club profile"
ON run_clubs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);