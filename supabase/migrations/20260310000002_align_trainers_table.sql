-- Migration to align trainers table with the Trainer interface
-- Adding: full_name, avatar_url, phone, email
-- Removing: none (keeping created_at/updated_at as standard)

-- 1. Add missing columns to trainers table
ALTER TABLE public.trainers 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Update the handle_new_user function to sync these fields to the trainers table
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

  -- If user is registered as a trainer, also create a row in the trainers table with denormalized fields
  IF (COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'trainer') THEN
    INSERT INTO public.trainers (id, full_name, avatar_url, phone, email, rating)
    VALUES (
      NEW.id, 
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'phone',
      NEW.email,
      4.5
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add a trigger to sync profile updates back to the trainers table
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_updated_sync_trainer ON public.profiles;
CREATE TRIGGER on_profile_updated_sync_trainer
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.full_name IS DISTINCT FROM NEW.full_name OR 
        OLD.avatar_url IS DISTINCT FROM NEW.avatar_url OR 
        OLD.phone IS DISTINCT FROM NEW.phone OR 
        OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_profile_to_trainer();

-- 4. Backfill existing trainers (if any)
UPDATE public.trainers t
SET 
  full_name = p.full_name,
  avatar_url = p.avatar_url,
  phone = p.phone,
  email = p.email
FROM public.profiles p
WHERE t.id = p.id;
