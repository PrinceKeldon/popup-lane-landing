-- Add tier and popularity tracking to merchants
ALTER TABLE public.merchants
ADD COLUMN tier text CHECK (tier IN ('featured', 'trending', 'standard')),
ADD COLUMN click_count integer NOT NULL DEFAULT 0;

-- Add discount and offer fields to merchant_products
ALTER TABLE public.merchant_products
ADD COLUMN discount_percentage integer,
ADD COLUMN original_price numeric,
ADD COLUMN offer_text text,
ADD COLUMN image_urls jsonb DEFAULT '[]'::jsonb;

-- Create index for trending merchants
CREATE INDEX idx_merchants_click_count ON public.merchants(click_count DESC) WHERE application_status = 'Approved';

-- Create index for tier filtering
CREATE INDEX idx_merchants_tier ON public.merchants(tier) WHERE application_status = 'Approved';