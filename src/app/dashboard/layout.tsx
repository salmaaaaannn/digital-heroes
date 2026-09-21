import { ReactNode } from "react";
import { getAuthUser } from "@/lib/supabase/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getAuthUser();

  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden text-white">
      {/* Persistent Sidebar Navigation with Active Route State */}
      <DashboardSidebar userEmail={user?.email} />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
