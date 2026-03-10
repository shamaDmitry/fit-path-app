-- Add is_active column to trainers table
ALTER TABLE public.trainers
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update RLS policies to respect is_active for public view
-- Note: Profiles are viewable by everyone, but we might want to filter trainers in the application logic
-- or update the policy here. 
-- For now, we'll keep the policy simple and handle filtering in the UI/Store.
