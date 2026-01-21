-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  card_holder_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);