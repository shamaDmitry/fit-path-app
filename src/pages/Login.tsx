import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/store";
import { login } from "@/store/slices/authSlice";
import { mockUsers } from "@/data/mockData";
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
import { Shield, UserCheck, User, Sparkles } from "lucide-react";

const roleConfig = [
  {
    role: "user" as const,
    label: "User",
    description: "Book appointments with trainers",
    icon: User,
    userId: "u1",
  },
  {
    role: "trainer" as const,
    label: "Trainer",
    description: "Manage your appointments",
    icon: UserCheck,
    userId: "t1",
  },
  {
    role: "admin" as const,
    label: "Admin",
    description: "Manage the platform",
    icon: Shield,
    userId: "admin1",
  },
];

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const [selectedRole,setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleLogin = (role: (typeof roleConfig)[number]) => {
    const user = mockUsers.find((u) => u.id === role.userId);

    if (user) {
      dispatch(login(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "trainer") {
        navigate("/trainer");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
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
        {/* Logo */}
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
            <CardTitle className="text-lg font-display">Welcome back</CardTitle>
            <CardDescription>Choose a role to explore the demo</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {roleConfig.map((role, index) => {
                return (
                  <motion.button
                    key={role.role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => handleRoleLogin(role)}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 
                    hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center 
                    group-hover:bg-primary/20 transition-colors duration-300"
                    >
                      <role.icon className="w-5 h-5 text-primary" />
                    </div>

                    <span className="text-xs font-medium text-foreground">
                      {role.label}
                    </span>

                    <span className="text-[10px] text-muted-foreground text-center leading-tight">
                      {role.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Email form (decorative for now) */}
            <div className="space-y-3">
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
                  placeholder="you@fitpath.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs text-muted-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 bg-muted/50 border-border/50"
                />
              </div>
              <Button
                className="w-full gradient-primary text-primary-foreground h-10"
                disabled
              >
                Sign In
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                Use the role buttons above to explore the demo
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
