import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetPassword } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(resetPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/50 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/50 blur-3xl" />
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

        <Card className="glass border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display">
              Forgot Password
            </CardTitle>

            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs text-muted-foreground"
                >
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-muted/50 border-border/50"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground h-10"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
