import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-5">
          <SidebarTrigger />
          {children}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
