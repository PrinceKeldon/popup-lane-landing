-- Create analytics tracking table
CREATE TABLE IF NOT EXISTS public.merchant_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'product_view')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.merchant_analytics ENABLE ROW LEVEL SECURITY;

-- Public can insert analytics events
CREATE POLICY "Anyone can insert analytics events"
ON public.merchant_analytics
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can view analytics
CREATE POLICY "Admins can view analytics"
ON public.merchant_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_merchant_analytics_merchant_id ON public.merchant_analytics(merchant_id);
CREATE INDEX idx_merchant_analytics_created_at ON public.merchant_analytics(created_at DESC);
CREATE INDEX idx_merchant_analytics_event_type ON public.merchant_analytics(event_type);

-- Add last trending update timestamp to merchants
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS last_trending_update TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create a view for trending analytics (security handled by underlying table RLS)
CREATE OR REPLACE VIEW public.merchant_trending_stats AS
SELECT 
  m.id,
  m.brand_name,
  m.tier,
  COUNT(CASE WHEN ma.event_type = 'click' AND ma.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as clicks_7d,
  COUNT(CASE WHEN ma.event_type = 'view' AND ma.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as views_7d,
  COUNT(CASE WHEN ma.event_type = 'click' AND ma.created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as clicks_24h,
  COUNT(CASE WHEN ma.event_type = 'view' AND ma.created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as views_24h,
  m.click_count as total_clicks,
  m.last_trending_update
FROM public.merchants m
LEFT JOIN public.merchant_analytics ma ON m.id = ma.merchant_id
WHERE m.application_status = 'Approved' 
  AND (m.status IS NULL OR m.status = 'active')
GROUP BY m.id, m.brand_name, m.tier, m.click_count, m.last_trending_update;