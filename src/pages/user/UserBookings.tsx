import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { cancelAppointment } from "@/store/slices/appointmentsSlice";
import { unbookTimeslot } from "@/store/slices/timeslotsSlice";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";

const UserBookings = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);

  const appointments = useAppSelector((s) => s.appointments.appointments);

  const [cancelId, setCancelId] = useState<string | null>(null);

  const myAppointments = appointments
    .filter((appointment) => appointment.user_id === user?.id)
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
          My Bookings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage your appointments
        </p>
      </div>

      <div className="space-y-3">
        {myAppointments.map((apt, i) => (
          <AppointmentCard
            key={apt.id}
            appointment={apt}
            showTrainer
            onCancel={(id) => setCancelId(id)}
            delay={i * 0.05}
          />
        ))}
      </div>

      {myAppointments.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-sm text-muted-foreground">No bookings yet</p>
        </div>
      )}

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancel}
      />
    </div>
  );
};

export default UserBookings;
