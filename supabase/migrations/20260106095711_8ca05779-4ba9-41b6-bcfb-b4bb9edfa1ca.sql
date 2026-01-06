-- Add UNIQUE constraint on merchant_id if not exists
-- First check if constraint exists and only add if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'merchant_backroom_stats_merchant_id_key'
  ) THEN
    ALTER TABLE public.merchant_backroom_stats 
    ADD CONSTRAINT merchant_backroom_stats_merchant_id_key 
    UNIQUE (merchant_id);
  END IF;
END $$;

-- Create the missing RPC function for incrementing backroom stats
CREATE OR REPLACE FUNCTION public.increment_backroom_stat(
  p_merchant_id UUID,
  p_stat_type TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Validate stat_type
  IF p_stat_type NOT IN ('views', 'clicks') THEN
    RAISE EXCEPTION 'Invalid stat_type. Must be views or clicks';
  END IF;

  -- Insert or update backroom stats
  INSERT INTO public.merchant_backroom_stats (
    merchant_id,
    backroom_views,
    backroom_clicks,
    last_viewed,
    created_at,
    updated_at
  )
  VALUES (
    p_merchant_id,
    CASE WHEN p_stat_type = 'views' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'clicks' THEN 1 ELSE 0 END,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (merchant_id) DO UPDATE SET
    backroom_views = merchant_backroom_stats.backroom_views + 
      CASE WHEN p_stat_type = 'views' THEN 1 ELSE 0 END,
    backroom_clicks = merchant_backroom_stats.backroom_clicks + 
      CASE WHEN p_stat_type = 'clicks' THEN 1 ELSE 0 END,
    last_viewed = NOW(),
    updated_at = NOW();
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.increment_backroom_stat(UUID, TEXT) TO anon, authenticated;