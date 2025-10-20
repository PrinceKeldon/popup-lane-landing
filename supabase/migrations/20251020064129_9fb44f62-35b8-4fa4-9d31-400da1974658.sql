-- Create user roles system for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'merchant', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create lane_settings table for managing lane configuration
CREATE TABLE public.lane_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  early_access_date TIMESTAMP WITH TIME ZONE NOT NULL,
  lane_status TEXT NOT NULL DEFAULT 'closed' CHECK (lane_status IN ('closed', 'open', 'paused')),
  spots_limit INTEGER NOT NULL DEFAULT 50,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on lane_settings
ALTER TABLE public.lane_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read lane settings
CREATE POLICY "Anyone can view lane settings"
  ON public.lane_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can update lane settings
CREATE POLICY "Admins can update lane settings"
  ON public.lane_settings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert lane settings"
  ON public.lane_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default lane settings
INSERT INTO public.lane_settings (early_access_date, lane_status, spots_limit)
VALUES ('2025-11-17 10:00:00+00', 'closed', 50);

-- Create trigger for lane_settings updated_at
CREATE TRIGGER update_lane_settings_updated_at
  BEFORE UPDATE ON public.lane_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();