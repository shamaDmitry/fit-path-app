import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetPassword, verifyResetOtp } from "@/store/slices/authSlice";
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
import { Sparkles, ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isActionLoading: isLoading } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await dispatch(resetPassword(email)).unwrap();

      setStep("code");
    } catch (error) {
      // Error handled by toast in thunk
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");

      return;
    }

    try {
      await dispatch(verifyResetOtp({ email, token: code })).unwrap();

      navigate("/reset-password");
    } catch (error) {
      // Error handled by toast in thunk
    }
  };

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
          <NavLink to="/login" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>

            <span className="text-2xl font-display font-bold text-foreground">
              FitPath
            </span>
          </NavLink>
        </div>

        <Card className="glass border-border/50 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>

                  <CardTitle className="text-xl font-display">
                    Forgot Password
                  </CardTitle>

                  <CardDescription>
                    Enter your email to receive a 6-digit reset code
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Email Address
                      </Label>

                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 bg-muted/30 border-border/50 focus:ring-primary/20"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-primary text-primary-foreground h-11 font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Code"}
                    </Button>
                  </form>

                  <div className="text-center pt-2">
                    <Link
                      to="/login"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
                  </div>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="code-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CardHeader className="pb-4">
                  <div className="size-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>

                  <CardTitle className="text-xl font-display">
                    Enter Verification Code
                  </CardTitle>

                  <CardDescription>
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="code"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Verification Code
                      </Label>

                      <Input
                        id="code"
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="h-12 bg-muted/30 border-border/50 text-center text-2xl tracking-[0.5em] font-mono focus:ring-primary/20"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-primary text-primary-foreground h-11 font-medium"
                      disabled={isLoading || code.length !== 6}
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                  </form>

                  <div className="text-center space-y-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => setStep("email")}
                      variant="link"
                      className="block mx-auto"
                    >
                      Use a different email
                    </Button>

                    <Link
                      to="/login"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
