import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  fetchAdminAppointments,
  updateAppointmentStatus,
} from "@/store/slices/appointmentsSlice";
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
import { Loader2 } from "lucide-react";

const AdminAppointments = () => {
  const dispatch = useAppDispatch();

  const { appointments, loading } = useAppSelector((s) => s.appointments);

  const [statusFilter, setStatusFilter] = useState("all");
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminAppointments());
  }, [dispatch]);

  const filtered =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  );

  const handleCancel = async () => {
    if (!cancelId) return;

    try {
      const apt = appointments.find((a) => a.id === cancelId);

      await dispatch(
        updateAppointmentStatus({ id: cancelId, status: "cancelled" }),
      ).unwrap();

      if (apt?.timeslot_id) {
        dispatch(unbookTimeslot(apt.timeslot_id));
      }

      toast.success("Appointment cancelled");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel appointment",
      );
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
            <SelectItem value="all">All Status</SelectItem>
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
              showTrainer
              onCancel={(id) => setCancelId(id)}
              delay={i * 0.03}
            />
          );
        })}
      </div>

      {sorted.length === 0 && !loading && (
        <div className="glass rounded-xl p-12 text-center border border-dashed border-border/50">
          <p className="text-sm text-muted-foreground">No appointments found</p>
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

export default AdminAppointments;
