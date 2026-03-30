-- Migration to add full administrative access to tables where it was missing.

-- 1. Add Admin full access to Appointments
CREATE POLICY "Admins have full appointment access" ON public.appointments 
FOR ALL TO authenticated 
USING (public.is_admin());

-- 2. Add Admin full access to Timeslots
CREATE POLICY "Admins have full timeslot access" ON public.timeslots 
FOR ALL TO authenticated 
USING (public.is_admin());

-- 3. Add Admin full access to Specialties
CREATE POLICY "Admins manage specialties" ON public.specialties 
FOR ALL TO authenticated 
USING (public.is_admin());
