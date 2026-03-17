import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  fetchTrainerTimeslots,
  addTimeslot,
  removeTimeslot,
} from "@/store/slices/timeslotsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Trash2, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";

const TrainerTimeslots = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);
  const { timeslots, loading } = useAppSelector((s) => s.timeslots);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTrainerTimeslots(user.id));
    }
  }, [dispatch, user?.id]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!user?.id) return;

    if (!date || !startTime || !endTime) {
      toast.error("Please fill all fields");

      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");

      return;
    }

    setIsAdding(true);

    try {
      await dispatch(
        addTimeslot({
          trainer_id: user.id,
          date,
          start_time: startTime,
          end_time: endTime,
          is_booked: false,
        }),
      ).unwrap();

      toast.success("Timeslot added");

      setDate("");
      setStartTime("09:00");
      setEndTime("10:00");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add timeslot",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(removeTimeslot(deleteId)).unwrap();

        toast.success("Timeslot removed");
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Failed to remove timeslot",
        );
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Manage Timeslots
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Create and manage your available slots
        </p>
      </div>

      {/* Add form */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Timeslot
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </Label>

              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="h-10 bg-muted/50 border-border/50"
                disabled={isAdding}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Start
              </Label>

              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-10 bg-muted/50 border-border/50"
                disabled={isAdding}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> End
              </Label>

              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-10 bg-muted/50 border-border/50"
                disabled={isAdding}
              />
            </div>

            <div className="flex items-end">
              <Button
                className="gradient-primary text-primary-foreground h-10"
                onClick={handleAdd}
                disabled={isAdding}
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slots list */}
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Your Timeslots ({timeslots.length})
        </h2>

        {loading && timeslots.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : timeslots.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />

            <p className="text-sm text-muted-foreground">
              No timeslots created yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {timeslots.map((slot, i) => {
                return (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: i * 0.02 }}
                    className="glass rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-xs uppercase font-medium text-primary">
                        {format(parseISO(slot.date), "MMM")}
                      </span>

                      <span className="text-base font-display font-bold text-primary leading-tight">
                        {format(parseISO(slot.date), "dd")}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="text-base font-medium text-foreground">
                        {format(parseISO(slot.date), "EEEE, MMMM d")}
                      </p>

                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {slot.start_time} –{" "}
                        {slot.end_time}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn("text-sm", {
                        "bg-info/10 text-info border-info/20": slot.is_booked,
                        "bg-success/10 text-success border-success/20":
                          !slot.is_booked,
                      })}
                    >
                      {slot.is_booked ? "Booked" : "Available"}
                    </Badge>

                    {!slot.is_booked && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove Timeslot"
        description="Are you sure you want to remove this timeslot?"
        confirmLabel="Remove"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TrainerTimeslots;
