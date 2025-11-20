-- Ensure at least one lane_settings row exists with default values
INSERT INTO lane_settings (early_access_date, lane_close_date, lane_status, spots_limit)
SELECT 
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '14 days', 
  'closed',
  50
WHERE NOT EXISTS (SELECT 1 FROM lane_settings LIMIT 1);