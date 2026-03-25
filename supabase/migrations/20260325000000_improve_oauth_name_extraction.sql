-- Improve OAuth Name Extraction in handle_new_user
-- This migration updates the trigger function to handle different name keys provided by GitHub and Google.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
  requester_is_admin BOOLEAN;
  is_super_creation BOOLEAN;
  extracted_full_name TEXT;
BEGIN
  -- 1. Improved Name Extraction (GitHub uses 'full_name' or 'name' or 'user_name')
  extracted_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'name', 
    NEW.raw_user_meta_data->>'user_name',
    'New User'
  );

  -- 2. Original Security Logic
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Check if requester is already an admin
  SELECT public.is_admin() INTO requester_is_admin;
  -- Flag used by Seed process or Edge Functions
  is_super_creation := COALESCE((NEW.raw_user_meta_data->>'is_super_admin')::BOOLEAN, FALSE);

  -- Only allow privileged roles if admin/super-admin
  IF (new_role IN ('trainer', 'admin') AND NOT COALESCE(requester_is_admin, FALSE) AND NOT is_super_creation) THEN
     new_role := 'user';
  END IF;

  -- 3. Insert into Profiles (using the extracted name)
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url, phone)
  VALUES (
    NEW.id,
    extracted_full_name,
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

  -- 4. Original Trainer Logic
  IF (new_role = 'trainer') THEN
    INSERT INTO public.trainers (id, full_name, email, avatar_url, phone, rating, is_active)
    VALUES (
      NEW.id,
      extracted_full_name,
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
