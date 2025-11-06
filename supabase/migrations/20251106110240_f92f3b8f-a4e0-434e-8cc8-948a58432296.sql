-- Drop existing restrictive UPDATE policies
DROP POLICY IF EXISTS "Admins can update merchants" ON public.merchants;
DROP POLICY IF EXISTS "Allow linking approved merchant accounts" ON public.merchants;
DROP POLICY IF EXISTS "Merchants can update their own record" ON public.merchants;

-- Recreate as permissive policies (using OR logic)
CREATE POLICY "Admins can update merchants"
ON public.merchants
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow linking approved merchant accounts"
ON public.merchants
FOR UPDATE
TO authenticated
USING (
  application_status = 'Approved'
  AND user_id IS NULL
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  application_status = 'Approved'
  AND user_id = auth.uid()
);

CREATE POLICY "Merchants can update their own record"
ON public.merchants
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);