UPDATE lane_settings 
SET early_access_date = '2026-02-01T15:00:00+00:00',
    lane_close_date = '2026-02-15T23:59:00+00:00'
WHERE id = (SELECT id FROM lane_settings LIMIT 1);