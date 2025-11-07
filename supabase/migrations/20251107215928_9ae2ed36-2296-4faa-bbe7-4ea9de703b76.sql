-- Create lane_club_feedback table
CREATE TABLE public.lane_club_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  email TEXT NOT NULL,
  first_impression TEXT NOT NULL,
  short_quote TEXT,
  excited_feature TEXT,
  improvement TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  consent_to_feature BOOLEAN DEFAULT true,
  logo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  featured_on_site BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lane_club_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Merchants can view own feedback"
ON public.lane_club_feedback
FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all feedback"
ON public.lane_club_feedback
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view approved testimonials"
ON public.lane_club_feedback
FOR SELECT
USING (status = 'approved' AND consent_to_feature = true AND featured_on_site = true);

-- Trigger for updated_at
CREATE TRIGGER update_lane_club_feedback_updated_at
BEFORE UPDATE ON public.lane_club_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lane-club-logos', 'lane-club-logos', true);

-- Storage policies
CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'lane-club-logos');

CREATE POLICY "Anyone can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lane-club-logos');