import AppSidebar from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full flex-1">
        <div className="w-full">
          <SidebarTrigger />
          <div className="w-full">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
