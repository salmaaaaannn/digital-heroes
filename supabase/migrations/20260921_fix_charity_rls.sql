ALTER TABLE public.charities
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'charities'
      AND column_name = 'is_active'
  ) THEN
    UPDATE public.charities
    SET active = is_active;
  END IF;
END $$;

-- Use a security-definer helper so charity policies can check profiles without
-- depending on the caller's profile SELECT policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view active charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can insert charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can update charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can delete charities" ON public.charities;

CREATE POLICY "Public can view active charities"
ON public.charities
FOR SELECT
USING (active = true OR public.is_admin());

CREATE POLICY "Admins can insert charities"
ON public.charities
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update charities"
ON public.charities
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete charities"
ON public.charities
FOR DELETE
USING (public.is_admin());

NOTIFY pgrst, 'reload schema';