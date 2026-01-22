-- Create profiles table
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplication
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Recreate policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (current_setting('app.current_user_id')::UUID = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (current_setting('app.current_user_id')::UUID = id);

-- Update user roles to make them sellers
UPDATE public.profiles
SET role = 'seller'
WHERE role != 'seller';

-- Insert test users into the auth.users table
INSERT INTO auth.users (id, email, hashed_password, created_at)
VALUES
  ('48026aa8-499c-4433-b31e-2e9c60a876ec', 'seller1@example.com', 'dummy_hashed_password', NOW()),
  ('b7a1c2d3-4e5f-6789-0abc-def123456789', 'seller2@example.com', 'dummy_hashed_password', NOW()),
  ('c8d9e0f1-2345-6789-0abc-def123456789', 'seller3@example.com', 'dummy_hashed_password', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test users into the profiles table
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES
  ('48026aa8-499c-4433-b31e-2e9c60a876ec', 'seller1@example.com', 'Seller One', 'seller', NOW(), NOW()),
  ('b7a1c2d3-4e5f-6789-0abc-def123456789', 'seller2@example.com', 'Seller Two', 'seller', NOW(), NOW()),
  ('c8d9e0f1-2345-6789-0abc-def123456789', 'seller3@example.com', 'Seller Three', 'seller', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify the changes
SELECT * FROM public.profiles WHERE role = 'seller';
