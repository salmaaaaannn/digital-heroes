import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function SettingsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/settings");
  }

  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="p-8 md:p-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8">Settings</h1>
      
      <div className="space-y-8">
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-2">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-1">Full Name</label>
              <div className="text-white">{profile?.full_name || 'Not set'}</div>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-1">Email</label>
              <div className="text-white">{user.email}</div>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-2">Subscription</h2>
          <div className="space-y-4">
             <p className="text-zinc-400 text-sm">Manage your billing and subscription through our secure payment portal.</p>
             <Button variant="outline" className="glass">Manage Billing</Button>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl border-red-500/20">
          <h2 className="text-xl font-bold text-red-500 mb-4 border-b border-red-500/20 pb-2">Session & Account</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-white font-medium text-sm">Sign out of session</p>
                 <p className="text-zinc-500 text-xs">End your current session on this device.</p>
               </div>
               <LogoutButton className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white" />
             </div>
             <div className="pt-4 border-t border-zinc-800/60">
               <p className="text-zinc-400 text-sm mb-2">Permanently delete your account and wipe all data.</p>
               <Button variant="destructive">Delete Account</Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
