-- Fix RLS policy to allow approved merchants to link their account on first login
DROP POLICY IF EXISTS "Merchants can update their own record" ON merchants;

-- New policy: Allow merchants to update their own record OR link account if approved and user_id is NULL
CREATE POLICY "Merchants can update their own record or link account"
ON merchants
FOR UPDATE
USING (
  auth.uid() = user_id 
  OR (
    application_status = 'Approved' 
    AND user_id IS NULL 
    AND email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
)
WITH CHECK (
  auth.uid() = user_id 
  OR (
    application_status = 'Approved' 
    AND user_id IS NULL 
    AND email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Insert mock merchant data with real Unsplash images for testing
INSERT INTO merchants (brand_name, email, website_url, social_media, category, application_status, spots_claimed)
VALUES
  ('Loom & Found', 'loom@example.com', 'https://example.com/loom', '@loomfound', 'Artisan', 'Approved', 1),
  ('Bright Studio', 'bright@example.com', 'https://example.com/bright', '@brightstudio', 'Artisan', 'Approved', 1),
  ('Thread Theory', 'thread@example.com', 'https://example.com/thread', '@threadtheory', 'Emerging', 'Approved', 1),
  ('Wild & Free', 'wild@example.com', 'https://example.com/wild', '@wildandfree', 'Sustainable', 'Approved', 1),
  ('Urban Craft Co', 'urban@example.com', 'https://example.com/urban', '@urbancraftco', 'Founder-Led', 'Approved', 1),
  ('Echo Goods', 'echo@example.com', 'https://example.com/echo', '@echogoods', 'Wellness', 'Approved', 1),
  ('Makers Mark', 'makers@example.com', 'https://example.com/makers', '@makersmark', 'Artisan', 'Approved', 1),
  ('Studio 42', 'studio@example.com', 'https://example.com/studio', '@studio42', 'Tech', 'Approved', 1)
ON CONFLICT (email) DO NOTHING;

-- Insert mock products for these merchants
INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Handwoven Linen Throw',
  'Sustainable handwoven linen in natural tones. Perfect for any living space.',
  89.99,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Loom & Found'
ON CONFLICT DO NOTHING;

INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Ceramic Mug Set',
  'Modern minimalist ceramic mugs. Set of 4, dishwasher safe.',
  52.00,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Bright Studio'
ON CONFLICT DO NOTHING;

INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Organic Cotton Tee',
  '100% organic cotton, ethically made. Available in multiple colors.',
  35.00,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Thread Theory'
ON CONFLICT DO NOTHING;

INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Eco-Friendly Tote Bag',
  'Durable canvas tote with leather handles. Perfect for everyday use.',
  42.00,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Wild & Free'
ON CONFLICT DO NOTHING;

INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Concrete Planter',
  'Handcrafted concrete planter with drainage. Modern industrial aesthetic.',
  38.00,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Urban Craft Co'
ON CONFLICT DO NOTHING;

INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Essential Oil Diffuser',
  'Ultrasonic diffuser with ambient lighting. Includes starter oil set.',
  68.00,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Echo Goods'
ON CONFLICT DO NOTHING;

INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Leather Journal',
  'Premium leather journal with handmade paper. Perfect for daily notes.',
  45.00,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Makers Mark'
ON CONFLICT DO NOTHING;

INSERT INTO merchant_products (merchant_id, product_name, product_description, price, website_url, display_order)
SELECT 
  m.id,
  'Smart Desk Organizer',
  'Minimalist desk organizer with wireless charging pad built-in.',
  79.00,
  m.website_url,
  1
FROM merchants m WHERE m.brand_name = 'Studio 42'
ON CONFLICT DO NOTHING;