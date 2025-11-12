# The Backroom - Implementation Guide

## Overview

**The Backroom** is PopUp Lane's permanent merchant directory that operates year-round alongside The Lane's seasonal pop-up events. This document provides a comprehensive implementation guide for developers.

## Architecture

### Database Schema

#### `merchant_backroom_stats` Table
Tracks backroom-specific analytics separate from active lane metrics.

```sql
CREATE TABLE merchant_backroom_stats (
  id UUID PRIMARY KEY,
  merchant_id UUID REFERENCES merchants(id),
  backroom_views INTEGER DEFAULT 0,
  backroom_clicks INTEGER DEFAULT 0,
  last_viewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

#### `merchants` Table Extensions
Existing fields used for backroom functionality:
- `backroom_status`: Controls visibility in backroom ('active', 'hidden', 'archived')
- `season_joined`: Tags which season the merchant joined (e.g., "Black Friday '25")
- `status`: Overall merchant status (also affects backroom visibility)

### Component Architecture

```
src/components/backroom/
├── BackroomHero.tsx          # Hero section for backroom mode
├── BackroomDirectory.tsx     # Main directory grid with filtering
├── BackroomMerchantCard.tsx  # Individual merchant card
├── BackroomFilters.tsx       # Category, season, sort filters
└── BackroomBanner.tsx        # Sticky waitlist CTA banner
```

## Core Components

### BackroomHero
Displays the backroom landing section with next season countdown.

**Props:**
```typescript
interface BackroomHeroProps {
  nextSeasonDate?: Date;
  merchantCount: number;
}
```

**Features:**
- Shows "🏛️ Directory Mode" badge
- Displays total merchant count
- Next season countdown
- Waitlist CTA button

### BackroomDirectory
Main directory component with filtering and merchant grid.

**Props:**
```typescript
interface BackroomDirectoryProps {
  onMerchantClick: (id: string) => void;
  onSaveMerchant: (id: string) => void;
  savedMerchantIds: string[];
}
```

**Query Logic:**
```typescript
const query = supabase
  .from('merchants')
  .select('*')
  .eq('application_status', 'Approved')
  .or('status.is.null,status.eq.active');
```

**Features:**
- Category filtering (dynamic from merchant data)
- Season filtering (dynamic from merchant data)
- Sort options: Alphabetical, Recently Added, Most Saved
- Responsive grid: 4 cols desktop, 2 tablet, 1 mobile
- Automatic analytics tracking on view

### BackroomMerchantCard
Simplified merchant card for directory browsing.

**Props:**
```typescript
interface BackroomMerchantCardProps {
  merchant: Merchant;
  onSave: () => void;
  isSaved: boolean;
  onClick: () => void;
}
```

**Design Differences from Active Lane:**
- No urgency badges or "LIVE" indicators
- No pricing/offers displayed
- Muted color palette (desaturated primary)
- Shows "Joined: {season}" tag
- Simple "Visit Store" button

### BackroomFilters
Filtering UI for category, season, and sort.

**Props:**
```typescript
interface BackroomFiltersProps {
  selectedCategory: string;
  selectedSeason: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onSeasonChange: (season: string) => void;
  onSortChange: (sort: string) => void;
  categories: string[];
  seasons: string[];
}
```

**Features:**
- Category badges (clickable)
- Season dropdown
- Sort dropdown
- Responsive layout (stacks on mobile)

### BackroomBanner
Sticky bottom banner for waitlist conversion.

**Features:**
- Dismissible (stores in localStorage)
- CTA: "Get Notified" → links to landing page
- Shows only once per session (until dismissed)
- Fixed positioning at bottom of viewport

## Analytics Integration

### Tracking Pattern
All backroom interactions include `mode: 'backroom'` metadata:

```typescript
await supabase.from('merchant_analytics').insert({
  merchant_id: merchantId,
  event_type: 'view', // or 'click'
  metadata: { mode: 'backroom' },
});

