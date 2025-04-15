/*
  # Remove email history while preserving database structure

  1. Changes
    - Remove specific email records from profiles table
    - Maintain database structure and constraints
*/

DO $$ 
BEGIN
  -- Delete specific profile records
  DELETE FROM profiles 
  WHERE email IN (
    'test@example.com',
    'test2@example.com'
  );
END $$;