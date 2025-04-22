"use server";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/lib/data";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AdminSidebar user={user} />
        <main className="flex-1 p-5">
          <SidebarTrigger />
          {children}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
