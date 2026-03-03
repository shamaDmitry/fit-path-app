import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Search,
  Dumbbell,
  LogOut,
  UserPlus,
  BarChart3,
  ClipboardList,
  Clock,
  UserCircle,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { NavLink } from "@/components/NavLink";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";

const userNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Find Trainers", url: "/trainers", icon: Search },
  { title: "My Bookings", url: "/bookings", icon: Calendar },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const trainerNav = [
  { title: "Dashboard", url: "/trainer", icon: LayoutDashboard },
  { title: "Appointments", url: "/trainer/appointments", icon: ClipboardList },
  { title: "Timeslots", url: "/trainer/timeslots", icon: Clock },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Trainers", url: "/admin/trainers", icon: Users },
  { title: "Appointments", url: "/admin/appointments", icon: Calendar },
  { title: "Add Trainer", url: "/admin/add-trainer", icon: UserPlus },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

function AppSidebarContent() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems =
    user?.role === "admin"
      ? adminNav
      : user?.role === "trainer"
        ? trainerNav
        : userNav;

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "?";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="flex flex-col justify-between">
        <div>
          <div className="p-4 flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>

            {!collapsed && (
              <span className="font-display font-bold text-sidebar-foreground text-lg">
                FitPath
              </span>
            )}
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">
              {user?.role === "admin"
                ? "Administration"
                : user?.role === "trainer"
                  ? "Trainer Panel"
                  : "Navigation"}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={
                          item.url === "/dashboard" ||
                          item.url === "/trainer" ||
                          item.url === "/admin"
                        }
                        className="hover:bg-sidebar-accent/50 transition-colors duration-200"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center justify-center gap-2">
            <Avatar
              className="h-8 w-8 flex-shrink-0 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.full_name}
                </p>

                <p className="text-[10px] text-sidebar-foreground/50 capitalize">
                  {user?.role}
                </p>
              </div>
            )}

            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <ConfirmDialog
          open={showLogoutConfirm}
          onOpenChange={setShowLogoutConfirm}
          title="Log out?"
          description="Are you sure you want to log out of your account?"
          confirmLabel="Log out"
          variant="destructive"
          onConfirm={handleLogout}
        />
      </SidebarContent>
    </Sidebar>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebarContent />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/50 px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
          </header>
          <main className="flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
