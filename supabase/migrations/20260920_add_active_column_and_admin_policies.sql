-- ==============================================================================
-- DIGITAL HEROES: Fix Charities Schema Mismatch & Enable Admin Management
-- ==============================================================================

-- 1. ADD 'active' COLUMN TO charities TABLE
ALTER TABLE public.charities 
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. COPY DATA FROM 'is_active' IF IT EXISTS
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

-- 3. ADD 'is_featured' COLUMN (Required for Landing Page Hero Preview)
ALTER TABLE public.charities 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- 5. DROP OLD POLICIES TO AVOID DUPLICATES OR CONFLICTS
DROP POLICY IF EXISTS "Public can view active charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can view all charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can insert charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can update charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can delete charities" ON public.charities;
DROP POLICY IF EXISTS "Allow public read" ON public.charities;

-- 6. PUBLIC SELECT POLICY:
-- Anonymous visitors and subscribers see ONLY active charities.
-- Administrators can view all charities (both active and archived).
CREATE POLICY "Public can view active charities" 
ON public.charities 
FOR SELECT 
USING (
  active = true 
  OR 
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
  ))
);

-- 7. ADMIN INSERT POLICY
CREATE POLICY "Admins can insert charities" 
ON public.charities 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
  )
);

-- 8. ADMIN UPDATE POLICY (Supports Edit, Archive, Activate)
CREATE POLICY "Admins can update charities" 
ON public.charities 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
  )
);

-- 9. ADMIN DELETE POLICY
CREATE POLICY "Admins can delete charities" 
ON public.charities 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
  )
);

-- 10. REFRESH SUPABASE SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
