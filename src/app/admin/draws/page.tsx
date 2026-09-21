import { createClient } from "@/lib/supabase/server";
import { DrawLabClient } from "./DrawLabClient";
import { Dna, ShieldCheck } from "lucide-react";

export default async function AdminDrawsPage() {
  const supabase = createClient();

  // Query live count of active subscribers
  const { count: subsCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const activeSubscribers = subsCount || 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col relative min-h-[80vh] space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Dna className="w-3.5 h-3.5" />
          Production Draw Lab
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Monthly Draw Management & Simulation Lab</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Simulate prize distributions, review multi-tier splits, audit jackpot rollovers, and publish official monthly draw results.
        </p>
      </div>

      <DrawLabClient activeSubscribers={activeSubscribers} />
    </div>
  );
}
