import { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const supabase = createClient();
  // Verify Admin Role from Supabase database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white flex-col p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-zinc-400 mt-2 max-w-md">
          You do not have administrative privileges. This area is restricted to authorized platform administrators.
        </p>
        <Link href="/dashboard" className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden text-white">
      {/* Persistent Admin Sidebar with Active Route State */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {children}
      </main>
    </div>
  );
}
