import { useState, useMemo, useEffect } from "react";
import { type Trainer } from "@/data/mockData";
import { useAppDispatch, useAppSelector } from "@/store";
import { createAppointment } from "@/store/slices/appointmentsSlice";
import { fetchPublicTimeslots } from "@/store/slices/timeslotsSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getUserInitials } from "@/lib/utils";

interface BookingDialogProps {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDialog = ({ trainer, open, onOpenChange }: BookingDialogProps) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);
  const { timeslots, loading: slotsLoading } = useAppSelector(
    (s) => s.timeslots,
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const trainerId = trainer?.id;

  useEffect(() => {
    if (open && trainerId) {
      dispatch(fetchPublicTimeslots(trainerId));
    }
  }, [dispatch, open, trainerId]);

  const trainerColor = trainer?.color || "158 64% 32%";

  // Get available slots for this trainer
  const availableSlots = useMemo(
    () =>
      timeslots.filter((ts) => ts.trainer_id === trainerId && !ts.is_booked),
    [timeslots, trainerId],
  );

  // Group by date
  const dateGroups = useMemo(() => {
    const groups: Record<string, typeof availableSlots> = {};

    availableSlots.forEach((ts) => {
      if (!groups[ts.date]) groups[ts.date] = [];
      groups[ts.date].push(ts);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [availableSlots]);

  const slotsForDate = useMemo(
    () =>
      selectedDate
        ? availableSlots
            .filter((ts) => ts.date === selectedDate)
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
        : [],
    [availableSlots, selectedDate],
  );

  const selectedSlot = useMemo(
    () => timeslots.find((ts) => ts.id === selectedSlotId),
    [timeslots, selectedSlotId],
  );

  if (!trainer) return null;

  const initials = getUserInitials(trainer.full_name);

  const handleBook = async () => {
    if (!selectedSlot || !user?.id) {
      toast.error("Please select a timeslot");
      return;
    }

    const startTime = new Date(
      `${selectedSlot.date}T${selectedSlot.start_time}:00`,
    );

    const endTime = new Date(
      `${selectedSlot.date}T${selectedSlot.end_time}:00`,
    );

    setIsBooking(true);
    try {
      await dispatch(
        createAppointment({
          user_id: user.id,
          trainer_id: trainer.id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: "scheduled",
          timeslot_id: selectedSlot.id,
          price: 65 + Math.floor(Math.random() * 30),
          paid: false,
        }),
      ).unwrap();

      toast.success(`Session booked with ${trainer.full_name}!`);
      onOpenChange(false);
      setSelectedDate(null);
      setSelectedSlotId(null);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to book session",
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setSelectedDate(null);
          setSelectedSlotId(null);
        }
      }}
    >
      <DialogContent className="glass border-border/50 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Book a Session</DialogTitle>
          <DialogDescription>Select an available timeslot</DialogDescription>
        </DialogHeader>

        {/* Trainer info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="h-10 w-10">
            <AvatarFallback
              className="font-display font-bold text-sm"
              style={{
                backgroundColor: `hsl(${trainerColor} / 0.15)`,
                color: `hsl(${trainerColor})`,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium text-foreground">
              {trainer.full_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {trainer.specialty?.label}
            </p>
          </div>
        </div>

        {/* Date selection */}
        {slotsLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading available slots...
            </p>
          </div>
        ) : dateGroups.length === 0 ? (
          <div className="py-8 text-center">
            <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              No available timeslots
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Select Date
              </p>

              <div className="flex gap-2 flex-wrap">
                {dateGroups.map(([date, slots]) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? "default" : "outline"}
                    size="sm"
                    className={cn("text-xs", {
                      "gradient-primary text-primary-foreground":
                        selectedDate === date,
                      "border-border/50": selectedDate !== date,
                    })}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlotId(null);
                    }}
                  >
                    {format(parseISO(date), "EEE, MMM d")}
                    <Badge
                      variant="secondary"
                      className="ml-1.5 text-[10px] h-4 px-1"
                    >
                      {slots.length}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Available Times
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {slotsForDate.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={
                          selectedSlotId === slot.id ? "default" : "outline"
                        }
                        size="sm"
                        className={cn("text-xs relative", {
                          "gradient-primary text-primary-foreground":
                            selectedSlotId === slot.id,
                          "border-border/50": selectedSlotId !== slot.id,
                        })}
                        onClick={() => setSelectedSlotId(slot.id)}
                      >
                        <span className="font-medium">
                          {slot.start_time} – {slot.end_time}
                        </span>
                        {selectedSlotId === slot.id && (
                          <Check className="w-3 h-3 ml-1 absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isBooking}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 gradient-primary text-primary-foreground"
            onClick={handleBook}
            disabled={!selectedSlotId || isBooking}
          >
            {isBooking ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
