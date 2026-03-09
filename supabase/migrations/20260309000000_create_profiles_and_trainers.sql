-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'trainer', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create trainers table (extension of profile for trainers)
CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  bio TEXT,
  specialty TEXT,
  rating NUMERIC DEFAULT 4.5,
  experience_years INTEGER DEFAULT 0,
  color TEXT,
  certifications TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- 4. Profiles Policies
-- Everyone can view profiles (to see trainer details, etc.)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. Trainers Policies
-- Everyone can view trainer details
CREATE POLICY "Trainers are viewable by everyone" ON public.trainers
  FOR SELECT USING (TRUE);

-- Trainers can only update their own trainer data
CREATE POLICY "Trainers can update their own trainer data" ON public.trainers
  FOR UPDATE USING (auth.uid() = id);

-- 6. Automation: Auto-insert profile on Signup
-- This function will be called by a trigger whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone'
  );

  -- If user is registered as a trainer, also create a row in the trainers table
  IF (COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'trainer') THEN
    INSERT INTO public.trainers (id, rating)
    VALUES (NEW.id, 4.5);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function above
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Automation: Updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER on_trainers_updated
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
