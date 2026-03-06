import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { cancelAppointment } from "@/store/slices/appointmentsSlice";
import { unbookTimeslot } from "@/store/slices/timeslotsSlice";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

const TrainerAppointments = () => {
  const user = useAppSelector((s) => s.auth.user);
  const appointments = useAppSelector((s) => s.appointments.appointments);

  const dispatch = useAppDispatch();

  const [cancelId, setCancelId] = useState<string | null>(null);

  const myAppointments = appointments
    .filter((a) => a.trainer_id === user?.id)
    .sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
    );

  const handleCancel = () => {
    if (!cancelId) return;

    const apt = appointments.find((a) => a.id === cancelId);

    dispatch(cancelAppointment(cancelId));

    if (apt?.timeslot_id) {
      dispatch(unbookTimeslot(apt.timeslot_id));
    }

    toast.success("Appointment cancelled");

    setCancelId(null);
  };

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
