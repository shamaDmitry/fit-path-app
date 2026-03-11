import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { signUp } from "@/store/slices/authSlice";
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

import { Eye, EyeOff, Sparkles } from "lucide-react";

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test1234");
  const [fullName, setFullName] = useState("Test User");
  const [showPass, setShowPass] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(signUp({ email, password, fullName }));

    if (signUp.fulfilled.match(result)) {
      navigate("/login");
    }
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
            Create an account to start your journey
          </p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display">
              Create Account
            </CardTitle>

            <CardDescription>Join FitPath today</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="fullName"
                  className="text-sm text-muted-foreground"
                >
                  Full Name
                </Label>

                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 bg-muted/50 border-border/50"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm text-muted-foreground"
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

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm text-muted-foreground"
                >
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 bg-muted/50 border-border/50"
                    required
                    disabled={isLoading}
                  />

                  <Button
                    size={"icon-sm"}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    type="button"
                    variant={"default"}
                    onClick={() => setShowPass((prev) => !prev)}
                  >
                    {showPass ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground h-10"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
