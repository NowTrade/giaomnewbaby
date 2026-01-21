# Giaom Marketplace - Full System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Database Schema](#database-schema)
6. [Pages & Routes](#pages--routes)
7. [Components](#components)
8. [Authentication System](#authentication-system)
9. [Shopping Cart System](#shopping-cart-system)
10. [Admin Dashboard](#admin-dashboard)
11. [Seller Dashboard](#seller-dashboard)
12. [Setup Instructions](#setup-instructions)
13. [Environment Variables](#environment-variables)
14. [Deployment](#deployment)

---

## Overview

Giaom is a full-featured marketplace platform similar to Etsy, Amazon, or eBay. It allows:
- **Customers** to browse, search, and purchase products
- **Sellers** to register, list products, and manage their store
- **Admins** to approve sellers, moderate products, and manage users

The platform is built with Next.js 16 and uses Supabase for authentication and database storage.

---

## Current Status: Frontend Demo Mode

**Important:** The app currently runs with **static demo data** for all product listings, categories, and user interfaces. This allows full UI testing and exploration without database setup.

### What Works Now (Demo Mode)
- All pages render correctly with sample data
- Shopping cart (add/remove items, quantities)
- User Switcher to test different roles (Guest, Customer, Seller, Admin)
- Navigation between all pages
- Responsive mobile/desktop layouts
- All UI components and interactions

### What Requires Database Setup
- Real user authentication (login/signup)
- Persisting products to database
- Seller application submissions
- Admin approval workflows
- Order processing and history
- Real-time data updates

### To Enable Full Functionality
See the [Database Setup](#database-setup-manual) section below to create the required tables in Supabase.

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | UI component library |
| **Supabase** | Authentication & PostgreSQL database |
| **Lucide React** | Icon library |

---

## Project Structure

```
giaom/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx        # Login page
│   │   ├── sign-up/page.tsx      # Registration page
│   │   └── sign-up-success/page.tsx
│   ├── become-seller/page.tsx    # Seller registration
│   ├── category/[slug]/page.tsx  # Category listing
│   ├── checkout/page.tsx         # Checkout page
│   ├── product/[id]/page.tsx     # Product detail
│   ├── profile/
│   │   ├── admin/page.tsx        # Admin dashboard
│   │   ├── customer/page.tsx     # Customer profile
│   │   └── seller/page.tsx       # Seller dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── add-product-form.tsx      # Product creation form
│   ├── cart-drawer.tsx           # Shopping cart sidebar
│   ├── categories.tsx            # Category grid
│   ├── featured-products.tsx     # Product grid
│   ├── footer.tsx                # Site footer
│   ├── header.tsx                # Site header with nav
│   ├── hero.tsx                  # Homepage hero section
│   ├── product-approval-list.tsx # Admin product moderation
│   ├── products-list.tsx         # Seller's product list
│   ├── seller-approval-list.tsx  # Admin seller moderation
│   ├── user-management-list.tsx  # Admin user management
│   └── user-switcher.tsx         # Dev tool for role switching
├── lib/                          # Utilities and contexts
│   ├── supabase/                 # Supabase client setup
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── proxy.ts              # Middleware client
│   ├── cart-context.tsx          # Shopping cart state
│   ├── user-context.tsx          # User role state
│   └── utils.ts                  # Helper functions
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts             # Mobile detection hook
├── scripts/                      # Database scripts
│   ├── 001_create_tables.sql     # Schema creation
│   └── 002_seed_test_users.sql   # Sample data
├── public/                       # Static assets
└── Configuration files
    ├── package.json
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── next.config.ts
```

---

## User Roles & Permissions

### Guest (Not Logged In)
- Browse all products and categories
- View product details
- Add items to cart
- Access "Become a Seller" page
- Sign up / Log in

### Customer (Logged In User)
- All guest permissions
- Complete purchases
- View order history
- Manage profile settings
- Save favorites/wishlist

### Seller (Approved Seller)
- All customer permissions
- Access Seller Dashboard
- Add/Edit/Delete own products
- View sales analytics
- Manage store settings

### Admin
- All permissions
- Access Admin Dashboard
- Approve/Reject seller applications
- Approve/Reject product listings
- Manage all users
- View platform analytics

---

## Database Schema

### Tables

#### `profiles`
Stores user profile information linked to Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer', -- 'customer', 'seller', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `seller_profiles`
Extended information for sellers.

```sql
CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  store_name TEXT NOT NULL,
  store_description TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `products`
Product listings.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES seller_profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `orders`
Customer orders.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10,2),
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `order_items`
Individual items in an order.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only read their own profile
- Sellers can only modify their own products
- Admins have full access
- Products with status 'approved' are publicly readable

---

## Pages & Routes

### Public Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, featured products |
| `/product/[id]` | Product detail page |
| `/category/[slug]` | Category listing with filters |
| `/auth/login` | Login page |
| `/auth/sign-up` | Registration page |
| `/become-seller` | Seller registration form |

### Protected Routes

| Route | Required Role | Description |
|-------|---------------|-------------|
| `/profile/customer` | customer+ | Customer profile & orders |
| `/profile/seller` | seller | Seller dashboard |
| `/profile/admin` | admin | Admin dashboard |
| `/checkout` | customer+ | Checkout process |

---

## Components

### Layout Components

#### `Header` (`components/header.tsx`)
- Logo and branding
- Search bar
- Navigation links
- Cart icon with item count
- User menu (login/profile dropdown)
- Mobile hamburger menu

#### `Footer` (`components/footer.tsx`)
- Company information
- Quick links
- Social media links
- Newsletter signup

#### `Hero` (`components/hero.tsx`)
- Main headline and tagline
- Call-to-action buttons
- Background gradient

### Product Components

#### `FeaturedProducts` (`components/featured-products.tsx`)
- Grid of product cards
- Add to cart functionality
- Rating display
- Quick view on hover

#### `Categories` (`components/categories.tsx`)
- Grid of category cards
- Icons and labels
- Links to category pages

### Cart Components

#### `CartDrawer` (`components/cart-drawer.tsx`)
- Slide-out cart panel
- Item list with quantities
- Quantity adjustment (+/-)
- Remove item button
- Subtotal calculation
- Checkout button

### Admin Components

#### `SellerApprovalList` (`components/seller-approval-list.tsx`)
- List of pending seller applications
- Store name, description, date
- Approve/Reject buttons

#### `ProductApprovalList` (`components/product-approval-list.tsx`)
- List of pending products
- Product details preview
- Approve/Reject buttons

#### `UserManagementList` (`components/user-management-list.tsx`)
- List of all users
- Role badges
- Ban/Unban actions

### Seller Components

#### `AddProductForm` (`components/add-product-form.tsx`)
- Product name, description
- Price, stock quantity
- Category selection
- Image upload
- Submit for approval

#### `ProductsList` (`components/products-list.tsx`)
- Seller's product inventory
- Status badges (pending/approved/rejected)
- Edit/Delete actions

---

## Authentication System

### Supabase Auth Integration

The app uses Supabase Auth for user management:

```typescript
// lib/supabase/client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Auth Flow

1. **Sign Up**: User registers with email/password
2. **Email Confirmation**: Supabase sends verification email
3. **Profile Creation**: Trigger creates profile in `profiles` table
4. **Login**: User signs in, JWT stored in cookies
5. **Session**: Middleware refreshes tokens automatically

### User Switcher (Development Mode)

When Supabase is not configured, a "User Switcher" appears:
- Floating button in bottom-right corner
- Switch between Guest, Customer, Seller, Admin
- Allows UI testing without database

---

## Shopping Cart System

### Cart Context (`lib/cart-context.tsx`)

```typescript
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  seller: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}
```

### Features
- Persistent storage (localStorage)
- Real-time item count in header
- Quantity adjustments
- Automatic total calculation
- Clear cart on checkout

---

## Admin Dashboard

### Overview Tab
- Total users count
- Total sellers count
- Total products count
- Revenue summary
- Recent activity

### Seller Approvals Tab
- Pending seller applications
- Application details modal
- Approve/Reject with reason

### Product Approvals Tab
- Pending product listings
- Product preview
- Approve/Reject actions

### User Management Tab
- All registered users
- Filter by role
- Search functionality
- Ban/Unban users

---

## Seller Dashboard

### Overview Tab
- Sales statistics
- Revenue chart
- Recent orders
- Low stock alerts

### Products Tab
- All seller products
- Status filter (all/pending/approved/rejected)
- Add new product button
- Edit/Delete existing products

### Orders Tab
- Orders containing seller's products
- Order status management
- Shipping tracking

### Settings Tab
- Store name and description
- Logo upload
- Payment settings
- Notification preferences

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (optional for demo mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/giaom-marketplace.git
cd giaom-marketplace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

### Demo Mode (No Database)

If Supabase is not configured, the app runs in demo mode:
- All UI features work
- User Switcher available for role testing
- Data is mocked/sample data
- No data persistence

---

## Database Setup (Manual)

To enable full functionality with real data persistence, run the following SQL in your Supabase SQL Editor:

### Step 1: Create Profiles Table

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 2: Create Seller Profiles Table

```sql
CREATE TABLE IF NOT EXISTS public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_description TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seller profiles viewable by everyone" ON public.seller_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can create own seller profile" ON public.seller_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can update own profile" ON public.seller_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Step 3: Create Products Table

```sql
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved products viewable by everyone" ON public.products
  FOR SELECT USING (status = 'approved' OR auth.uid() IN (
    SELECT user_id FROM public.seller_profiles WHERE id = seller_id
  ));

CREATE POLICY "Sellers can create products" ON public.products
  FOR INSERT WITH CHECK (
    seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can update own products" ON public.products
  FOR UPDATE USING (
    seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can delete own products" ON public.products
  FOR DELETE USING (
    seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid())
  );
```

### Step 4: Create Orders Tables

```sql
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );
```

### Step 5: Create Admin User

After creating a user through signup, run this to make them an admin:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes* | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | For admin operations |

*Required for full functionality; demo mode works without

### Setting Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy the Project URL and anon/public key
4. Add to your `.env.local` file

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Post-Deployment

1. Run database migrations in Supabase
2. Set up email templates in Supabase Auth
3. Configure custom domain (optional)
4. Set up monitoring/analytics

---

## API Reference

### Supabase Queries

#### Get Products
```typescript
const { data: products } = await supabase
  .from('products')
  .select('*, seller_profiles(store_name)')
  .eq('status', 'approved')
  .order('created_at', { ascending: false })
```

#### Create Product
```typescript
const { data, error } = await supabase
  .from('products')
  .insert({
    seller_id: sellerId,
    name: productName,
    description: description,
    price: price,
    category: category,
    image_url: imageUrl,
    stock: stock,
    status: 'pending'
  })
```

#### Approve Seller
```typescript
const { error } = await supabase
  .from('seller_profiles')
  .update({ status: 'approved' })
  .eq('id', sellerId)
```

---

## Troubleshooting

### Common Issues

**"Supabase not configured" message**
- Check environment variables are set
- Restart development server
- Use User Switcher for demo mode

**Content pushed to left**
- Verify `tailwind.config.ts` has container configuration
- Check for missing `mx-auto` on container elements

**Missing UI components**
- Run `npm install` to ensure all dependencies
- Check `components/ui/` folder exists

**Build errors**
- Ensure all Radix UI packages are in package.json
- Check for TypeScript errors with `npm run type-check`

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues and feature requests, please open a GitHub issue or contact support@giaom.com
