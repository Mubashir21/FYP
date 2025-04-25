"use client";

import {
  Binoculars,
  CircleUserRound,
  LogOutIcon,
  MoreVerticalIcon,
  Settings,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AdminSidebarProps } from "@/lib/definitions";
import Link from "next/link";
import { signOut } from "@/lib/actions";
import { useState } from "react";

export function NavUser({ user }: AdminSidebarProps) {
  const { isMobile } = useSidebar();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-e-transparent" />
      </div>
    );
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user?.user_metadata?.role === "admin" ? (
                <CircleUserRound className="size-8" />
              ) : (
                <Binoculars className="size-8" />
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.user_metadata?.first_name}{" "}
                  {user?.user_metadata?.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground capitalize">
                  {user?.user_metadata?.role}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user?.user_metadata?.role === "admin" ? (
                  <CircleUserRound className="size-6" />
                ) : (
                  <Binoculars className="size-6" />
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.user_metadata?.first_name}{" "}
                    {user?.user_metadata?.last_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {user?.user_metadata?.role}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 w-full"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
