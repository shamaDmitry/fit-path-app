-- Fix foreign key relationships for trainers
-- This allows PostgREST to automatically detect the relationship between appointments/timeslots and trainers.

-- 1. Fix Appointments Table
ALTER TABLE public.appointments
DROP CONSTRAINT IF EXISTS appointments_trainer_id_fkey;

ALTER TABLE public.appointments
ADD CONSTRAINT appointments_trainer_id_fkey
FOREIGN KEY (trainer_id) REFERENCES public.trainers(id) ON DELETE CASCADE;

-- 2. Fix Timeslots Table
ALTER TABLE public.timeslots
DROP CONSTRAINT IF EXISTS timeslots_trainer_id_fkey;

ALTER TABLE public.timeslots
ADD CONSTRAINT timeslots_trainer_id_fkey
FOREIGN KEY (trainer_id) REFERENCES public.trainers(id) ON DELETE CASCADE;
