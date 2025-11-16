-- Add payment tracking fields to merchants table
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS subscription_status TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS beta_merchant BOOLEAN DEFAULT false;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS backroom_discount DECIMAL DEFAULT 0;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS next_lane_discount DECIMAL DEFAULT 0;

-- Create purchases table
CREATE TABLE IF NOT EXISTS merchant_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL, -- 'lane_pass' or 'backroom_membership'
  lane_id TEXT, -- which lane this pass is for (e.g., 'black_friday_2025')
  amount_paid INTEGER NOT NULL, -- in cents
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on purchases table
ALTER TABLE merchant_purchases ENABLE ROW LEVEL SECURITY;

-- Merchants can view their own purchases
CREATE POLICY "Merchants can view own purchases"
  ON merchant_purchases FOR SELECT
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases"
  ON merchant_purchases FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert purchases
CREATE POLICY "System can insert purchases"
  ON merchant_purchases FOR INSERT
  WITH CHECK (true);

-- System can update purchases
CREATE POLICY "System can update purchases"
  ON merchant_purchases FOR UPDATE
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_merchant_purchases_updated_at
  BEFORE UPDATE ON merchant_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();