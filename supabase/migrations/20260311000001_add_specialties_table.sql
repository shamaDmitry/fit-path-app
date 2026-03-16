-- Migration to add specialties table and link it to trainers

-- 1. Create specialties table
CREATE TABLE IF NOT EXISTS public.specialties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

-- 3. Add public read access policy
CREATE POLICY "Specialties are viewable by everyone" ON public.specialties
  FOR SELECT USING (TRUE);

-- 4. Insert initial specialties
INSERT INTO public.specialties (label, value) VALUES
('Strength Training', 'strength_training'),
('Yoga & Pilates', 'yoga_pilates'),
('HIIT & Athletics', 'hiit_athletics'),
('Nutrition & Fitness', 'nutrition_fitness'),
('CrossFit', 'crossfit'),
('Dance & Cardio', 'dance_cardio')
ON CONFLICT (value) DO NOTHING;

-- 5. Add specialty_id column to trainers
ALTER TABLE public.trainers ADD COLUMN IF NOT EXISTS specialty_id UUID REFERENCES public.specialties(id);

-- 6. Migrate existing data from specialty (TEXT) to specialty_id (UUID)
-- We match on the label since that's what was stored in the text column
UPDATE public.trainers t
SET specialty_id = s.id
FROM public.specialties s
WHERE t.specialty = s.label;

-- 7. Drop the old specialty text column
ALTER TABLE public.trainers DROP COLUMN IF EXISTS specialty;

-- 8. Add check constraint or NOT NULL if desired
-- ALTER TABLE public.trainers ALTER COLUMN specialty_id SET NOT NULL;
