# AI-Powered Trending System

## Overview

The PopUp Lane platform now features an **AI-powered trending detection system** that automatically analyzes merchant engagement data and assigns "trending" status based on real-time analytics.

## How It Works

### Automatic Trending Detection

1. **Analytics Tracking**: Every time a shopper interacts with a merchant card (views, clicks, product views), the event is logged in the `merchant_analytics` table.

2. **AI Analysis**: The system uses Lovable AI (Google Gemini) to analyze engagement patterns including:
   - Recent activity (last 24 hours and 7 days)
   - Click-to-view ratios (engagement quality)
   - Sudden spikes in activity
   - Historical performance

3. **Smart Selection**: The AI automatically selects 3-5 merchants to mark as "trending" based on the analysis, prioritizing:
   - Merchants with high recent engagement
   - Strong click-through rates
   - Sudden popularity increases
   - Only "standard" tier merchants (featured merchants remain featured)

### Tier System

- **Standard**: Default tier for all approved merchants
- **Featured** ⭐: Admin-controlled premium placement
- **Trending** 📈: Automatically assigned by AI based on engagement analytics

## Admin Controls

### Manual Trigger

Admins can manually trigger a trending analysis at any time from the Admin Dashboard:

1. Navigate to the Admin Dashboard
2. Find the "AI Trending Analysis" card
3. Click "Update Now" to run the analysis immediately

### Tier Management

- **Featured tier**: Full admin control - manually promote/demote merchants
- **Trending tier**: Read-only for admins - automatically assigned by AI
- Trending merchants show "Auto-assigned by AI" in the tier management table

## Automated Scheduling (Optional)

To run trending analysis automatically on a schedule, you can set up a cron job using Supabase's `pg_cron` extension.

### Setup Instructions

**IMPORTANT**: Use the Supabase insert tool (not migration tool) to run this SQL, as it contains project-specific data.

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule trending update to run every 6 hours
SELECT cron.schedule(
  'update-trending-merchants',
  '0 */6 * * *',  -- Every 6 hours at minute 0
  $$
  SELECT net.http_post(
    url:='https://rvjlpzahlcgfdxecrjkq.supabase.co/functions/v1/update-trending-merchants',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2amxwemFobGNnZmR4ZWNyamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODA1OTMsImV4cCI6MjA3NTk1NjU5M30.kxulItuT1a-PepVNbC27322AAO9PKVzKxoHHwiyzNqE"}'::jsonb,
    body:='{}'::jsonb
  ) as request_id;
  $$
);
```

### Cron Schedule Options

- **Every 6 hours**: `'0 */6 * * *'` (Recommended)
- **Every 12 hours**: `'0 */12 * * *'`
- **Daily at midnight**: `'0 0 * * *'`
- **Every 3 hours**: `'0 */3 * * *'`

### View Scheduled Jobs

```sql
SELECT * FROM cron.job;
```

### Remove Scheduled Job

```sql
SELECT cron.unschedule('update-trending-merchants');
```

## Analytics Data

### Tracked Events

- `view`: Merchant card viewed in the feed
- `click`: Merchant card clicked or external link opened
- `product_view`: Product details viewed

### Data Retention

- All analytics data is stored indefinitely
- AI analysis focuses on recent data (7 days) for trending detection
- Historical data available for long-term insights

## Performance Considerations

- Analytics tracking is non-blocking and runs asynchronously
- Failed tracking attempts are logged but don't affect user experience
- AI analysis typically completes in 3-5 seconds
- Trending updates don't require page refresh (reactivity handled by React Query)

## Security

- Analytics table allows public inserts (anonymous tracking)
- Only admins can view analytics data
- AI analysis runs with service role permissions
- Trending assignment bypasses RLS using service role

## Future Enhancements

Potential improvements to the trending system:

1. **Seasonal Adjustments**: Factor in day of week, time of day patterns
2. **Category-Based Trending**: Trending merchants per category
3. **Personalized Trending**: Different trending merchants per user segment
4. **Trending Score Display**: Show engagement metrics to admins
5. **A/B Testing**: Test different trending algorithms
6. **Trend Duration**: Minimum/maximum time a merchant stays trending

## Troubleshooting

### Trending not updating

1. Check the `update-trending-merchants` edge function logs
2. Verify LOVABLE_API_KEY is set correctly
3. Ensure merchants have recent analytics data
4. Manually trigger update from admin dashboard

### No merchants marked as trending

- System needs sufficient analytics data (3+ days recommended)
- At least 5 merchants with recent activity required
- AI may not select trending merchants if engagement is too uniform

### Featured merchants becoming trending

- This shouldn't happen - featured merchants are excluded from trending assignment
- If it occurs, check the edge function logic and RLS policies
