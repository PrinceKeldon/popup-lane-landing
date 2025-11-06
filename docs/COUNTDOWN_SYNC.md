# Countdown Synchronization Architecture

## Overview
All countdown timers across PopUp Lane are synchronized using a single source of truth from the database, ensuring consistent time display across all pages and user sessions.

## Technical Implementation

### Data Flow
```
Database (lane_settings table)
    ↓
useLaneSettings() hook (5s refetch)
    ↓
useCountdown() hook (UTC normalized)
    ↓
CountdownTimer component (presentational)
```

### Core Components

#### 1. Database Layer
- **Table**: `lane_settings`
- **Key Field**: `early_access_date` (timestamp with time zone)
- **Updates**: Admin changes propagate automatically

#### 2. Data Hook (`useLaneSettings.ts`)
```typescript
export const useLaneSettings = () => {
  const { data: settings } = useQuery({
    queryKey: ["lane-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lane_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // 5-second sync for real-time feel
  });

  return {
    earlyAccessDate: settings?.early_access_date 
      ? new Date(settings.early_access_date) 
      : new Date("2025-11-21T10:00:00"),
    laneStatus: settings?.lane_status || "closed",
    spotsLimit: settings?.spots_limit || 50,
  };
};
```

#### 3. Countdown Logic (`useCountdown.ts`)
```typescript
export const useCountdown = (targetDate: Date): CountdownReturn => {
  useEffect(() => {
    const calculateTimeRemaining = () => {
      // UTC normalization prevents timezone drift
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;
      
      // Calculate days, hours, minutes, seconds...
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
};
```

#### 4. Display Component (`CountdownTimer.tsx`)
- Pure presentational component
- Receives pre-calculated values from `useCountdown`
- Responsive design with mobile-optimized sizing

## UTC Handling

### Why UTC?
Time calculations are performed in UTC to prevent timezone-related bugs when users access the site from different regions.

### Implementation
```typescript
// Normalize both client time and target time to UTC
const now = new Date().getTime();           // Client UTC timestamp
const target = new Date(targetDate).getTime(); // Target UTC timestamp
const difference = target - now;
```

### Database Storage
All timestamps are stored as `timestamp with time zone` in PostgreSQL, which automatically handles timezone conversions.

## Synchronization Guarantees

### Refetch Strategy
- **Interval**: 5 seconds
- **Reason**: Balances real-time feel with server load
- **Result**: All pages sync within 5 seconds of admin changes

### Clock Consistency
- All countdown calculations use `Date.getTime()` for millisecond precision
- Timers update every 1 second via `setInterval`
- React Query cache ensures same data across components

## Usage in Pages

### Landing Page (`/`)
```typescript
import { useLaneSettings } from "@/hooks/useLaneSettings";

const { earlyAccessDate, laneStatus } = useLaneSettings();
const isOpen = laneStatus === "open";

<CountdownTimer 
  targetDate={earlyAccessDate.toISOString()} 
  isOpen={isOpen}
/>
```

### The Lane (`/lane`)
```typescript
const { earlyAccessDate, laneStatus } = useLaneSettings();

<LaneHero 
  isOpen={laneStatus === "open"} 
  nextEventDate={earlyAccessDate.toISOString()}
/>
```

### Admin Dashboard
```typescript
const { earlyAccessDate } = useLaneSettings();
const countdown = useCountdown(earlyAccessDate);

<div>
  {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
</div>
```

## Testing Countdown Sync

### Manual Test
1. Open `/` and `/lane` in separate browser tabs
2. Observe countdown seconds ticking identically
3. Change the date in `/admin` dashboard
4. Verify all pages update within 5 seconds

### Automated Test Checklist
- [ ] Countdown displays identical values across all pages
- [ ] Admin changes propagate within 5 seconds
- [ ] No timezone drift for international users
- [ ] Countdown survives page refresh without jumping
- [ ] Mobile displays countdown without overflow

## Performance Considerations

### Query Optimization
- Single query fetches all lane settings
- React Query cache prevents redundant requests
- 5-second refetch balances UX and server load

### Component Optimization
- `CountdownTimer` is pure presentational (no side effects)
- `useCountdown` hook memoizes calculations
- Parent components control when to show/hide timer

## Migration Notes

### Before (Deprecated)
- **Hook**: `use-lane-state.tsx` (30s refetch, inconsistent)
- **Logic**: Duplicated in `CountdownTimer` component
- **Issues**: Sync delays, timezone bugs

### After (Current)
- **Hook**: `useLaneSettings.ts` (5s refetch, single source)
- **Logic**: Centralized in `useCountdown.ts` with UTC
- **Benefits**: Real-time sync, timezone-safe, maintainable

## Troubleshooting

### Countdown Not Syncing
1. Check React Query devtools for refetch activity
2. Verify database connection in Supabase dashboard
3. Ensure `lane_settings` table has valid timestamp

### Timezone Issues
1. Confirm database uses `timestamp with time zone`
2. Verify `useCountdown` normalizes to UTC
3. Check browser's reported timezone vs server

### Performance Issues
1. Consider increasing refetch interval if needed
2. Monitor React Query cache size
3. Verify countdown cleanup on unmount

## Future Enhancements

### Potential Improvements
- WebSocket connection for instant updates
- Progressive countdown animation
- Accessibility announcements on significant changes
- Countdown pause/resume based on tab visibility

### Monitoring
- Track refetch success rate
- Monitor countdown accuracy drift
- Log timezone-related errors

---

**Last Updated**: 2025-01-13  
**Maintainer**: PopUp Lane Team
