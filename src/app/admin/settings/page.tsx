import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AdminSettingsPage() {
  const supabase = createClient();


  return (
    <div className="max-w-4xl mx-auto flex flex-col relative min-h-[80vh]">
      <h1 className="text-3xl font-extrabold mb-8 z-10 capitalize">Platform Settings</h1>
      
      <div className="space-y-8 z-10">
        <div className="glass p-8 rounded-3xl border-zinc-800">
          <h2 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-2">Global Draw Configuration</h2>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-2">
                <div>
                  <div className="font-bold">Prize Pool Percentage</div>
                  <div className="text-sm text-zinc-500">The total amount of revenue allocated to the monthly prize pool.</div>
                </div>
                <div className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg font-mono">40%</div>
             </div>
             <div className="flex justify-between items-center py-2 border-t border-zinc-800/50">
                <div>
                  <div className="font-bold">Minimum Charity Contribution</div>
                  <div className="text-sm text-zinc-500">The floor percentage that users must donate.</div>
                </div>
                <div className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg font-mono">10%</div>
             </div>
             <Button className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white">Save Configuration</Button>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-red-500/20">
          <h2 className="text-xl font-bold text-red-500 mb-4 border-b border-red-500/20 pb-2">Platform Controls</h2>
          <div className="space-y-4 flex flex-col items-start">
             <p className="text-zinc-400 text-sm">Pause all user signups and score submissions during maintenance.</p>
             <Button variant="destructive">Enable Maintenance Mode</Button>
          </div>
        </div>
      </div>
    </div>
  );
}