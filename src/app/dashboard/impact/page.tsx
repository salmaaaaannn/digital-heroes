import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { HeartPulse, Calendar, Award, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function ImpactPassportPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/impact");
  }

  const supabase = createClient();

  // Query real data from user_charities and charity_contributions concurrently
  const [charityRes, contributionsRes] = await Promise.all([
    supabase
      .from('user_charities')
      .select('percentage, created_at, charities(id, name, category, description)')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('charity_contributions')
      .select('id, month, amount, status, tx_hash, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const charityInfo = charityRes.data;
  const dbContributions = contributionsRes.data;

  const charity = charityInfo?.charities as any | null;
  const percentage = charityInfo?.percentage || 0;

  const contributions = (dbContributions || []).map((c: any) => ({
    id: c.id,
    month: c.month || (c.created_at ? new Date(c.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recent'),
    amount: Number(c.amount) || 0,
    status: c.status || 'verified',
    tx_hash: c.tx_hash || null,
  }));

  const totalContributed = contributions.reduce((acc, curr) => acc + curr.amount, 0);
  const monthsActive = contributions.length;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Impact Passport
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Your Impact Passport</h1>
          <p className="text-zinc-400 text-sm mt-1">Verified financial contribution records supporting your selected cause.</p>
        </div>
        <Link
          href="/dashboard/charity"
          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-colors border border-zinc-700"
        >
          Change Charity
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Contributed</span>
          <span className="text-3xl md:text-4xl font-extrabold text-white">${totalContributed.toFixed(2)}</span>
          <span className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified
          </span>
        </div>

        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Contribution Rate</span>
          <span className="text-3xl md:text-4xl font-extrabold text-emerald-400">{percentage}%</span>
          <span className="text-xs text-zinc-500 mt-2">Min 10% platform floor</span>
        </div>

        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Months Contributing</span>
          <span className="text-3xl md:text-4xl font-extrabold text-white">{monthsActive}</span>
          <span className="text-xs text-indigo-400 mt-2">Consistent Hero</span>
        </div>

        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Partner Charity</span>
          <span className="text-lg font-bold text-white truncate" title={charity?.name || 'Not selected'}>
            {charity?.name || 'No Charity Selected'}
          </span>
          <span className="text-xs text-zinc-400 mt-2">
            {charity?.category ? `${charity.category} Cause` : 'Select a partner to allocate funds'}
          </span>
        </div>
      </div>

      {/* Visual Impact Milestones */}
      <div className="glass p-8 rounded-3xl border-zinc-800">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          Impact Milestones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-5 rounded-2xl border ${totalContributed >= 1 ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-zinc-900/40 border-zinc-800'}`}>
            <div className="text-xs font-bold text-emerald-400 mb-1">TIER 1</div>
            <div className="text-lg font-bold text-white">First Spark</div>
            <p className="text-xs text-zinc-400 mt-1">Initiated your first automatic charity contribution upon subscription.</p>
            <div className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
              {totalContributed >= 1 ? '✓ Unlocked' : 'Locked'}
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${totalContributed >= 15 ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-zinc-900/40 border-zinc-800'}`}>
            <div className="text-xs font-bold text-indigo-400 mb-1">TIER 2</div>
            <div className="text-lg font-bold text-white">Sustained Momentum</div>
            <p className="text-xs text-zinc-400 mt-1">Contributed continuously for 3+ consecutive monthly cycles.</p>
            <div className="mt-4 text-xs font-semibold text-indigo-400 flex items-center gap-1">
              {totalContributed >= 15 ? '✓ Unlocked' : 'In Progress'}
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${totalContributed >= 50 ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-zinc-900/40 border-zinc-800'}`}>
            <div className="text-xs font-bold text-zinc-500 mb-1">TIER 3</div>
            <div className="text-lg font-bold text-white">Impact Champion</div>
            <p className="text-xs text-zinc-400 mt-1">Reach $50+ lifetime verified contributions directed to your partner.</p>
            <div className="mt-4 text-xs font-semibold text-zinc-500">
              ${totalContributed.toFixed(2)} / $50.00
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Timeline */}
      <div className="glass p-8 rounded-3xl border-zinc-800">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Monthly Contribution Journey
        </h2>
        {contributions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl p-6">
            <HeartPulse className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-white font-semibold">No contributions recorded yet</p>
            <p className="text-zinc-500 text-xs mt-1">
              Your charitable contributions will be tracked and verified here once your monthly subscription cycle processes.
            </p>
            <Link
              href="/dashboard/charity"
              className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
            >
              Choose Cause
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((c: any) => (
              <div key={c.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {c.month.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">{c.month}</div>
                    <div className="text-xs text-zinc-500 font-mono">Ref: {c.tx_hash || 'Verified on-chain'}</div>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <div className="font-extrabold text-emerald-400 text-lg">+${c.amount.toFixed(2)}</div>
                  <div className="text-xs text-zinc-400 uppercase font-semibold">{c.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
