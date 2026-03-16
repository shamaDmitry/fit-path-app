-- Step 3: Seed Data (Corrected for Local Supabase)
-- Initial Admin, Trainer, and User accounts.

-- 1. Create Specialties
INSERT INTO public.specialties (label, value) VALUES
('Strength Training', 'strength_training'),
('Yoga & Pilates', 'yoga_pilates'),
('HIIT & Athletics', 'hiit_athletics'),
('Nutrition & Fitness', 'nutrition_fitness'),
('CrossFit', 'crossfit'),
('Dance & Cardio', 'dance_cardio')
ON CONFLICT (value) DO UPDATE SET label = EXCLUDED.label;

-- 2. Create an Admin User
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd866a014-49c0-4c3d-be6d-318e4726487e',
  'authenticated', 'authenticated',
  'admin@fitpath.com', crypt('AdminPassword123!', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User", "role": "admin", "is_super_admin": true}',
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- 3. Create Trainer Users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  'e79f6e16-09a2-4a73-8b77-3e6f98126742',
  'authenticated', 'authenticated',
  'marcus@fitpath.com', crypt('TrainerPassword123!', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Marcus Johnson", "role": "trainer", "is_super_admin": true}', 
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  '7f5e1a32-1234-4567-89ab-cdef01234567',
  'authenticated', 'authenticated',
  'sofia@fitpath.com', crypt('TrainerPassword123!', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sofia Martinez", "role": "trainer", "is_super_admin": true}', 
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- 4. Create Regular Users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  'a1b2c3d4-e5f6-4a5b-bcde-f12345678901',
  'authenticated', 'authenticated',
  'alex@fitpath.com', crypt('UserPassword123!', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Alex Turner", "role": "user"}', 
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- 5. Update Trainer Details with Rich Data
UPDATE public.trainers
SET 
  bio = 'NASM certified personal trainer specializing in strength training and body transformation.',
  specialty_id = (SELECT id FROM public.specialties WHERE value = 'strength_training'),
  rating = 4.9,
  experience_years = 8,
  color = '158 64% 32%',
  certifications = ARRAY['NASM-CPT', 'CSCS']
WHERE id = 'e79f6e16-09a2-4a73-8b77-3e6f98126742';

UPDATE public.trainers
SET 
  bio = 'Yoga and pilates instructor with a holistic approach to fitness.',
  specialty_id = (SELECT id FROM public.specialties WHERE value = 'yoga_pilates'),
  rating = 4.8,
  experience_years = 6,
  color = '280 60% 50%',
  certifications = ARRAY['RYT-500', 'Pilates Certified']
WHERE id = '7f5e1a32-1234-4567-89ab-cdef01234567';
