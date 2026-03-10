import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Calendar, Shield, Lock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { getUserInitials } from "@/lib/utils";
import { updatePassword, deleteAccount } from "@/store/slices/authSlice";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import PasswordInput from "@/components/shared/PasswordInput";

const UserProfilePage = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);

  const { isLoading } = useAppSelector((s) => s.auth);

  const appointments = useAppSelector((s) => s.appointments.appointments);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const initials = getUserInitials(user.full_name);

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

  const totalSpent = myAppointments
    .filter((appointment) => appointment.paid && appointment.price)
    .reduce((sum, appointment) => sum + (appointment.price || 0), 0);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    await dispatch(updatePassword(newPassword));

    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = async () => {
    await dispatch(deleteAccount());
  };

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          My Profile
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-5">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-3xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <h2 className="text-xl font-display font-bold text-foreground">
                      {user.full_name}
                    </h2>

                    <Badge
                      variant="secondary"
                      className="mt-1 capitalize text-xs"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>

                  <div className="w-full space-y-3 text-sm">
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
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30 border border-border/30">
                  <span className="text-xs text-muted-foreground">
                    Appointments
                  </span>
                  <span className="font-display font-bold">
                    {myAppointments.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-info/5 border border-info/10">
                  <span className="text-xs text-muted-foreground">
                    Scheduled
                  </span>
                  <span className="font-display font-bold text-info">
                    {scheduled}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-success/5 border border-success/10">
                  <span className="text-xs text-muted-foreground">
                    Completed
                  </span>
                  <span className="font-display font-bold text-success">
                    {completed}
                  </span>
                </div>
                {user.role === "user" && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-warning/5 border border-warning/10">
                    <span className="text-xs text-muted-foreground">
                      Invested
                    </span>
                    <span className="font-display font-bold text-warning">
                      ${totalSpent}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Security Settings
                </CardTitle>

                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword">New Password</Label>

                      <PasswordInput
                        id="newPassword"
                        value={newPassword}
                        setPassword={setNewPassword}
                        isLoading={isLoading}
                        placeholder="Enter new password"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>

                      <PasswordInput
                        id="confirmPassword"
                        value={confirmPassword}
                        setPassword={setConfirmPassword}
                        isLoading={isLoading}
                        placeholder="Confirm new password"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="gradient-primary text-primary-foreground"
                    disabled={isLoading || !newPassword}
                  >
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="font-display text-lg text-red-500 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Permanently delete account?"
        description="This action cannot be undone. All your bookings and personal information will be permanently removed from our servers."
        confirmLabel="Delete my account"
        variant="destructive"
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default UserProfilePage;
