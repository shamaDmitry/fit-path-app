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
import {
  LayoutDashboard,
  Users,
  Calendar,
  Search,
  Dumbbell,
  UserPlus,
  BarChart3,
  ClipboardList,
  Clock,
  UserCircle,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { NavLink } from "@/components/NavLink";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import FooterMenuDesktop from "@/components/user/FooterMenuDesktop";
import FooterMenuMob from "../user/FooterMenuMob";

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
  const { state, setOpenMobile, isMobile } = useSidebar();

  const isMobileView = useIsMobile();

  const collapsed = state === "collapsed";

  const user = useAppSelector((s) => s.auth.user);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;

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

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile, pathname]);

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="flex flex-col justify-between">
        <div className="">
          <NavLink
            to="/"
            className={cn("p-4 flex items-center gap-2", {
              "justify-center": collapsed,
            })}
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>

            {!collapsed && (
              <span className="font-display font-bold text-sidebar-foreground text-lg">
                FitPath
              </span>
            )}
          </NavLink>

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
                {navItems.map((item) => {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={
                            item.url === "/dashboard" ||
                            item.url === "/trainer" ||
                            item.url === "/admin"
                          }
                          className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                          activeClassName="bg-primary text-primary-foreground font-medium"
                        >
                          <item.icon className="mr-2 h-4 w-4 shrink-0" />

                          {!collapsed && <span>{item.title}</span>}

                          {isMobileView && collapsed && (
                            <span>{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {user && (
          <div className="p-3 border-t border-sidebar-border">
            {!collapsed ? (
              <FooterMenuDesktop
                collapsed={collapsed}
                setShowLogoutConfirm={setShowLogoutConfirm}
                user={user}
              />
            ) : (
              <div className="flex items-center justify-center">
                <FooterMenuMob setShowLogoutConfirm={setShowLogoutConfirm} />
              </div>
            )}
          </div>
        )}

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
            <SidebarTrigger className="size-10 hover:bg-primary" />
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
