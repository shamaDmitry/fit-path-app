-- Step 3: Seed Data (Corrected for Local and Remote Supabase)
-- Initial Admin, Trainer, and User accounts.

-- 1. Create an Admin User
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd866a014-49c0-4c3d-be6d-318e4726487e',
  'authenticated', 'authenticated',
  'admin@fitpath.com', extensions.crypt('AdminPassword123!', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User", "role": "admin", "is_super_admin": true}',
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- 2. Create Trainer Users
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
  'marcus@fitpath.com', extensions.crypt('TrainerPassword123!', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Marcus Johnson", "role": "trainer", "is_super_admin": true}', 
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  '7f5e1a32-1234-4567-89ab-cdef01234567',
  'authenticated', 'authenticated',
  'sofia@fitpath.com', extensions.crypt('TrainerPassword123!', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sofia Martinez", "role": "trainer", "is_super_admin": true}', 
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e6',
  'authenticated', 'authenticated',
  'elena@fitpath.com', extensions.crypt('TrainerPassword123!', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Elena Rodriguez", "role": "trainer", "is_super_admin": true}', 
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'c3d4e5f6-a7b8-4c9d-0e1f-a2b3c4d5e6f7',
  'authenticated', 'authenticated',
  'david@fitpath.com', extensions.crypt('TrainerPassword123!', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "David Chen", "role": "trainer", "is_super_admin": true}', 
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'd4e5f6a7-b8c9-4d0e-1f2a-b3c4d5e6f7a8',
  'authenticated', 'authenticated',
  'sarah@fitpath.com', extensions.crypt('TrainerPassword123!', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sarah Williams", "role": "trainer", "is_super_admin": true}', 
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- 3. Create Regular Users
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
  'alex@fitpath.com', extensions.crypt('UserPassword123!', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Alex Turner", "role": "user"}', 
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Update Trainer Details with Rich Data (Trigger should have already created base rows)
UPDATE public.trainers
SET 
  bio = 'NASM certified personal trainer specializing in strength training and body transformation.',
  experience_years = 8,
  color = '158 64% 32%',
  certifications = ARRAY['NASM-CPT', 'CSCS'],
  specialty_id = (SELECT id FROM public.specialties WHERE value = 'strength_training')
WHERE id = 'e79f6e16-09a2-4a73-8b77-3e6f98126742';

UPDATE public.trainers
SET 
  bio = 'Yoga and pilates instructor with a holistic approach to fitness.',
  experience_years = 6,
  color = '280 60% 50%',
  certifications = ARRAY['RYT-500', 'Pilates Certified'],
  specialty_id = (SELECT id FROM public.specialties WHERE value = 'yoga_pilates')
WHERE id = '7f5e1a32-1234-4567-89ab-cdef01234567';

UPDATE public.trainers
SET 
  bio = 'Elite HIIT coach and athletic performance specialist. Focus on explosive power and endurance.',
  experience_years = 5,
  color = '10 80% 50%',
  certifications = ARRAY['ACE-GFI', 'PES'],
  specialty_id = (SELECT id FROM public.specialties WHERE value = 'hiit_athletics')
WHERE id = 'b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e6';

UPDATE public.trainers
SET 
  bio = 'CrossFit level 2 trainer with a passion for functional movements and high-intensity training.',
  experience_years = 7,
  color = '200 70% 45%',
  certifications = ARRAY['CrossFit-L2', 'Olympic Lifting'],
  specialty_id = (SELECT id FROM public.specialties WHERE value = 'crossfit')
WHERE id = 'c3d4e5f6-a7b8-4c9d-0e1f-a2b3c4d5e6f7';

UPDATE public.trainers
SET 
  bio = 'Certified nutritionist and fitness coach. Integrating healthy eating with effective workout programs.',
  experience_years = 4,
  color = '45 85% 45%',
  certifications = ARRAY['ISSA-Nutrition', 'CPT'],
  specialty_id = (SELECT id FROM public.specialties WHERE value = 'nutrition_fitness')
WHERE id = 'd4e5f6a7-b8c9-4d0e-1f2a-b3c4d5e6f7a8';

-- Add initial timeslots for trainers
INSERT INTO public.timeslots (trainer_id, date, start_time, end_time, is_booked)
VALUES 
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 1, '09:00', '10:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 1, '10:00', '11:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 1, '14:00', '15:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 2, '09:00', '10:00', false),
('7f5e1a32-1234-4567-89ab-cdef01234567', CURRENT_DATE + 1, '08:00', '09:00', false),
('7f5e1a32-1234-4567-89ab-cdef01234567', CURRENT_DATE + 1, '11:00', '12:00', false),
('b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e6', CURRENT_DATE + 1, '07:00', '08:00', false),
('b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e6', CURRENT_DATE + 1, '17:00', '18:00', false),
('c3d4e5f6-a7b8-4c9d-0e1f-a2b3c4d5e6f7', CURRENT_DATE + 1, '06:00', '07:00', false),
('c3d4e5f6-a7b8-4c9d-0e1f-a2b3c4d5e6f7', CURRENT_DATE + 1, '12:00', '13:00', false),
('d4e5f6a7-b8c9-4d0e-1f2a-b3c4d5e6f7a8', CURRENT_DATE + 1, '10:00', '11:00', false),
('d4e5f6a7-b8c9-4d0e-1f2a-b3c4d5e6f7a8', CURRENT_DATE + 1, '13:00', '14:00', false);
