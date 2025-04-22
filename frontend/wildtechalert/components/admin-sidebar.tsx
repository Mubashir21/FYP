"use client";

import {
  Projector,
  Home,
  Megaphone,
  Users,
  Settings,
  Radar,
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
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div>
          <div>
            {user?.user_metadata.first_name} {user?.user_metadata.last_name}
          </div>
          <div>{user?.user_metadata?.role}</div>
        </div>
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
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-md text-sm font-medium hover:bg-accent"
        >
          Sign Out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
