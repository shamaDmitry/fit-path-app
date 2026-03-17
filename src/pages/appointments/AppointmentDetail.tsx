import { useParams, useNavigate, NavLink } from "react-router";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  cancelAppointment,
  updateAppointmentStatus,
} from "@/store/slices/appointmentsSlice";

import { trainerColors } from "@/data/mockData";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle2,
  XCircle,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { unbookTimeslot } from "@/store/slices/timeslotsSlice";

const statusStyles: Record<string, string> = {
  scheduled: "bg-info/10 text-info border-info/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const AppointmentDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const appointments = useAppSelector((s) => s.appointments.appointments);
  const trainers = useAppSelector((s) => s.trainers.trainers);
  const user = useAppSelector((s) => s.auth.user);

  const [confirmCancel, setConfirmCancel] = useState(false);

  const appointment = appointments.find((a) => a.id === id);

  if (!appointment) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Appointment not found</p>

        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const trainer = trainers.find((trainer) => {
    return trainer.id === appointment.trainer_id;
  });

  const color = trainerColors[appointment.trainer_id] || "158 64% 32%";

  const start = new Date(appointment.start_time);
  const end = new Date(appointment.end_time);

  const trainerInitials = appointment.trainer_name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const canCancel =
    appointment.status === "scheduled" &&
    (user?.role === "admin" ||
      user?.id === appointment.user_id ||
      user?.id === appointment.trainer_id);

  const canComplete =
    appointment.status === "scheduled" &&
    (user?.role === "admin" || user?.id === appointment.trainer_id);

  const canPay =
    appointment.status === "scheduled" &&
    !appointment.paid &&
    user?.id === appointment.user_id;

  const handleCancel = () => {
    dispatch(cancelAppointment(appointment.id));

    if (appointment.timeslot_id)
      dispatch(unbookTimeslot(appointment.timeslot_id));

    toast.success("Appointment cancelled");

    setConfirmCancel(false);
  };

  const handleComplete = () => {
    dispatch(
      updateAppointmentStatus({ id: appointment.id, status: "completed" }),
    );

    toast.success("Appointment marked as completed");
  };

  const handlePay = () => {
    toast.success("Payment simulated — Stripe integration coming soon!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass border-border/50 overflow-hidden">
          <div className="h-2" style={{ backgroundColor: `hsl(${color})` }} />

          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-xl">
                Appointment Details
              </CardTitle>

              <Badge
                variant="outline"
                className={`capitalize ${statusStyles[appointment.status]}`}
              >
                {appointment.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => navigate(`/trainers/${appointment.trainer_id}`)}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback
                  className="font-display font-bold"
                  style={{
                    backgroundColor: `hsl(${color} / 0.12)`,
                    color: `hsl(${color})`,
                  }}
                >
                  {trainerInitials}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium text-foreground">
                  {appointment.trainer_name}
                </p>

                {trainer && (
                  <p className="text-xs text-muted-foreground">
                    {trainer.specialty?.label}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> Client
                </p>

                <p className="text-sm font-medium">
                  {/* <NavLink to={`/users/${appointment.user_id}`}> */}
                  <NavLink to="#">{appointment.user_name}</NavLink>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </p>

                <p className="text-sm font-medium">
                  {format(start, "EEEE, MMMM d, yyyy")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time
                </p>

                <p className="text-sm font-medium">
                  {format(start, "HH:mm")} – {format(end, "HH:mm")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Price
                </p>

                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    ${appointment.price || "—"}
                  </p>
                  {appointment.price &&
                    (appointment.paid ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-success/10 text-success border-success/20"
                      >
                        Paid
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-warning/10 text-warning border-warning/20"
                      >
                        Unpaid
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Created</p>

              <p className="text-sm">
                {format(
                  new Date(appointment.created_at),
                  "MMM d, yyyy 'at' HH:mm",
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {canPay && (
                <Button
                  size="sm"
                  className="gradient-primary text-primary-foreground"
                  onClick={handlePay}
                >
                  <CreditCard className="w-4 h-4 mr-2" /> Pay $
                  {appointment.price}
                </Button>
              )}

              {canComplete && (
                <Button size="sm" variant="success" onClick={handleComplete}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
                </Button>
              )}

              {canCancel && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setConfirmCancel(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancel}
      />
    </div>
  );
};

export default AppointmentDetail;
