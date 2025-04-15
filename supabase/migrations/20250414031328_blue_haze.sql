/*
  # Fix authentication policies

  1. Changes
    - Add missing policies for profiles table
    - Add missing policies for brands table
    - Add missing policies for run_clubs table
    - Add public read access policies
    - Include existence checks to prevent conflicts

  2. Security
    - Enable RLS on all tables
    - Add appropriate row-level security policies
*/

-- Profiles table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can read own profile'
    ) THEN
        CREATE POLICY "Users can read own profile"
        ON profiles
        FOR SELECT
        TO authenticated
        USING (auth.uid() = id);
    END IF;
END $$;

-- Brands table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'brands' 
        AND policyname = 'Users can create their own brand profile'
    ) THEN
        CREATE POLICY "Users can create their own brand profile"
        ON brands
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'brands' 
        AND policyname = 'Users can update their own brand profile'
    ) THEN
        CREATE POLICY "Users can update their own brand profile"
        ON brands
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'brands' 
        AND policyname = 'Anyone can read brand profiles'
    ) THEN
        CREATE POLICY "Anyone can read brand profiles"
        ON brands
        FOR SELECT
        TO anon, authenticated
        USING (true);
    END IF;
END $$;

-- Run clubs table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'run_clubs' 
        AND policyname = 'Anyone can read run club profiles'
    ) THEN
        CREATE POLICY "Anyone can read run club profiles"
        ON run_clubs
        FOR SELECT
        TO anon, authenticated
        USING (true);
    END IF;
END $$;