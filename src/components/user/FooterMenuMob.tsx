import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/utils";
import { useAppSelector } from "@/store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOutIcon, UserCircle } from "lucide-react";

import { NavLink } from "@/components/NavLink";

interface FooterMenuMobProps {
  setShowLogoutConfirm: (value: boolean) => void;
}

function FooterMenuMob({ setShowLogoutConfirm }: FooterMenuMobProps) {
  const user = useAppSelector((s) => s.auth.user);

  const navigate = useNavigate();

  const initials = getUserInitials(user?.full_name || "?");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-transparent"
        >
          <Avatar
            className="h-8 w-8 shrink-0 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <NavLink to="/profile" className="justify-center cursor-pointer">
              <UserCircle className="hover:text-accent-foreground" />
              Profile
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Button
            variant={"destructive"}
            className="w-full cursor-pointer hover:bg-destructive/80!"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOutIcon className="text-destructive-foreground" />
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FooterMenuMob;
