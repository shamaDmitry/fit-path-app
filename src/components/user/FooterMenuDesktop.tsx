import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { User } from "@/types";
import { NavLink, useNavigate } from "react-router";

interface FooterMenuDesktop {
  user: User;
  collapsed: boolean;
  setShowLogoutConfirm: (value: boolean) => void;
}

const FooterMenuDesktop = ({
  user,
  collapsed,
  setShowLogoutConfirm,
}: FooterMenuDesktop) => {
  const navigate = useNavigate();

  const initials = getUserInitials(user?.full_name || "?");

  return (
    <div className="flex items-center justify-center gap-2">
      <Avatar
        className="h-8 w-8 shrink-0 cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <AvatarImage src={user?.avatar_url} alt={user?.full_name || "User"} />

        <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      {!collapsed && (
        <div className="flex-1 min-w-0">
          <NavLink
            to="/profile"
            className="text-xs font-medium text-sidebar-foreground truncate hover:text-accent-foreground"
          >
            {user?.full_name}
          </NavLink>

          <p className="text-xs text-sidebar-foreground/50">{user?.email}</p>

          <p className="text-xs text-sidebar-foreground/50 capitalize">
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
  );
};

export default FooterMenuDesktop;
