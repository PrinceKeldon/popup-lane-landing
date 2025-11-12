# Backroom (Directory) — docs/Backroom.md

> **Short description**
> The **Backroom** is PopUp Lane’s evergreen directory of brands and merchants — the persistent archive that “remembers the brands that made the seasons.” During an open (live) season the Backroom is read-only and hidden from the primary event feed; after the season closes the Backroom is merged and searchable. This doc explains purpose, data model, APIs, UX rules, admin responsibilities, and developer notes for working with the Backroom.

---

## Table of contents

1. Purpose & behaviour
2. User journeys
3. Data model (Airtable + DB fields)
4. API endpoints & example payloads
5. UI / UX rules (open vs closed states)
6. Admin & promotion logic
7. Guardrails & integrity controls
8. Deployment & environment variables
9. QA checklist
10. Troubleshooting / common issues

---

## 1. Purpose & behaviour

* **Backroom** = permanent directory of brands, searchable year-round (off-season).
* During a seasonal **Open** window (e.g., Black Friday), **only** approved season brands appear in the public event feed. Backroom listings are hidden from the event feed during this period.
* After the season **closes**, the season brands are merged into the Backroom so long-term SEO and organic discovery continue to grow.
* The Backroom protects brand equity (no unpaid hijackers during events) and provides evergreen content for SEO and marketing.

---

## 2. User journeys

* **Shopper, Off-Season:** Browses Backroom → views archived brand pages → joins waitlist for next season.
* **Shopper, Live Season:** Sees only current season brands in front-end lane; Backroom pages show message like “This season’s lineup only.”
* **Merchant:** Submits application/listing (Backroom draft) → admin review → either `approved` for next season (migrated into `season_lineup`) or kept in Backroom for future seasons.
* **Admin:** Reviews merchant submissions, toggles `is_featured`, `is_in_active_season`, and `featured_on_homepage`, promotes notices to public homepage.

---

## 3. Data model

### Table: `Merchants` (Airtable) / `merchants` (DB)

Core fields:

* `id` (string) — canonical unique id
* `name` (string)
* `slug` (string) — SEO-friendly
* `description` (text)
* `website_url` (url)
* `social_url` (url)
* `logo_url` (url)
* `hero_image_url` (url)
* `categories` (array)
* `tags` (array)
* `status` (enum) — `draft` | `approved` | `rejected` | `archived`
* `is_in_active_season` (boolean) — true for brands in the current open season feed
* `season_join` (string) — e.g. `BlackFriday25`
* `join_date` (datetime)
* `clicks` (number)
* `saves` (number)
* `is_featured` (boolean) — featured in lane feed
* `featured_on_homepage` (boolean)
* `admin_notes` (text)
* `ai_podcast_ids` (array) — references, optional

### Table: `MerchantNotices` (Airtable)

* `merchant_id`, `merchant_name`, `title`, `message`, `category`, `link`, `visibility` (Merchant-only/Public), `date_posted`, `is_featured`, `featured_on_homepage`, `admin_intro`, `admin_notes`

### Table: `MerchantFeedback` (Airtable)

* `merchant_id`, `merchant_name`, `rating`, `feedback_text`, `permission_to_quote`, `date_submitted`

> Note: Use the same field names in DB/API payloads to avoid mapping errors.

---

## 4. API endpoints (examples)

> These are the platform endpoints you already have or should implement for Backroom flows.

* `GET /api/merchants?status=approved`
  Response: list of merchants safe for Backroom listing (off-season).
* `GET /api/merchants/:id`
  Response: merchant detail (includes `is_in_active_season`).
* `POST /api/merchants`
  Payload: merchant application / listing draft.
* `PUT /api/merchants/:id`
  Admin updates (status, is_featured, is_in_active_season).
* `GET /api/backroom`
  Returns searchable Backroom results (off-season accessible).
* `GET /api/merchant/notices?visibility=public`
  Fetch public notices for Backroom / community feed.
* `POST /api/merchant/notices`
  Merchant posts a notice (saved to `MerchantNotices` table).
* `PUT /api/admin/merchant-notices/:id/feature`
  Admin toggles feature/promote flags.

**Example: approve merchant payload**

```json
PUT /api/merchants/loom-found
{
  "status": "approved",
  "is_in_active_season": false,
  "season_join": "Summer25",
  "featured_on_homepage": false
}
```

**Example: promote notice**

```json
PUT /api/admin/merchant-notices/rec12345/feature
{
  "is_featured": true,
  "featured_on_homepage": true,
  "admin_intro": "Featured: Velvet Arc's Holiday Edit"
}
```

---

## 5. UI / UX rules (Open vs Closed states)

* **Single Source of Truth** for season dates and states (admin countdown). Do not rely on multiple local timers.

  * Use environment variables or a central `POPUP_CONFIG` service endpoint (`/api/config/season`) that returns `{ openDate, closeDate, seasonName, isOpen }`.
