import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
// import { cancelAppointment } from "@/store/slices/appointmentsSlice";
import { unbookTimeslot } from "@/store/slices/timeslotsSlice";
import { fetchTrainers } from "@/store/slices/trainersSlice";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { fetchAdminAppointments } from "@/store/slices/appointmentsSlice";
import { fetchUserCount } from "@/store/slices/authSlice";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  const { appointments } = useAppSelector((s) => s.appointments);
  const { trainers, loading } = useAppSelector((s) => s.trainers);
  const { usersCount } = useAppSelector((s) => s.auth);

  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTrainers());
    dispatch(fetchAdminAppointments());
    dispatch(fetchUserCount());
  }, [dispatch]);

  const scheduled = appointments.filter((a) => a.status === "scheduled").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  const totalUsers = usersCount;

  const totalRevenue = appointments
    .filter((a) => a.paid && a.price)
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const recentAppointments = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

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

  console.log("appointments", appointments);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Admin Dashboard
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Overview of your platform performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          icon={Calendar}
          delay={0}
          loading={loading}
        />

        <StatCard
          title="Scheduled"
          value={scheduled}
          icon={Activity}
          trend={{
            value: `${Math.round((scheduled / appointments.length) * 100) || 0}%`,
            positive: true,
          }}
          delay={0.05}
        />

        <StatCard
          title="Completed"
          value={completed}
          icon={CheckCircle2}
          trend={{
            value: `${Math.round((completed / appointments.length) * 100) || 0}%`,
            positive: true,
          }}
          delay={0.1}
        />

        <StatCard
          title="Cancelled"
          value={cancelled}
          icon={XCircle}
          trend={{
            value: `${Math.round((cancelled / appointments.length) * 100) || 0}%`,
            positive: false,
          }}
          delay={0.15}
        />

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          delay={0.2}
        />

        <StatCard
          title="Active Trainers"
          value={trainers.length}
          icon={TrendingUp}
          delay={0.25}
          loading={loading}
        />

        <StatCard
          title="Revenue"
          value={`$${totalRevenue}`}
          icon={DollarSign}
          delay={0.3}
          loading={loading}
        />
      </div>

      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Recent Appointments
        </h2>

        <div className="space-y-3">
          {recentAppointments.map((apt, i) => {
            return (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                showTrainer
                showUser
                onCancel={(id) => setCancelId(id)}
                delay={i * 0.05}
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
    </div>
  );
};

export default AdminDashboard;
