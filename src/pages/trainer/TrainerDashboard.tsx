import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  fetchTrainerAppointments,
  updateAppointmentStatus,
} from "@/store/slices/appointmentsSlice";
import { fetchTrainerTimeslots } from "@/store/slices/timeslotsSlice";
import StatCard from "@/components/dashboard/StatCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import { Skeleton } from "@/components/ui/skeleton";

const TrainerDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { appointments, loading: appointmentsLoading } = useAppSelector(
    (s) => s.appointments,
  );
  const { timeslots, loading: timeslotsLoading } = useAppSelector(
    (s) => s.timeslots,
  );
  const user = useAppSelector((s) => s.auth.user);

  const [cancelId, setCancelId] = useState<string | null>(null);
  const [completeId, setCompleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTrainerAppointments(user.id));
      dispatch(fetchTrainerTimeslots(user.id));
    }
  }, [dispatch, user?.id]);

  const myAppointments = appointments;
  const mySlots = timeslots;

  const scheduled = myAppointments.filter(
    (appointment) => appointment.status === "scheduled",
  );

  const completedCount = myAppointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const cancelledCount = myAppointments.filter(
    (appointment) => appointment.status === "cancelled",
  ).length;

  const availableSlotsCount = mySlots.filter((ts) => !ts.is_booked).length;

  const handleCancel = async () => {
    if (!cancelId) return;

    try {
      await dispatch(
        updateAppointmentStatus({ id: cancelId, status: "cancelled" }),
      ).unwrap();
      toast.success("Appointment cancelled");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel appointment",
      );
    } finally {
      setCancelId(null);
    }
  };

  const handleComplete = async () => {
    if (!completeId) return;

    try {
      await dispatch(
        updateAppointmentStatus({ id: completeId, status: "completed" }),
      ).unwrap();
      toast.success("Appointment marked as completed");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete appointment",
      );
    } finally {
      setCompleteId(null);
    }
  };

  const loading = appointmentsLoading || timeslotsLoading;

  return (
    <div className="mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Welcome, {user?.full_name}
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your training sessions
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/trainer/timeslots")}
        >
          <Clock className="w-4 h-4 mr-2" /> Manage Timeslots
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          new Array(4)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-40" />)
        ) : (
          <>
            <StatCard
              title="Scheduled"
              value={scheduled.length}
              icon={Clock}
              delay={0}
              color="bg-info/10 text-info border-info/20"
            />

            <StatCard
              title="Completed"
              value={completedCount}
              icon={CheckCircle2}
              delay={0.05}
              color="bg-success/10 text-success border-success/20"
            />

            <StatCard
              title="Cancelled"
              value={cancelledCount}
              icon={XCircle}
              delay={0.1}
              color="bg-destructive/10 text-destructive border-destructive/20"
            />

            <StatCard
              title="Open Slots"
              value={availableSlotsCount}
              icon={Calendar}
              delay={0.15}
              color="bg-accent/10 text-accent border-accent/20"
            />
          </>
        )}
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Upcoming Sessions
        </h2>

        {scheduled.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />

            <p className="text-sm text-muted-foreground">
              No upcoming sessions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduled.map((apt, i) => {
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/appointments/${apt.id}`)}
                >
                  <div className="shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase font-medium text-primary">
                      {format(new Date(apt.start_time), "MMM")}
                    </span>

                    <span className="text-lg font-display font-bold text-primary leading-tight">
                      {format(new Date(apt.start_time), "dd")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {apt.user_name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {format(new Date(apt.start_time), "HH:mm")} –{" "}
                      {format(new Date(apt.end_time), "HH:mm")}
                    </p>
                  </div>

                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setCancelId(apt.id)}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="sm"
                      variant="gradient-primary"
                      onClick={() => setCompleteId(apt.id)}
                    >
                      Complete
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* All */}
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          All Appointments
        </h2>

        <div className="space-y-3">
          {myAppointments.map((apt, i) => {
            return (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                showTrainer={false}
                showUser
                delay={i * 0.03}
              />
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment?"
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancel}
      />

      <ConfirmDialog
        open={!!completeId}
        onOpenChange={(open) => !open && setCompleteId(null)}
        title="Complete Appointment"
        description="Mark this appointment as completed?"
        confirmLabel="Complete"
        variant="default"
        onConfirm={handleComplete}
      />
    </div>
  );
};

export default TrainerDashboard;
