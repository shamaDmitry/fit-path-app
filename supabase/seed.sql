-- Seed file for fit-path-app

-- 1. Create an Admin User
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd866a014-49c0-4c3d-be6d-318e4726487e',
  'authenticated',
  'authenticated',
  'admin@fitpath.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User", "role": "admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Trainer Users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  'e79f6e16-09a2-4a73-8b77-3e6f98126742',
  'authenticated', 'authenticated',
  'marcus@fitpath.com', crypt('TrainerPassword123!', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Marcus Johnson", "role": "trainer"}', now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  '7f5e1a32-1234-4567-89ab-cdef01234567',
  'authenticated', 'authenticated',
  'sofia@fitpath.com', crypt('TrainerPassword123!', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sofia Martinez", "role": "trainer"}', now(), now()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Regular Users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  'a1b2c3d4-e5f6-4a5b-bcde-f12345678901',
  'authenticated', 'authenticated',
  'alex@fitpath.com', crypt('UserPassword123!', gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Alex Turner", "role": "user"}', now(), now()
)
ON CONFLICT (id) DO NOTHING;

-- Note: The trigger public.on_auth_user_created handles the initial record in public.profiles and public.trainers.
-- We now update those records with more details from our mock data.

-- Update Trainer Details
UPDATE public.trainers
SET 
  bio = 'NASM certified personal trainer specializing in strength training and body transformation. 8+ years helping clients achieve their goals.',
  specialty = 'Strength Training',
  rating = 4.9,
  experience_years = 8,
  color = '158 64% 32%',
  certifications = ARRAY['NASM-CPT', 'CSCS', 'TRX Certified']
WHERE id = 'e79f6e16-09a2-4a73-8b77-3e6f98126742';

UPDATE public.trainers
SET 
  bio = 'Yoga and pilates instructor with a holistic approach to fitness. Focused on flexibility, mindfulness, and functional movement.',
  specialty = 'Yoga & Pilates',
  rating = 4.8,
  experience_years = 6,
  color = '280 60% 50%',
  certifications = ARRAY['RYT-500', 'Pilates Certified', 'Meditation Coach']
WHERE id = '7f5e1a32-1234-4567-89ab-cdef01234567';

-- Add some initial timeslots for Marcus
INSERT INTO public.timeslots (trainer_id, date, start_time, end_time, is_booked)
VALUES 
('e79f6e16-09a2-4a73-8b77-3e6f98126742', current_date + interval '1 day', '09:00', '10:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', current_date + interval '1 day', '10:00', '11:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', current_date + interval '1 day', '14:00', '15:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', current_date + interval '2 days', '09:00', '10:00', false);
