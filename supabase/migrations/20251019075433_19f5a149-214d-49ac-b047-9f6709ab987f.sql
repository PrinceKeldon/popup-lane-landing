-- Create merchants table
CREATE TABLE public.merchants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  brand_name TEXT NOT NULL,
  website_url TEXT,
  social_media TEXT,
  category TEXT,
  application_status TEXT NOT NULL DEFAULT 'Pending',
  airtable_record_id TEXT,
  spots_claimed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create merchant_products table
CREATE TABLE public.merchant_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT NOT NULL,
  price NUMERIC,
  website_url TEXT,
  social_media TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchants table
CREATE POLICY "Merchants can view their own record"
ON public.merchants
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Merchants can update their own record"
ON public.merchants
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public can count merchants for spots tracking"
ON public.merchants
FOR SELECT
TO anon
USING (true);

-- RLS Policies for merchant_products table
CREATE POLICY "Merchants can view their own products"
ON public.merchant_products
FOR SELECT
TO authenticated
USING (
  merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Merchants can insert their own products"
ON public.merchant_products
FOR INSERT
TO authenticated
WITH CHECK (
  merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Merchants can update their own products"
ON public.merchant_products
FOR UPDATE
TO authenticated
USING (
  merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Merchants can delete their own products"
ON public.merchant_products
FOR DELETE
TO authenticated
USING (
  merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_merchants_updated_at
BEFORE UPDATE ON public.merchants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_merchant_products_updated_at
BEFORE UPDATE ON public.merchant_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();