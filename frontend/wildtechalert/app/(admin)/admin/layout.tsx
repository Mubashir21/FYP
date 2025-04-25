"use server";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin/header";
import { SidebarProvider } from "@/components/ui/sidebar";
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
      <div className="flex w-full bg-stone-100 dark:bg-stone-900">
        <AdminSidebar user={user} />

        <main className="flex-1 bg-white rounded-3xl my-3 mr-3 shadow-xl dark:bg-stone-800">
          <AdminHeader />
          <div className="p-4 lg:p-8"> {children}</div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
