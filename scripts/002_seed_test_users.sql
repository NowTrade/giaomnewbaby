-- Seed sample products for the marketplace
-- Note: This script only adds products. Users must be created through Supabase Auth.
-- After creating a user through sign-up, you can manually update their role in the profiles table.

-- Only seed products since users must be created through auth system
-- Add sample products from a test seller
-- You'll need to replace the seller_id with an actual user ID from your auth.users table

-- Sample products (uncomment and update seller_id after creating a seller account)
/*
INSERT INTO public.products (seller_id, title, description, price, category, image_url, status, created_at) VALUES
  ('your-seller-user-id-here',
   'Wireless Headphones',
   'High-quality wireless headphones with noise cancellation and 30-hour battery life',
   129.99,
   'Electronics',
   '/placeholder.svg?height=400&width=400',
   'approved',
   NOW()),
  ('your-seller-user-id-here',
   'Smart Watch Pro',
   'Feature-rich smartwatch with health tracking, GPS, and waterproof design',
   249.99,
   'Electronics',
   '/placeholder.svg?height=400&width=400',
   'approved',
   NOW()),
  ('your-seller-user-id-here',
   'Running Shoes',
   'Comfortable running shoes with excellent cushioning for daily training',
   89.99,
   'Fashion',
   '/placeholder.svg?height=400&width=400',
   'approved',
   NOW()),
  ('your-seller-user-id-here',
   'Leather Backpack',
   'Stylish leather backpack perfect for work or travel',
   159.99,
   'Fashion',
   '/placeholder.svg?height=400&width=400',
   'approved',
   NOW()),
  ('your-seller-user-id-here',
   'Coffee Maker Deluxe',
   'Programmable coffee maker with built-in grinder and thermal carafe',
   199.99,
   'Home',
   '/placeholder.svg?height=400&width=400',
   'approved',
   NOW())
ON CONFLICT DO NOTHING;
*/

-- To use this script:
-- 1. Create a user account through the sign-up page
-- 2. Register as a seller using "Become a Seller"
-- 3. Get your user ID from the auth.users table in Supabase
-- 4. Replace 'your-seller-user-id-here' with your actual user ID
-- 5. Uncomment the INSERT statement above
-- 6. Run this script
