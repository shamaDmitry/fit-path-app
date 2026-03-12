-- Step 2: Automation and Basic Security
-- Sets up triggers, role protection, and initial RLS policies.

-- 1. Automation Helpers

-- Automatically Update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Automatically create Profile/Trainer on auth.users creation
-- Also enforces that ONLY an admin (or super-admin flag) can assign 'trainer'/'admin' roles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
  requester_is_admin BOOLEAN;
  is_super_creation BOOLEAN;
BEGIN
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Role Protection Logic
  IF (new_role IN ('trainer', 'admin')) THEN
    -- Check if requester is already an admin
    SELECT public.is_admin() INTO requester_is_admin;
    -- Flag used by Seed process or Edge Functions
    is_super_creation := COALESCE((NEW.raw_user_meta_data->>'is_super_admin')::BOOLEAN, FALSE);

    IF (NOT COALESCE(requester_is_admin, FALSE) AND NOT is_super_creation) THEN
       new_role := 'user';
    END IF;
  END IF;

  -- Insert into Profiles
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    new_role,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone;

  -- Insert into Trainers if applicable
  IF (new_role = 'trainer') THEN
    INSERT INTO public.trainers (id, full_name, email, avatar_url, phone, rating, is_active)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'phone',
      4.5,
      TRUE
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      avatar_url = EXCLUDED.avatar_url,
      phone = EXCLUDED.phone;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Sync Profile changes back to Trainers table
CREATE OR REPLACE FUNCTION public.sync_profile_to_trainer()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.trainers
  SET 
    full_name = NEW.full_name,
    avatar_url = NEW.avatar_url,
    phone = NEW.phone,
    email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- 2. Triggers

-- Auth.users INSERT trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles UPDATE sync trigger
CREATE TRIGGER on_profile_updated_sync_trainer
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.full_name IS DISTINCT FROM NEW.full_name OR 
        OLD.avatar_url IS DISTINCT FROM NEW.avatar_url OR 
        OLD.phone IS DISTINCT FROM NEW.phone OR 
        OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_profile_to_trainer();

-- Generic updated_at triggers
CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_trainers_updated BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_timeslots_updated BEFORE UPDATE ON public.timeslots FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_appointments_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Basic RLS Policies (Public-centric for initial dev)

-- Profiles: Public select, owner update, admin all
CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full profile access" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());

-- Trainers: Users see only active, Admin/Self see all
CREATE POLICY "Trainers visibility logic" ON public.trainers FOR SELECT 
  USING (is_active = TRUE OR auth.uid() = id OR public.is_admin());
CREATE POLICY "Trainers can update own info" ON public.trainers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full trainer access" ON public.trainers FOR ALL TO authenticated USING (public.is_admin());

-- Timeslots: Public select, trainer management
CREATE POLICY "Public timeslot view" ON public.timeslots FOR SELECT USING (TRUE);
CREATE POLICY "Trainers manage own timeslots" ON public.timeslots FOR ALL USING (auth.uid() = trainer_id);

-- Appointments: Owner/Trainer select/update, user insert
CREATE POLICY "View own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id OR auth.uid() = trainer_id);
CREATE POLICY "Users create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = trainer_id);
