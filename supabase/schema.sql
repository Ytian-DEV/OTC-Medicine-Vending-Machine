-- ============================================================================
-- Minimal Vending Kiosk — Supabase SQL Schema & Seed Data
-- Paste this entire script into the Supabase SQL Editor and click "Run"
-- ============================================================================

-- 1. Create the `slots` table
CREATE TABLE IF NOT EXISTS public.slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0),
  default_stock INTEGER NOT NULL DEFAULT 10 CHECK (default_stock >= 0),
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create the `transactions` table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items JSONB NOT NULL, -- Array of { slot_code, name, quantity, unit_price, subtotal }
  total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security (RLS) with public prototype kiosk policies
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read slots" ON public.slots;
CREATE POLICY "Allow public read slots"
  ON public.slots FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public update slots stock" ON public.slots;
CREATE POLICY "Allow public update slots stock"
  ON public.slots FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert transactions" ON public.transactions;
CREATE POLICY "Allow public insert transactions"
  ON public.transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read transactions" ON public.transactions;
CREATE POLICY "Allow public read transactions"
  ON public.transactions FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Seed the 9 Philippine Health & Hygiene Vending Machine Products (3x3 Grid)
INSERT INTO public.slots (slot_code, name, price, stock, default_stock, image_url, sort_order)
VALUES
  ('A1', 'Band-Aid',       5.00,   15, 15, '/images/products/band-aid.jpg',      1),
  ('A2', 'Cetirizine',     15.00,  12, 12, '/images/products/cetirizine.jpg',    2),
  ('A3', 'Reusable Pads',  120.00, 8,  8,  '/images/products/reusable-pads.jpg', 3),
  ('B1', 'Neozep',         9.00,   15, 15, '/images/products/neozep.jpg',        4),
  ('B2', 'Biogesic',       6.00,   20, 20, '/images/products/biogesic.jpg',      5),
  ('B3', 'Ascof Forte',    9.00,   15, 15, '/images/products/ascof-forte.jpg',   6),
  ('C1', 'Diatabs',        10.00,  12, 12, '/images/products/diatabs.jpg',       7),
  ('C2', 'Modess Napkin',  8.00,   15, 15, '/images/products/modess-napkin.jpg', 8),
  ('C3', 'Menstrual Cup',  350.00, 5,  5,  '/images/products/menstrual-cup.jpg', 9)
ON CONFLICT (slot_code) DO UPDATE SET
  name          = EXCLUDED.name,
  price         = EXCLUDED.price,
  default_stock = EXCLUDED.default_stock,
  image_url     = EXCLUDED.image_url,
  sort_order    = EXCLUDED.sort_order;

-- 5. Helper RPC Function: Restock all 9 slots back to default stock
CREATE OR REPLACE FUNCTION public.restock_all_slots()
RETURNS SETOF public.slots
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.slots
  SET stock = default_stock,
      updated_at = now()
  RETURNING *;
$$;

-- 6. Helper RPC Function: Atomic stock deduction per slot
CREATE OR REPLACE FUNCTION public.deduct_slot_stock(p_slot_code TEXT, p_qty INTEGER)
RETURNS public.slots
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.slots
  SET stock = GREATEST(0, stock - GREATEST(0, p_qty)),
      updated_at = now()
  WHERE slot_code = p_slot_code
  RETURNING *;
$$;
