-- Migration: Add 'active' column and Admin RLS to public.charities

-- 1. Ensure 'active' column exists on public.charities
ALTER TABLE public.charities 
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. If 'is_active' exists, sync data to 'active'
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
    SET active = is_active 
    WHERE active IS NULL OR active != is_active;
  END IF;
END $$;

-- 3. Ensure 'is_featured' exists (for featured charities preview on landing page)
ALTER TABLE public.charities 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 4. Enable Row Level Security (RLS) on public.charities
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies on charities to prevent conflicts
DROP POLICY IF EXISTS "Public can view active charities" ON public.charities;
DROP POLICY IF EXISTS "Admins have full access to charities" ON public.charities;
DROP POLICY IF EXISTS "Allow public read" ON public.charities;

-- 6. Public policy: Anyone (including unauthenticated visitors) can read active charities
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

-- 7. Admin policies: Admins can INSERT, UPDATE, and DELETE charities
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

-- 8. Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
