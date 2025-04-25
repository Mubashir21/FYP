"use client";

import {
  Projector,
  Home,
  Megaphone,
  Users,
  Settings,
  Radar,
  CircleUserRound,
  Binoculars,
  TreePine,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "@/lib/actions";
import { AdminSidebarProps } from "@/lib/definitions";
import { NavUser } from "./admin/user-nav";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Detection",
    url: "/admin/detections",
    icon: Radar,
  },
  {
    title: "Devices",
    url: "/admin/devices",
    icon: Projector,
  },
  {
    title: "Stakeholders",
    url: "/admin/stakeholders",
    icon: Users,
  },
  {
    title: "Alerts",
    url: "/admin/alerts",
    icon: Megaphone,
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <Link href="#" className="">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {/* {user?.user_metadata?.role === "admin" ? (
                <CircleUserRound className="size-8" />
              ) : (
                <Binoculars className="size-8" />
              )} */}
              <TreePine className="size-6" />
            </div>
            <div className="grid flex-1 text-left text-base leading-tight">
              {/* <span className="truncate font-semibold capitalize">
                {user?.user_metadata.first_name} {user?.user_metadata.last_name}
              </span>
              <span className="truncate text-sm capitalize">
                {user?.user_metadata?.role}
              </span> */}
              <span className="truncate font-bold text-lg capitalize">
                WildTechAlert
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
