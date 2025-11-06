-- Fix merchant_trending_stats view to use security_invoker
-- This makes the view respect RLS policies on underlying tables

DROP VIEW IF EXISTS public.merchant_trending_stats;

CREATE VIEW public.merchant_trending_stats
WITH (security_invoker = true) AS
SELECT 
  m.id,
  m.brand_name,
  m.tier,
  m.last_trending_update,
  COUNT(CASE WHEN ma.event_type = 'click' AND ma.created_at > NOW() - INTERVAL '7 days' THEN 1 END)::bigint as clicks_7d,
  COUNT(CASE WHEN ma.event_type = 'view' AND ma.created_at > NOW() - INTERVAL '7 days' THEN 1 END)::bigint as views_7d,
  COUNT(CASE WHEN ma.event_type = 'click' AND ma.created_at > NOW() - INTERVAL '24 hours' THEN 1 END)::bigint as clicks_24h,
  COUNT(CASE WHEN ma.event_type = 'view' AND ma.created_at > NOW() - INTERVAL '24 hours' THEN 1 END)::bigint as views_24h,
  m.click_count as total_clicks
FROM public.merchants m
LEFT JOIN public.merchant_analytics ma ON m.id = ma.merchant_id
WHERE m.application_status = 'Approved' 
  AND (m.status IS NULL OR m.status = 'active')
GROUP BY m.id, m.brand_name, m.tier, m.click_count, m.last_trending_update;