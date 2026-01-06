-- Create a secure public view for merchants that excludes sensitive data
-- This replaces direct public access to the merchants table

-- Drop the existing view if it exists (to recreate with correct columns)
DROP VIEW IF EXISTS public.public_merchants;

-- Create the secure public view excluding sensitive fields
CREATE OR REPLACE VIEW public.public_merchants AS
SELECT 
  id,
  user_id,
  brand_name,
  website_url,
  social_media,
  category,
  application_status,
  tier,
  spots_claimed,
  click_count,
  created_at,
  updated_at
  -- Excluded: email, airtable_record_id, stripe_customer_id, subscription_id, 
  -- subscription_status, backroom_discount, next_lane_discount, beta_merchant,
  -- last_trending_update, backroom_featured_until, season_joined, status, backroom_status
FROM public.merchants
WHERE application_status = 'Approved' 
  AND (status IS NULL OR status = 'active');

-- Grant SELECT on the view to authenticated and anon roles
GRANT SELECT ON public.public_merchants TO authenticated;
GRANT SELECT ON public.public_merchants TO anon;

-- Add a comment explaining the view's purpose
COMMENT ON VIEW public.public_merchants IS 'Public-safe view of approved merchants. Excludes sensitive fields like email, payment info, and internal tracking data.';