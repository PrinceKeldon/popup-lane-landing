# The Lane Club — Community Hub

## Overview
The Lane Club is PopUp Lane's community hub where small brands and shoppers connect, share updates, and provide feedback. This first version focuses on merchant engagement, feedback collection, and admin-managed visibility.

## Architecture

### Frontend Pages
- **Main Hub**: `/lane-club` — Public-facing community hub with tabs
- **Admin Management**: `/admin` (Lane Club tab) — Admin dashboard for moderation

### Data Storage
All data stored in Airtable via edge functions:

**Table 1: Merchant Notices**
- Fields:
  - merchant_name (text)
  - title (text)
  - message (long text)
  - category (single select: Update / Offer / Collab / Event)
  - link (url, optional)
  - visibility (single select: Public / Merchant-only)
  - featured (checkbox) — Admin can feature on homepage/feed
  - intro_text (text) — Admin-added context
  - status (single select: pending / approved / rejected)
  - created_at (datetime)

**Table 2: Merchant Feedback**
- Fields:
  - merchant_name (text)
  - brand_website (url)
  - rating (number, 1-5)
  - feedback (long text)
  - allow_quote (checkbox)
  - status (single select: pending / approved / featured)
  - admin_notes (long text)
  - created_at (datetime)

### Edge Functions

**`airtable-submit`**: Handles public submissions
- POST `/airtable-submit`
- Body: `{ table: string, fields: object }`
- Validates input and submits to Airtable
- Used for: Merchant Notices, Merchant Feedback

**`admin-airtable`**: Admin operations
- POST `/admin-airtable`
- Actions: `list`, `update`
- Requires admin authentication
- Used for: Viewing and moderating submissions

## Features

### 1. Welcome & Overview
- Hero message introducing The Lane Club
- Tab navigation for three sections

### 2. Community Feed (Static - Phase 1)
- Placeholder for future community features
- Shows upcoming feature message

### 3. Merchant Notice Board
**Public View:**
- Two tabs: "🌍 Public Notices" and "🛍️ Merchant Hub"
- Grid layout: 2 columns desktop, 1 column mobile
- Each notice card shows:
  - Category badge
  - Title and message
  - Optional link button
  - Timestamp

**Submission Form:**
- Fields: Title, Message, Category dropdown, Link (optional), Visibility toggle
- Validation: Required fields, URL format
- Submits to Airtable "Merchant Notices" table
- Initial status: "pending"

### 4. Feedback Form (Mandatory)
- Required for all merchants
- Fields: Merchant Name, Brand Website, Rating (1-5 stars), Feedback text, Permission toggle
- Submits to Airtable "Merchant Feedback" table
- Success modal confirmation

### 5. Admin Dashboard
**Merchant Notices Management:**
- View all notices in table format
- Filter by status (pending/approved/rejected)
- Approve/reject with one click
- Feature toggle for homepage visibility
- Add intro text for featured notices
- Edit and delete capabilities

**Feedback Management:**
- View all feedback submissions
- Filter by rating and status
- Approve/feature testimonials
- Add admin notes
- Use approved feedback as testimonials

## Design System

### Color Palette
- Primary: Wine red (`--primary` from design tokens)
- Background: Soft white (`--background`)
- Cards: `--card` with subtle shadows
- Text: `--foreground` and `--muted-foreground`

### Component Patterns
- **Tabs**: Shadcn Tabs component for navigation
- **Cards**: Soft shadows, rounded corners, hover effects
- **Buttons**: Floaty hover effects, no gradients
- **Forms**: Inline validation, clear error states
- **Badges**: Category indicators with semantic colors

### Responsive Design
- Mobile-first approach
- Grid: 1 column mobile, 2 columns desktop (min 640px)
- Touch-friendly tap targets (min 44px)
- Readable line lengths (max 65ch)

## SEO Configuration
```typescript
{
  title: "The Lane Club — PopUp Lane Community for Creators and Shoppers",
  description: "Join The Lane Club — where small brands and shoppers meet, share updates, and help shape PopUp Lane's future.",
  canonical: "https://popuplane.com/lane-club"
}
```

## User Flows

### Merchant Posts Notice
1. Navigate to Lane Club → Merchant Notice Board
2. Click "Post Update" button
3. Fill form (title, message, category, link, visibility)
4. Submit → Saved to Airtable as "pending"
5. See success message
6. Admin reviews and approves
7. Notice appears in relevant tab (Public or Merchant Hub)

### Merchant Submits Feedback
1. Navigate to Lane Club → Feedback tab
2. See "mandatory" messaging
3. Fill form (name, website, rating, feedback, permission)
4. Submit → Saved to Airtable
5. Success modal appears
6. Admin reviews and can feature as testimonial

### Admin Moderates Content
1. Login to admin dashboard
2. Navigate to Lane Club tab
3. View Notices or Feedback sub-tab
4. Filter by status
5. Approve/reject with one click
6. Feature quality content for homepage
7. Add intro text if featuring

## Future Enhancements (Phase 2)
- Community Feed with discussion threads
- Merchant-to-merchant direct messaging
- Collaboration matching algorithm
- Event calendar integration
- Analytics dashboard for engagement metrics
- Email notifications for featured content
- Shopper feedback collection
- Public testimonial showcase page

## Technical Notes

### Authentication
- No auth required for viewing public notices
- No auth required for submissions (uses Airtable as backend)
- Admin features require admin role check via Supabase

### Performance
- Lazy load notice cards with pagination
- Cache Airtable data with 5-minute TTL
- Optimize images if merchants upload logos

### Security
- Input validation on client and server
- XSS protection via proper escaping
- Rate limiting on submission endpoint
- Admin-only access to moderation tools

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader announcements for actions
- Color contrast meets WCAG AA standards

## Development Checklist
- [x] Create LaneClub page with tabs
- [x] Build Merchant Notice Board component
- [x] Build Feedback form component
- [x] Update airtable-submit edge function
- [x] Create admin management interface
- [x] Add SEO metadata
- [x] Mobile responsive design
- [x] Form validation
- [x] Success/error states
- [x] Admin authentication
- [x] Documentation

## Maintenance
- Monitor Airtable API usage and limits
- Review and moderate submissions daily
- Update featured content weekly
- Collect feedback on Lane Club features
- Plan Phase 2 enhancements based on usage
