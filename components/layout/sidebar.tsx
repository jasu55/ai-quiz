import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider className="h-screen border-r-2 border-[#E4E4E7] ">
        <AppSidebar />

        <SidebarTrigger className="h-6 w-6 ml-[26px] mt-[82px] fixed " />

        <main>{children}</main>
      </SidebarProvider>
    </div>
  );
}
