import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, Banknote, HeartPulse, Trophy, Database, ArrowRight } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  // Fetch real counts concurrently in parallel
  const [usersRes, subsRes, charitiesRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('charities').select('*', { count: 'exact', head: true }),
  ]);

  const usersCount = usersRes.count;
  const subsCount = subsRes.count;
  const charitiesCount = charitiesRes.count;

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh]">
      <h1 className="text-3xl font-extrabold mb-8 z-10">System Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 z-10">
        <div className="glass p-6 rounded-2xl flex flex-col border-indigo-500/30">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-500 tracking-wider">TOTAL USERS</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-4xl font-extrabold text-white">{usersCount || 0}</span>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col border-emerald-500/30">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-500 tracking-wider">ACTIVE SUBS</span>
            <Banknote className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-4xl font-extrabold text-white">{subsCount || 0}</span>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col border-rose-500/30">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-500 tracking-wider">CHARITIES</span>
            <HeartPulse className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-4xl font-extrabold text-white">{charitiesCount || 0}</span>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col border-amber-500/30">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-500 tracking-wider">PRIZE POOL</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-4xl font-extrabold text-white">$0.00</span>
          <span className="text-xs text-zinc-500 mt-2">Next Draw Est.</span>
        </div>
      </div>

      <div className="z-10 glass p-8 rounded-3xl max-w-2xl bg-[#080A0A]/80 backdrop-blur-xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/draws"
            prefetch={true}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-indigo-950/40"
          >
            <Database className="w-4 h-4" />
            Simulate Next Draw
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/charities"
            prefetch={true}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-emerald-950/40"
          >
            <HeartPulse className="w-4 h-4" />
            Manage Charities
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