// Also increment backroom-specific stats
await supabase.rpc('increment_backroom_stat', {
  p_merchant_id: merchantId,
  p_stat_type: 'views' // or 'clicks'
});
```

### Database Function
`increment_backroom_stat` upserts backroom stats:

```sql
CREATE FUNCTION increment_backroom_stat(
  p_merchant_id UUID,
  p_stat_type TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO merchant_backroom_stats (merchant_id, backroom_views, backroom_clicks)
  VALUES (
    p_merchant_id,
    CASE WHEN p_stat_type = 'views' THEN 1 ELSE 0 END,
    CASE WHEN p_stat_type = 'clicks' THEN 1 ELSE 0 END
  )
  ON CONFLICT (merchant_id) DO UPDATE SET
    backroom_views = merchant_backroom_stats.backroom_views + 
      CASE WHEN p_stat_type = 'views' THEN 1 ELSE 0 END,
    backroom_clicks = merchant_backroom_stats.backroom_clicks + 
      CASE WHEN p_stat_type = 'clicks' THEN 1 ELSE 0 END,
    last_viewed = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Integration with TheLane.tsx

### Conditional Rendering Logic
```typescript
const { laneStatus } = useLaneSettings();

return (
  <>
    <SEOHead 
      title={laneStatus === "open" 
        ? "The Lane — Live Pop-Up Event" 
        : "The Backroom — Merchant Directory"
      }
    />
    
    {laneStatus === "open" ? (
      <>
        <LaneHero />
        <LaneFeed />
      </>
    ) : (
      <>
        <BackroomHero />
        <BackroomDirectory />
        <BackroomBanner />
      </>
    )}
  </>
);
```

## Design System

### Color Tokens
**Active Lane Mode:**
- Primary: `hsl(var(--primary))` (wine red #8B1538)
- Accent: Pulsing animations, urgency indicators

**Backroom Mode:**
- Primary: Desaturated variant (muted wine #9B4858)
- Accent: Subtle hover effects, no pulsing
- Background: More whitespace, soft textures

### Typography
**Active Lane:**
- Bold headlines
- Tight spacing
- High contrast

**Backroom:**
- Medium weight
- Relaxed spacing
- Softer contrast

## SEO & Structured Data

### Dynamic Schema.org Markup
```typescript
const structuredData = laneStatus === "open" 
  ? {
      "@type": "Event",
      "name": "PopUp Lane — Live Shopping Event",
      "eventStatus": "https://schema.org/EventScheduled",
      // ... event fields
    }
  : {
      "@type": "ItemList",
      "name": "The Backroom — Merchant Directory",
      "numberOfItems": merchantCount,
      // ... list fields
    };
```

## Admin Controls

### Merchant Table Enhancements
- **Backroom Status Column**: Dropdown (Active/Hidden/Archived)
- **Season Joined Column**: Editable text field
- **Bulk Actions**: "Add to Backroom", "Set Season", etc.

### Analytics Dashboard
New "Backroom Engagement" card showing:
- Total views (30 days)
- Total clicks (30 days)
- Avg session duration
- Waitlist conversions from backroom

## Testing Checklist

- [ ] Backroom displays when `lane_status = 'closed'`
- [ ] Active lane displays when `lane_status = 'open'`
- [ ] Category filtering works
- [ ] Season filtering works
- [ ] Sort options change order correctly
- [ ] Save functionality persists
- [ ] Analytics track with correct mode
- [ ] Backroom stats increment properly
- [ ] Banner dismisses and remembers state
- [ ] Mobile responsive on all screen sizes
- [ ] SEO metadata updates based on mode
- [ ] Admin can edit backroom_status per merchant
- [ ] Performance: Query time < 500ms with 100+ merchants

## Edge Cases

1. **Merchant has approved status but inactive**: Do not show in backroom
2. **No season_joined set**: Show without season tag
3. **Empty filters**: Display "No merchants found" message
4. **Banner dismissed**: Respect localStorage across sessions

## Future Enhancements

- Season archive pages (`/seasons/black-friday-25`)
- Backroom collections (curated lists)
- Advanced filters (price range, location, values)
- Merchant story pages for deeper discovery
- Community features (Lane Club integration)

## Performance Notes

- Use `useQuery` with proper cache keys
- Lazy load images on merchant cards
- Paginate if merchant count exceeds 100
- Index `backroom_status` and `season_joined` columns for faster filtering

## Related Documentation

- [Backroom.md](./Backroom.md) - Original specification
- [the-lane-club.md](./the-lane-club.md) - Community features
- [COUNTDOWN_SYNC.md](./COUNTDOWN_SYNC.md) - Season timing logic
