import { useAppSelector } from "@/store";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";

const UserProfilePage = () => {
  const user = useAppSelector((s) => s.auth.user);

  const appointments = useAppSelector((s) => s.appointments.appointments);

  if (!user) return null;

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const myAppointments = appointments.filter((appointment) => {
    return (
      appointment.user_id === user.id || appointment.trainer_id === user.id
    );
  });

  const scheduled = myAppointments.filter(
    (appointment) => appointment.status === "scheduled",
  ).length;

  const completed = myAppointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const cancelled = myAppointments.filter(
    (appointment) => appointment.status === "cancelled",
  ).length;

  const totalSpent = myAppointments
    .filter((appointment) => appointment.paid && appointment.price)
    .reduce((sum, appointment) => sum + (appointment.price || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          My Profile
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage your account
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {user.full_name}
                </h2>

                <Badge variant="secondary" className="mt-1 capitalize text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" /> {user.email}
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" /> {user.phone}
                    </div>
                  )}

                  {user.joined_at && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" /> Joined{" "}
                      {format(new Date(user.joined_at), "MMMM yyyy")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-base">
              Activity Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-display font-bold text-foreground">
                  {myAppointments.length}
                </p>

                <p className="text-xs text-muted-foreground">Total</p>
              </div>

              <div className="text-center p-3 rounded-lg bg-info/5">
                <p className="text-2xl font-display font-bold text-info">
                  {scheduled}
                </p>

                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>

              <div className="text-center p-3 rounded-lg bg-success/5">
                <p className="text-2xl font-display font-bold text-success">
                  {completed}
                </p>

                <p className="text-xs text-muted-foreground">Completed</p>
              </div>

              <div className="text-center p-3 rounded-lg bg-warning/5">
                <p className="text-2xl font-display font-bold text-warning">
                  ${totalSpent}
                </p>

                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
