import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchTrainerAppointments, updateAppointmentStatus } from "@/store/slices/appointmentsSlice";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TrainerAppointments = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { appointments, loading } = useAppSelector((s) => s.appointments);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTrainerAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  const [cancelId, setCancelId] = useState<string | null>(null);

  const myAppointments = [...appointments]
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  const handleCancel = async () => {
    if (!cancelId) return;

    try {
      await dispatch(updateAppointmentStatus({ id: cancelId, status: "cancelled" })).unwrap();
      toast.success("Appointment cancelled");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel appointment");
    } finally {
      setCancelId(null);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          My Appointments
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          {myAppointments.length} total sessions
        </p>
      </div>

      {myAppointments.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />

          <p className="text-sm text-muted-foreground">No appointments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myAppointments.map((apt, i) => {
            return (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                showTrainer={false}
                showUser
                onCancel={(id) => setCancelId(id)}
                delay={i * 0.03}
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment?"
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancel}
      />
    </div>
  );
};

export default TrainerAppointments;
