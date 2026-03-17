import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchUserAppointments, updateAppointmentStatus } from "@/store/slices/appointmentsSlice";
import StatCard from "@/components/dashboard/StatCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Calendar, CheckCircle2, Clock, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AppointmentCard from "@/components/appointments/AppointmentCard";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((store) => store.auth.user);
  const { appointments, loading } = useAppSelector((store) => store.appointments);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  const [cancelId, setCancelId] = useState<string | null>(null);

  const myAppointments = appointments
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const scheduled = myAppointments.filter((appointment) => appointment.status === "scheduled").length;
  const completed = myAppointments.filter((appointment) => appointment.status === "completed").length;

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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Hi, {user?.full_name?.split(" ")[0]} 👋
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Track your fitness journey
          </p>
        </div>

        <Button
          className="gradient-primary text-primary-foreground"
          onClick={() => navigate("/trainers")}
        >
          <Search className="w-4 h-4 mr-2" />
          Find Trainers
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Sessions"
          value={myAppointments.length}
          icon={Calendar}
          delay={0}
        />

        <StatCard
          title="Upcoming"
          value={scheduled}
          icon={Clock}
          delay={0.05}
        />

        <StatCard
          title="Completed"
          value={completed}
          icon={CheckCircle2}
          delay={0.1}
        />
      </div>

      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          My Appointments
        </h2>

        {myAppointments.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />

            <p className="text-sm text-muted-foreground mb-3">
              No appointments yet
            </p>

            <Button
              variant="outline"
              onClick={() => navigate("/trainers")}
              className="text-sm"
            >
              Browse Trainers
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {myAppointments.map((apt, i) => {
              return (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showTrainer
                  onCancel={(id) => setCancelId(id)}
                  delay={i * 0.05}
                />
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancel}
      />
    </section>
  );
};

export default UserDashboard;
