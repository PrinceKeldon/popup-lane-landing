-- Fix security definer issue by explicitly setting the view to SECURITY INVOKER
DROP VIEW IF EXISTS public.public_merchants;

CREATE VIEW public.public_merchants
WITH (security_invoker = true) AS
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
FROM public.merchants
WHERE application_status = 'Approved';

-- Grant SELECT access to the view for anonymous and authenticated users
GRANT SELECT ON public.public_merchants TO anon, authenticated;