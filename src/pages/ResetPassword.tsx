import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePassword, getHomeRoute } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, KeyRound, CheckCircle2 } from "lucide-react";
import PasswordInput from "@/components/shared/PasswordInput";
import { toast } from "sonner";

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, isAuthenticated, user } = useAppSelector((s) => s.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");

      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(updatePassword({ newPassword: password })).unwrap();

      setIsSuccess(true);

      setTimeout(() => {
        navigate(getHomeRoute(user?.role));
      }, 3000);
    } catch (error) {
      // Error handled by toast in thunk
    }
  };

  if (!isAuthenticated && !isSuccess) {
    navigate("/login");

    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-success/20 blur-3xl" />

          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10 text-center"
        >
          <Card className="glass border-border/50 shadow-xl p-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <CardTitle className="text-2xl font-display mb-2">
              Password Reset!
            </CardTitle>
            <CardDescription className="text-base">
              Your password has been successfully updated. Redirecting you to
              your dashboard...
            </CardDescription>
            <Button
              className="mt-8 w-full gradient-primary text-primary-foreground"
              onClick={() => navigate(getHomeRoute(user?.role))}
            >
              Go to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">
              FitPath
            </span>
          </div>
        </div>

        <Card className="glass border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>

            <CardTitle className="text-xl font-display">
              Set New Password
            </CardTitle>

            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  New Password
                </Label>

                <PasswordInput
                  id="password"
                  value={password}
                  setPassword={setPassword}
                  placeholder="At least 6 characters"
                  isLoading={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Confirm New Password
                </Label>

                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  setPassword={setConfirmPassword}
                  placeholder="Repeat new password"
                  isLoading={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground h-11 font-medium mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
