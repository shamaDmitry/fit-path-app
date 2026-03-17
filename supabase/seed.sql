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
  certifications = ARRAY['NASM-CPT', 'CSCS']
WHERE id = 'e79f6e16-09a2-4a73-8b77-3e6f98126742';

UPDATE public.trainers
SET 
  bio = 'Yoga and pilates instructor with a holistic approach to fitness.',
  experience_years = 6,
  color = '280 60% 50%',
  certifications = ARRAY['RYT-500', 'Pilates Certified']
WHERE id = '7f5e1a32-1234-4567-89ab-cdef01234567';

-- Add initial timeslots for trainers
INSERT INTO public.timeslots (trainer_id, date, start_time, end_time, is_booked)
VALUES 
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 1, '09:00', '10:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 1, '10:00', '11:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 1, '14:00', '15:00', false),
('e79f6e16-09a2-4a73-8b77-3e6f98126742', CURRENT_DATE + 2, '09:00', '10:00', false),
('7f5e1a32-1234-4567-89ab-cdef01234567', CURRENT_DATE + 1, '08:00', '09:00', false),
('7f5e1a32-1234-4567-89ab-cdef01234567', CURRENT_DATE + 1, '11:00', '12:00', false);
