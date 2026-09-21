import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminAnalyticsPage() {
  const supabase = createClient();

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh]">
      <h1 className="text-3xl font-extrabold mb-8 z-10 capitalize">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
        <div className="glass p-8 rounded-3xl border-zinc-800">
          <h2 className="text-lg font-bold mb-4">Subscriber Growth</h2>
          <div className="w-full h-64 flex items-center justify-center border border-zinc-800/50 rounded-xl bg-zinc-900/30 text-zinc-500 text-sm">
            Recharts Visualization Pending Data
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-zinc-800">
          <h2 className="text-lg font-bold mb-4">Charity Impact Allocation</h2>
          <div className="w-full h-64 flex items-center justify-center border border-zinc-800/50 rounded-xl bg-zinc-900/30 text-zinc-500 text-sm">
            Recharts Visualization Pending Data
          </div>
        </div>
      </div>
    </div>
  );
}