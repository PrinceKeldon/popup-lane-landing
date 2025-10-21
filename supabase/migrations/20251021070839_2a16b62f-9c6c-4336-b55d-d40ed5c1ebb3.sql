-- Update RLS policies for public access to approved merchants and their products

-- Drop existing policies
DROP POLICY IF EXISTS "Public can count merchants for spots tracking" ON public.merchants;
DROP POLICY IF EXISTS "Merchants can view their own record" ON public.merchants;
DROP POLICY IF EXISTS "Public can view products of approved merchants" ON public.merchant_products;

-- Merchants: Allow public to view approved merchants
CREATE POLICY "Public can view approved merchants" 
ON public.merchants 
FOR SELECT 
USING (application_status = 'Approved');

-- Merchants: Owners can still view their own record (recreate)
CREATE POLICY "Merchants can view their own record" 
ON public.merchants 
FOR SELECT 
USING (auth.uid() = user_id);

-- Products: Allow public to view products of approved merchants
CREATE POLICY "Public can view products of approved merchants" 
ON public.merchant_products 
FOR SELECT 
USING (
  merchant_id IN (
    SELECT id FROM merchants WHERE application_status = 'Approved'
  )
);

-- Add unique constraint on merchant email (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'merchants_email_unique') THEN
    ALTER TABLE public.merchants ADD CONSTRAINT merchants_email_unique UNIQUE (email);
  END IF;
END $$;

-- Enable realtime for lane_settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.lane_settings;