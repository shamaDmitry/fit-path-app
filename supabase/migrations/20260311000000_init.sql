-- Initial Schema Migration (Clean & Optimized)
-- This migration sets up the tables, extensions, and roles from a fresh state.

-- 1. Setup Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- 2. Setup Database Roles and Search Paths
ALTER ROLE authenticator SET search_path TO public, extensions, auth;
ALTER ROLE authenticated SET search_path TO public, extensions, auth;
ALTER ROLE anon SET search_path TO public, extensions, auth;
ALTER ROLE service_role SET search_path TO public, extensions, auth;

-- 3. Create Tables
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'trainer', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.trainers (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  specialty TEXT,
  rating NUMERIC DEFAULT 4.5,
  experience_years INTEGER DEFAULT 0,
  color TEXT,
  certifications TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.timeslots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  timeslot_id UUID REFERENCES public.timeslots(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  price NUMERIC,
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeslots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND "role" = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Auth Trigger (Secure Trainer Creation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
  creator_is_admin BOOLEAN;
BEGIN
  -- Check if the person performing the action is an admin
  -- auth.uid() refers to the user making the request.
  -- For public signups, auth.uid() is null (or the user themselves after they sign up? No, during trigger it's often null for signup)
  -- Actually, in many cases for Signup, auth.uid() is null.
  
  -- We only allow 'trainer' or 'admin' roles to be set if the creator is an admin.
  -- Otherwise, we force it to 'user'.
  
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Simple check: if requested role is not 'user', verify admin status
  IF (new_role IN ('trainer', 'admin')) THEN
    -- Check if current requester is admin
    -- Note: This works if an Admin uses auth.admin.createUser or a logged-in admin performs a task.
    SELECT public.is_admin() INTO creator_is_admin;
    
    IF (NOT COALESCE(creator_is_admin, FALSE)) THEN
       new_role := 'user';
    END IF;
  END IF;

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

-- 7. Attach Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

CREATE TRIGGER on_profile_updated_sync_trainer
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.full_name IS DISTINCT FROM NEW.full_name OR 
        OLD.avatar_url IS DISTINCT FROM NEW.avatar_url OR 
        OLD.phone IS DISTINCT FROM NEW.phone OR 
        OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_profile_to_trainer();

CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_trainers_updated BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_timeslots_updated BEFORE UPDATE ON public.timeslots FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_appointments_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Trainers are viewable by everyone" ON public.trainers
  FOR SELECT USING (
    is_active = TRUE OR 
    auth.uid() = id OR 
    public.is_admin()
  );
CREATE POLICY "Trainers can update their own trainer data" ON public.trainers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to trainers" ON public.trainers FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Timeslots are viewable by everyone" ON public.timeslots FOR SELECT USING (TRUE);
CREATE POLICY "Trainers can manage their own timeslots" ON public.timeslots FOR ALL USING (auth.uid() = trainer_id);

CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id OR auth.uid() = trainer_id);
CREATE POLICY "Users can create their own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = trainer_id);
