# Test Accounts for Giaom Marketplace

## Important: Create These Accounts First

Before you can use these test accounts, you need to create them in Supabase Auth:

### Option 1: Create via Sign Up Page (Recommended)
1. Go to `/auth/sign-up` in the app
2. Create accounts with these credentials:

### Option 2: Create via Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User" and create each account manually

---

## Test Account Credentials

### Customer Account
- **Email:** `customer@test.com`
- **Password:** `Test123!`
- **Role:** Customer
- **Use for:** Testing shopping, cart, and checkout features

### Seller Account
- **Email:** `seller@test.com`
- **Password:** `Test123!`
- **Role:** Seller (Pre-approved)
- **Use for:** Testing product creation and seller dashboard

### Admin Account
- **Email:** `admin@test.com`
- **Password:** `Test123!`
- **Role:** Admin
- **Use for:** Testing approval systems and user management

---

## Quick Start

1. **Run the database seed script:**
   - Execute `scripts/002_seed_test_users.sql` after creating the auth accounts
   - This adds profile data and test products

2. **Create the auth accounts:**
   - Use the sign-up page to create each account
   - Use the exact emails and passwords listed above

3. **Login and test:**
   - Login with any of the test accounts
   - The seed script will link them to the correct roles

---

## Alternative: Use the User Switcher

For quick testing without authentication:
- Click the floating button in the bottom-right corner
- Switch between Guest, Customer, Seller, and Admin
- This bypasses real authentication for UI testing only
