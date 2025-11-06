-- Add status column to merchants table
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
CHECK (status IN ('active', 'suspended', 'deleted'));

-- Update existing records to have active status
UPDATE public.merchants SET status = 'active' WHERE status IS NULL;

-- Update RLS policy to exclude suspended/deleted merchants from public view
DROP POLICY IF EXISTS "Public can view approved merchants" ON public.merchants;

CREATE POLICY "Public can view approved merchants"
  ON public.merchants
  FOR SELECT
  TO anon, public
  USING (application_status = 'Approved' AND (status IS NULL OR status = 'active'));

-- Create admin_email_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.admin_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recipient_mode TEXT NOT NULL,
  recipient_count INTEGER NOT NULL,
  subject TEXT NOT NULL,
  merchant_ids TEXT[],
  success BOOLEAN DEFAULT true
);

-- Enable RLS on email logs
ALTER TABLE public.admin_email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can view email logs"
  ON public.admin_email_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can insert email logs
CREATE POLICY "Admins can insert email logs"
  ON public.admin_email_logs
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));