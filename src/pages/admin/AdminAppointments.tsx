import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
// import { cancelAppointment } from "@/store/slices/appointmentsSlice";
import { unbookTimeslot } from "@/store/slices/timeslotsSlice";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AdminAppointments = () => {
  const dispatch = useAppDispatch();

  const appointments = useAppSelector((s) => s.appointments.appointments);

  const [statusFilter, setStatusFilter] = useState("all");
  const [cancelId, setCancelId] = useState<string | null>(null);

  const filtered =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  );

  const handleCancel = () => {
    if (!cancelId) return;

    const apt = appointments.find((a) => a.id === cancelId);

    // dispatch(cancelAppointment(cancelId));

    if (apt?.timeslot_id) {
      dispatch(unbookTimeslot(apt.timeslot_id));
    }

    toast.success("Appointment cancelled");

    setCancelId(null);
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            All Appointments
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {appointments.length} total appointments
          </p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-9 bg-muted/50 border-border/50">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {sorted.map((apt, i) => {
          return (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              showUser
              onCancel={(id) => setCancelId(id)}
              delay={i * 0.03}
            />
          );
        })}
      </div>

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

export default AdminAppointments;
