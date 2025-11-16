Great — I’ll package everything into a **Stripe-ready, GitHub-friendly, Notion-readable pricing file** that you can drop into your repo (as `PRICING.md`), send to developers, or use directly inside your billing system setup.

This is the official, clean, ready-to-implement version of your **PopUp Lane Pricing Model** — updated for Black Friday Beta Merchants, future Lanes, and long-term scalability.

---

# 📄 **PRICING.md**

### *(Complete Stripe-Ready Pricing Framework for PopUp Lane)*

---

# **PopUp Lane — Pricing & Billing Model**

PopUp Lane operates on a flexible, seasonal-based participation model for small brands. Merchants only pay when they join a Lane (a seasonal digital pop-up), with the option to stay connected year-round through the Backroom Membership.

This document defines the pricing structure, plan names, Stripe-ready IDs, and beta merchant rules for the Black Friday 2025 cohort.

---

## 🧩 **1. Overview**

PopUp Lane monetizes through two simple merchant-facing products:

### **1. Lane Pass — $49.99 per season**

One-time access to participate in a specific Lane
(e.g., Holidays, Spring Refresh, Summer Edition).

### **2. Backroom Membership — $19.99/month**

A recurring membership granting all-year access to the PopUp Lane community
(Lane Club, Notice Board, Early Access, etc.).

These models scale globally and keep PopUp Lane aligned with an “open mall / seasonal pop-up” experience.

---

# **2. Pricing Plans**

---

## 🛒 **Plan: Lane Pass**

**Price:** **$49.99 (one-time fee)**
**Stripe ID:** `lane_pass`
**Billing Type:** `one_time`

### **What’s Included**

* Brand card placement inside a specific Lane
* Inclusion in Lane-wide visibility & discovery loops
* Deal spotlight for selected items
* Storefront outbound links (Shopify, Etsy, etc.)
* Social visibility boost
* Click + Save analytics (MVP light)
* CTA button to merchant’s shop
* Exposure during the entire Lane (open → close)

### **Rules**

* Valid only for the Lane purchased
* Lane closes based on scheduled end date
* Merchant must submit deal(s) before Lane opens
* No recurring fees

---

## 🏠 **Plan: Backroom Membership**

**Price:** **$19.99/month**
**Stripe ID:** `backroom_membership`
**Billing Type:** `recurring_monthly`

### **What’s Included**

Year-round merchant access to:

* Lane Club (merchant & shopper community)
* Merchant Notice Board (post updates, teasers, deals)
* Priority invitations to all upcoming Lanes
* Early submission of seasonal deals
* Private feedback loops
* Founder-only events + updates
* Early platform feature previews
* Backroom-exclusive opportunities

### **Rules**

* Does **not** replace Lane Pass
* Cancel anytime (access immediately removed)
* Required for year-round visibility & community

---

# **3. Beta Merchant Program (Black Friday 2025)**

### **Eligibility**

First 50 approved merchants who sign up.

### **Benefits**

* **Free Lane Pass for Black Friday 2025**
  `lane_pass` → $0 for these users
* **50% Lifetime Discount on Backroom Membership**
  $19.99 → **$9.99/month**
* **50% Discount on Next Lane (Holidays 2025)**
  $49.99 → **$24.99**
* Eligibility for early-feature access
* Priority listing in the holiday Lane (if they join)

### **Stripe Logic**

Assign metadata to merchant user/account:

```
beta_bf_2025: true
backroom_discount: 0.5   // lifetime
holiday_2025_discount: 0.5
```

### **Requirement**

To maintain free participation during Black Friday 2025, merchants must:

* Complete Lane Club onboarding
* Submit mandatory feedback
  (positive OR critical — no coercion, but we’ll always prefer the glow-up 😉)

If feedback is not submitted:

* Admin may temporarily unfeature or remove the card
* Merchant loses early access privileges

---

# **4. Developer Integration Notes (Stripe + Platform)**

### **Stripe Products to Create**

```
Product: Lane Pass
    - ID: lane_pass
    - Pricing: 4999 / USD
    - Type: one_time

Product: Backroom Membership
    - ID: backroom_membership
    - Pricing: 1999 / USD / monthly
    - Type: recurring
```

---

### **Business Logic (Platform-Side)**

#### **Check Merchant Access**

```
function canAccessLane(merchant, lane) {
  if (merchant.beta_bf_2025 && lane.id === 'black_friday_2025') return true;
  if (merchant.purchased_passes.includes(lane.id)) return true;
  return false;
}
```

#### **Check Backroom Access**

```
function hasBackroomAccess(merchant) {
  if (merchant.beta_bf_2025) return true;
  if (merchant.subscriptions.includes('backroom_membership')) return true;
  return false;
}
```

#### **Apply Discounts**

```
if (merchant.beta_bf_2025) {
    price = base_price * 0.5;
}
```

---

# **5. Future-Proof Extensions**

This pricing model is designed to easily support:

* **Affiliate marketplace**
* **Premium placement tiers** (Top Row, Featured Carousel)
* **AI Mini-Pod Add-ons** (when fully implemented)
* **Brand-of-the-Day paid placements**
* **Lane Club shopper subscription add-ons**

Everything builds naturally from these two core plans.

---

# **6. Summary**

PopUp Lane’s pricing is:

### **Simple enough for MVP**

but

### **Strong enough for SaaS-scale growth.**

* A Lane Pass = a seasonal participation fee
* Backroom Membership = year-round community + perks
* Beta merchants receive free BF + lifetime discounts
* Ready for Stripe billing
* Ready for future automation

---

If you'd like, I can also produce:

✅ A matching **PRICING PAGE (HTML/CSS)**
✅ A **Stripe Checkout integration snippet**
✅ A **Notion-style Pricing table**
✅ A **Landing Page Pricing Section**

Just tell me which format you prefer.
