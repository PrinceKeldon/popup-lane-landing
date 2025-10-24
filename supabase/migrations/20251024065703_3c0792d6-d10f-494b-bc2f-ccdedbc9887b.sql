-- Drop the problematic policy
DROP POLICY IF EXISTS "Merchants can update their own record or link account" ON merchants;

-- Create a simpler policy that allows updates for owned records
CREATE POLICY "Merchants can update their own record"
ON merchants
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a separate policy for linking accounts (requires user to be authenticated)
CREATE POLICY "Allow linking approved merchant accounts"
ON merchants
FOR UPDATE
USING (
  application_status = 'Approved' 
  AND user_id IS NULL
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  application_status = 'Approved'
  AND user_id = auth.uid()
);