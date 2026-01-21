# Giaom Marketplace Setup Instructions

## Quick Start (Using User Switcher - No Database Required)

The easiest way to test the marketplace is using the built-in **User Switcher**:

1. Look for the floating button in the bottom-right corner
2. Click it to switch between Guest, Customer, Seller, and Admin roles
3. Explore the different features for each role

This mode works without any database setup and lets you see all the UI features immediately.

## Full Database Setup (Optional)

If you want to use real authentication and persistent data:

### Step 1: Run the Database Schema Script

1. Go to the **scripts** folder
2. Find `001_create_tables.sql`
3. Click the **Run** button to execute it
4. This creates all necessary tables in your Supabase database

### Step 2: Create Your First Account

1. Click **Sign In** in the header
2. Go to **Sign Up**
3. Create an account with your email and password
4. Check your email for the confirmation link
5. Confirm your email address

### Step 3: Become a Seller (Optional)

1. Login with your new account
2. Click **Become a Seller** in the header
3. Fill out the business information form
4. Submit your seller application

### Step 4: Approve Your Seller Account

Since you're the first user, you need to manually set yourself as admin:

1. Open Supabase dashboard
2. Go to Table Editor > profiles
3. Find your user record
4. Change the `role` field from `customer` to `admin`
5. Save the changes

Now when you login, you'll have admin access!

### Step 5: Approve Sellers and Products

As an admin:
1. Go to your profile (click your email in header)
2. Navigate to **Seller Approvals** tab
3. Approve pending sellers (including yourself if you applied)
4. Go to **Product Approvals** tab to approve products

### Step 6: Add Products (As Seller)

Once you're an approved seller:
1. Go to your seller profile
2. Click **Add New Product**
3. Fill in product details
4. Submit for approval
5. Switch to admin role to approve your products

## Features by User Role

### Guest (No Login)
- Browse products on homepage
- View product details
- Add items to cart
- View cart contents
- Cannot complete checkout

### Customer (Logged In)
- All guest features
- Complete checkout process
- Save shipping information
- View order history (coming soon)

### Seller (Approved)
- All customer features
- Add new products
- Edit existing products
- Delete products
- View product performance
- Track sales

### Admin
- All seller features
- View all users
- Approve/reject seller applications
- Approve/reject products
- Manage marketplace

## Troubleshooting

### "Supabase not configured" message in console
- The app automatically falls back to user switcher mode
- All UI works perfectly without database
- Great for testing and development

### Cannot execute SQL script
- Make sure you're connected to Supabase (check Vars section)
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist
- Try refreshing the page

### Products not showing
- The seed script requires manual setup
- Easier to add products through the seller dashboard
- Or use user switcher mode to see mock products

### Login not working
- Verify email confirmation
- Check Supabase Auth settings
- Make sure RLS policies are enabled

## Environment Variables Required

The following should be automatically set by the Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

Check these in the **Vars** section of the in-chat sidebar.
