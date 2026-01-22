-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create seller_profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (current_setting('app.current_user_id')::UUID = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (current_setting('app.current_user_id')::UUID = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (current_setting('app.current_user_id')::UUID = id);

-- Fix infinite recursion in the "Admins can view all profiles" policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  current_setting('app.current_user_role') = 'admin'
);

-- Seller profiles policies
CREATE POLICY "Users can view their own seller profile" ON seller_profiles FOR SELECT USING (current_setting('app.current_user_id')::UUID = user_id);
CREATE POLICY "Users can insert their own seller profile" ON seller_profiles FOR INSERT WITH CHECK (current_setting('app.current_user_id')::UUID = user_id);
CREATE POLICY "Users can update their own seller profile" ON seller_profiles FOR UPDATE USING (current_setting('app.current_user_id')::UUID = user_id);

-- Fix potential recursion in seller_profiles policies
DROP POLICY IF EXISTS "Admins can view all seller profiles" ON seller_profiles;
DROP POLICY IF EXISTS "Admins can update seller profiles" ON seller_profiles;

CREATE POLICY "Admins can view all seller profiles" ON seller_profiles
FOR SELECT USING (
  current_setting('app.current_user_role') = 'admin'
);

CREATE POLICY "Admins can update seller profiles" ON seller_profiles
FOR UPDATE USING (
  current_setting('app.current_user_role') = 'admin'
);

-- Products policies
-- Ensure policies for products table are recreated without errors
DROP POLICY IF EXISTS "Everyone can view approved products" ON products;
DROP POLICY IF EXISTS "Sellers can view their own products" ON products;
DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
DROP POLICY IF EXISTS "Sellers can delete their own products" ON products;

CREATE POLICY "Everyone can view approved products" ON products FOR SELECT USING (status = 'approved');
CREATE POLICY "Sellers can view their own products" ON products FOR SELECT USING (current_setting('app.current_user_id')::UUID = seller_id);
CREATE POLICY "Sellers can insert their own products" ON products FOR INSERT WITH CHECK (current_setting('app.current_user_id')::UUID = seller_id);
CREATE POLICY "Sellers can update their own products" ON products FOR UPDATE USING (current_setting('app.current_user_id')::UUID = seller_id);
CREATE POLICY "Sellers can delete their own products" ON products FOR DELETE USING (current_setting('app.current_user_id')::UUID = seller_id);

-- Fix potential recursion in "Admins can view all products" policy
DROP POLICY IF EXISTS "Admins can view all products" ON products;

CREATE POLICY "Admins can view all products" ON products
FOR SELECT USING (
  current_setting('app.current_user_role') = 'admin'
);

-- Fix potential recursion in "Admins can approve products" policy
DROP POLICY IF EXISTS "Admins can approve products" ON products;

CREATE POLICY "Admins can approve products" ON products
FOR UPDATE USING (
  current_setting('app.current_user_role') = 'admin'
);

-- Modify default status for new products to 'pending'
ALTER TABLE products ALTER COLUMN status SET DEFAULT 'pending';

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    '', -- Default full_name to an empty string
    'customer' -- Default role to 'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
