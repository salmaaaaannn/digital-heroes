-- ==============================================================================
-- DIGITAL HEROES: Migration for charities 'active' column and Admin RLS Policies
-- ==============================================================================

-- 1. ADD 'active' COLUMN TO public.charities
ALTER TABLE public.charities 
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. SYNC EXISTING DATA FROM 'is_active' IF IT EXISTS
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

-- 3. ADD 'is_featured' COLUMN
ALTER TABLE public.charities 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 4. CONFIGURE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can insert charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can update charities" ON public.charities;
DROP POLICY IF EXISTS "Admins can delete charities" ON public.charities;
DROP POLICY IF EXISTS "Allow public read" ON public.charities;

-- 5. PUBLIC SELECT POLICY
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

-- 6. ADMIN INSERT POLICY
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

-- 7. ADMIN UPDATE POLICY
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

-- 8. ADMIN DELETE POLICY
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

-- 9. SEED INITIAL VERIFIED CHARITIES (Idempotent)
INSERT INTO public.charities (name, category, description, website_url, is_featured, active, is_active)
VALUES 
  ('Global Clean Water Initiative', 'Healthcare', 'Providing sustainable access to safe drinking water in developing nations.', 'https://cleanwater.org', true, true, true),
  ('Future Builders Education', 'Education', 'Building schools and providing digital access to education globally.', 'https://futurebuilders.org', true, true, true),
  ('Ocean Renewal Project', 'Environment', 'Cleaning oceans and protecting marine wildlife from plastic pollution.', 'https://oceanrenewal.org', true, true, true),
  ('Local Community Kitchens', 'Community', 'Fighting local hunger and food insecurity with community-driven kitchens.', 'https://communitykitchens.org', false, true, true),
  ('Children''s Health Fund', 'Children', 'Funding essential medical procedures and research for rare children''s diseases.', 'https://childrenshealth.org', false, true, true),
  ('Tech for Good Foundation', 'Other', 'Using software and hardware innovation to solve global challenges.', 'https://techforgood.org', false, true, true)
ON CONFLICT DO NOTHING;

-- 10. NOTIFY POSTGREST TO RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