* **Off-Season (Backroom Visible):**

  * Backroom pages are fully accessible and searchable.
  * Event feed shows CTA to join waitlist.
* **Open-Season (Event Live):**

  * Backroom pages remain accessible but **redirect or display** “This season’s lineup only” when users try to access pages not in the current season.
  * Only merchants where `is_in_active_season === true` show in the event feed.
* **Merging after season:**

  * After closing the season, admin runs the merge job (or schedule runs automatically) to merge season entries into Backroom. Ensure `season_join` is recorded and `is_in_active_season` reset.

---

## 6. Admin & promotion logic

* **Admin roles:**

  * `admin` (full access)
  * `editor` (can approve/feature)
* **Actions admin can perform:**

  * Approve / reject merchant applications.
  * Toggle `is_in_active_season`, `is_featured`, `featured_on_homepage`.
  * Promote a `MerchantNotice` to homepage or Lane feed.
  * Pin / unpin posts and add `admin_intro`.
* **Feature rules:**

  * Only `is_featured === true` AND `featured_on_homepage === true` posts show on homepage.
  * Featured posts auto-expire after `FEATURE_EXPIRY_DAYS` (default 14), unless admin extends.

---

## 7. Guardrails & integrity controls

* `is_in_active_season` must be the single truth for rendering in a live feed.
* Lock directory endpoints during `Open` periods to prevent backroom listings from hijacking the live feed:

  * When `isOpen === true`, `/api/backroom` remains accessible but `/api/merchants?status=approved&inSeason=false` should be hidden from event feed endpoints.
* Hidden URLs / no API exposure for archived-only content during event windows to prevent accidental discovery.
* Timestamp each merchant action (`created_at`, `updated_at`, `season_join`) for audit and reporting.
* Server-side validation: never rely on client-side checks for merchant application caps or timing (e.g., applicationCap must be enforced in API).

---

## 8. Deployment & environment variables

**Add these env vars to your `.env` or deployment secret store:**

```
AIRTABLE_API_KEY=xxxx
AIRTABLE_BASE_ID=appXXXXX
AIRTABLE_TABLE_MERCHANTS=Merchants
AIRTABLE_TABLE_NOTICES=MerchantNotices
AIRTABLE_TABLE_FEEDBACK=MerchantFeedback

RESEND_API_KEY=xxxx         # for email sending
LOVABLE_FORM_SLUG=notify-list
NEXT_PUBLIC_OPEN_DATE=2025-11-21T10:00:00
NEXT_PUBLIC_CLOSE_DATE=2025-11-28T23:59:59

ADMIN_UI_URL=https://admin.popuplane.example
FEATURE_EXPIRY_DAYS=14
```

> **Note:** There was a `dotenv` warning observed in earlier runs — ensure `.env` values are present in deployment environment and that the runtime loads them before server start.

---

## 9. QA checklist (pre-release)

* [ ] Confirm `POPUP_CONFIG` is served by backend `/api/config/season` (single source of truth).
* [ ] Verify `is_in_active_season` logic — brands in Backroom are hidden during Open state.
* [ ] Confirm Backroom search indexing works and SEO meta tags are present on merchant pages.
* [ ] Verify admin promotion toggles (feature, homepage) update both DB and frontend immediately (or via well-tested cache invalidation).
* [ ] Ensure Airtable sync works for `Merchants`, `MerchantNotices`, `MerchantFeedback`.
* [ ] Test merchant application flow during `before`, `live`, and `after` states (including form-submit rejections when closed).
* [ ] Mobile responsiveness test for Backroom listings and notice board.
* [ ] Accessibility check: roles, aria-live for countdown, alt tags for logos.

---

## 10. Troubleshooting / common issues

* **Countdown desync:** If landing page and admin countdowns show different times, check that both fetch `/api/config/season`. Do not hardcode dates in the frontend.
* **Merchant appears in live feed when not supposed to:** Verify `is_in_active_season` was set to `true` only for season-approved merchants — check DB and any merge scripts.
* **Airtable rate limits / token errors:** Use server-side proxy with caching. Ensure `AIRTABLE_API_KEY` is valid and not exposed to the client.
* **Missing images / bleeding layout:** Confirm `hero_image_url` dimensions and use CSS object-fit:cover plus constrained image container heights to prevent bleed. (Design note from UX: increase card image container height if overlay text overlaps.)

---

## Useful scripts & cron jobs

* `scripts/mergeSeasonToBackroom.js` — merges season line-up into Backroom after close.
* `scripts/expireFeaturedPosts.js` — clears `is_featured` after `FEATURE_EXPIRY_DAYS`.
* `scripts/syncAirtableToDB.js` — one-way sync job to mirror Airtable to primary DB (run nightly).
* `cron`: run `mergeSeasonToBackroom` at `closeDate + 5 minutes`. Run
