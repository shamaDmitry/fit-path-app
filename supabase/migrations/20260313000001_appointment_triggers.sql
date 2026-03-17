-- Migration to handle atomic booking and unbooking of timeslots via triggers

-- 1. Function to mark timeslot as booked when an appointment is created
CREATE OR REPLACE FUNCTION public.handle_appointment_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.timeslot_id IS NOT NULL THEN
    UPDATE public.timeslots
    SET is_booked = TRUE
    WHERE id = NEW.timeslot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Function to mark timeslot as available when an appointment is cancelled or deleted
CREATE OR REPLACE FUNCTION public.handle_appointment_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  -- If the appointment status is changed to 'cancelled', or the appointment is deleted
  IF (TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND OLD.status != 'cancelled') OR (TG_OP = 'DELETE') THEN
    IF OLD.timeslot_id IS NOT NULL THEN
      UPDATE public.timeslots
      SET is_booked = FALSE
      WHERE id = OLD.timeslot_id;
    END IF;
  END IF;
  
  IF (TG_OP = 'UPDATE') THEN
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Attach triggers to appointments table
DROP TRIGGER IF EXISTS on_appointment_created_book_timeslot ON public.appointments;
CREATE TRIGGER on_appointment_created_book_timeslot
  AFTER INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_appointment_booking();

DROP TRIGGER IF EXISTS on_appointment_cancelled_unbook_timeslot ON public.appointments;
CREATE TRIGGER on_appointment_cancelled_unbook_timeslot
  AFTER UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_appointment_cancellation();
