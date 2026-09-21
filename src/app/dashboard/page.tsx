import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const supabase = createClient();

  // Fetch dashboard data concurrently in parallel
  const [profileRes, scoresRes, charityRes, subRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    supabase.from('scores').select('stableford_score').eq('user_id', user.id).order('score_date', { ascending: false }).limit(5),
    supabase.from('user_charities').select('percentage, charities(name)').eq('user_id', user.id).maybeSingle(),
    supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle(),
  ]);

  const profile = profileRes.data;
  const scores = scoresRes.data || [];
  const charityInfo = charityRes.data;
  const subscription = subRes.data;
  
  const scoreValues = scores.map(s => s.stableford_score);
  const isSubscribed = subscription?.status === 'active';

  return (
    <div className="min-h-full p-8 md:p-12 pb-24 relative">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Dashboard Hero */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              WELCOME, {profile?.full_name?.toUpperCase() || user.user_metadata?.full_name?.toUpperCase() || 'HERO'}
            </h1>
            <p className="text-zinc-400">Your performance. Your chance. Your impact.</p>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Subscription */}
          <div className="glass p-6 rounded-2xl flex flex-col border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 tracking-wider mb-2">SUBSCRIPTION</span>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className={`text-lg font-bold ${isSubscribed ? 'text-white' : 'text-zinc-400'}`}>
                {isSubscribed ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-auto">
              {isSubscribed ? 'Renews automatically' : 'No active subscription'}
            </p>
          </div>

          {/* Scores */}
          <div className="glass p-6 rounded-2xl flex flex-col border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 tracking-wider mb-2">RECORDED SCORES</span>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-extrabold text-white">{scores?.length || 0}</span>
              <span className="text-sm text-zinc-400 mb-1">/ 5 nodes active</span>
            </div>
            <p className="text-sm text-zinc-400 mt-auto">Latest 5 define your draw entry.</p>
          </div>

          {/* Charity */}
          <div className="glass p-6 rounded-2xl flex flex-col border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 tracking-wider mb-2">IMPACT</span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-extrabold text-white">{charityInfo?.percentage || 10}%</span>
              <span className="text-sm text-emerald-400">contribution</span>
            </div>
            <p className="text-sm text-zinc-400 mt-auto truncate" title={(charityInfo?.charities as any)?.name}>
              {(charityInfo?.charities as any)?.name || 'No charity selected'}
            </p>
          </div>

          {/* Winnings / Payment Status */}
          <div className="glass p-6 rounded-2xl flex flex-col border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 tracking-wider mb-2">WINNINGS</span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-extrabold text-white">$0</span>
            </div>
            <p className="text-sm text-zinc-400 mt-auto">Payout status: N/A</p>
          </div>
        </div>

        {/* 3D Core Visualization Space */}
        <div className="h-[380px] w-full flex flex-col items-center justify-end">
          {scoreValues.length > 0 ? (
            <div className="bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-800 flex gap-6">
              <span className="text-xs font-bold text-zinc-400">PERFORMANCE CORE ONLINE</span>
              <div className="flex gap-4">
                {scoreValues.map((val, idx) => (
                  <span key={idx} className="text-xs font-bold text-emerald-400">#{idx+1}: {val}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass p-8 rounded-3xl border border-zinc-800 text-center max-w-md pointer-events-auto">
              <h3 className="text-lg font-bold text-white mb-2">No scores yet</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Add your first Stableford score to activate your dynamic 3D Performance Core and enter the monthly draw.
              </p>
              <Link
                href="/dashboard/scores"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors"
              >
                Add Your First Score
              </Link>
            </div>
          )}
        </div>

        {/* Your Digital Heroes Journey Timeline */}
        <div className="mt-16 glass p-8 rounded-3xl border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Your Digital Heroes Journey</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time status tracking your onboarding, scores, giving, and draw eligibility.</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Verified Progression
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <span>✓ STEP 1</span>
              </div>
              <div className="font-bold text-white text-sm">Account Created</div>
              <div className="text-xs text-zinc-400 mt-1">
                Profile registered as {profile?.full_name || user.email}.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <span>✓ STEP 2</span>
              </div>
              <div className="font-bold text-white text-sm">Subscription Active</div>
              <div className="text-xs text-zinc-400 mt-1">Direct impact subscription unlocked.</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <span>✓ STEP 3</span>
              </div>
              <div className="font-bold text-white text-sm">Charity Selected</div>
              <div className="text-xs text-zinc-400 mt-1">{(charityInfo?.charities as any)?.name || "Clean Oceans Foundation"} ({charityInfo?.percentage || 10}%).</div>
            </div>

            <div className={`p-4 rounded-2xl bg-zinc-900/60 border ${scoreValues.length >= 5 ? 'border-emerald-500/30' : 'border-zinc-800'}`}>
              <div className="flex items-center gap-2 text-xs font-bold mb-1">
                <span className={scoreValues.length >= 5 ? 'text-emerald-400' : 'text-zinc-500'}>
                  {scoreValues.length >= 5 ? '✓ STEP 4' : '○ STEP 4'}
                </span>
              </div>
              <div className="font-bold text-white text-sm">5-Score Core Formed</div>
              <div className="text-xs text-zinc-400 mt-1">
                {scoreValues.length >= 5 ? 'Ready for monthly draw entry.' : `${scoreValues.length} of 5 scores entered.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
