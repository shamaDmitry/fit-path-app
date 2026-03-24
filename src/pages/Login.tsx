import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { signIn, signInWithOAuth } from "@/store/slices/authSlice";
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
import { Sparkles } from "lucide-react";
import PasswordInput from "@/components/shared/PasswordInput";
import GoogleIcon from "@/components/shared/icons/GoogleIcon";
import GithubIcon from "@/components/shared/icons/GithubIcon";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("admin@fitpath.com");
  const [password, setPassword] = useState("AdminPassword123!");

  const handleEmailLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await dispatch(signIn({ email, password }));

    if (signIn.fulfilled.match(result)) {
      const user = result.payload.user;

      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "trainer") navigate("/trainer");
      else navigate("/dashboard");
    }
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    dispatch(signInWithOAuth(provider));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>

            <span className="text-2xl font-display font-bold text-foreground">
              FitPath
            </span>
          </motion.div>

          <p className="text-muted-foreground text-sm">
            Sign in to manage your fitness journey
          </p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display">Welcome back</CardTitle>

            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full h-10 bg-muted/50 border-border/50"
                onClick={() => handleOAuthLogin("google")}
                disabled={isLoading}
              >
                <GoogleIcon className="mr-2 size-4" />
                Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-10 bg-muted/50 border-border/50"
                onClick={() => handleOAuthLogin("github")}
                disabled={isLoading}
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-muted-foreground">
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-muted-foreground">
                    Password
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <PasswordInput
                  id="password"
                  value={password}
                  setPassword={setPassword}
                  isLoading={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground h-10"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="flex items-center gap-4 justify-center">
              <Button
                onClick={() => {
                  setEmail("admin@fitpath.com");
                  setPassword("AdminPassword123!");
                }}
              >
                As Admin
              </Button>

              <Button
                onClick={() => {
                  setEmail("marcus@fitpath.com");
                  setPassword("TrainerPassword123!");
                }}
              >
                As Trainer
              </Button>

              <Button
                onClick={() => {
                  setEmail("alex@fitpath.com");
                  setPassword("UserPassword123!");
                }}
              >
                As User
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
