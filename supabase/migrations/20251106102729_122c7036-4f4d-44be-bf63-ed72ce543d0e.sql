-- Add RLS policy to allow public to view approved merchants
-- Note: This policy allows access to all columns including email
-- Security relies on application code NOT selecting the email column
CREATE POLICY "Public can view approved merchants"
  ON public.merchants
  FOR SELECT
  TO anon, public
  USING (application_status = 'Approved');