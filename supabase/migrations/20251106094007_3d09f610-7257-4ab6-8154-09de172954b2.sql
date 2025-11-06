-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view approved merchants" ON public.merchants;

-- Create a secure view that excludes email addresses
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
FROM public.merchants
WHERE application_status = 'Approved';

-- Grant SELECT access to the view for anonymous and authenticated users
GRANT SELECT ON public.public_merchants TO anon, authenticated;