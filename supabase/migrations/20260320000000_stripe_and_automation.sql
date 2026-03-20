-- Add Stripe and Automation support
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add a column to track if an appointment was auto-generated
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS is_auto_generated BOOLEAN DEFAULT FALSE;

-- Function to automatically create a corresponding appointment for the next day
-- if a trainer creates one today (optional logic based on your requirement)
CREATE OR REPLACE FUNCTION public.handle_auto_next_day_appointment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if it's not already an auto-generated one to prevent infinite loops
  IF (NEW.is_auto_generated = FALSE) THEN
    INSERT INTO public.appointments (
      user_id,
      trainer_id,
      timeslot_id,
      start_time,
      end_time,
      status,
      price,
      is_auto_generated
    )
    VALUES (
      NEW.user_id,
      NEW.trainer_id,
      NULL, -- Timeslot might need to be generated too, or handled separately
      NEW.start_time + INTERVAL '1 day',
      NEW.end_time + INTERVAL '1 day',
      'scheduled',
      NEW.price,
      TRUE
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: You might want to enable this trigger only for specific trainer actions
-- CREATE TRIGGER tr_auto_generate_next_day
-- AFTER INSERT ON public.appointments
-- FOR EACH ROW EXECUTE FUNCTION public.handle_auto_next_day_appointment();
