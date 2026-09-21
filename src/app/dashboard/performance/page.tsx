import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Activity, TrendingUp, Trophy, Calendar, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function PerformanceTimelinePage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/performance");
  }

  const supabase = createClient();

  const { data: dbScores } = await supabase
    .from('scores')
    .select('id, stableford_score, score_date')
    .eq('user_id', user.id)
    .order('score_date', { ascending: false })
    .limit(5);

  const scores = (dbScores && dbScores.length > 0) ? dbScores.map(s => ({
    id: s.id,
    score: s.stableford_score,
    played_at: s.score_date,
    is_active: true
  })) : [];

  const scoreNums = scores.map(s => s.score);
  const bestScore = scoreNums.length > 0 ? Math.max(...scoreNums) : 0;
  const avgScore = scoreNums.length > 0 ? (scoreNums.reduce((a, b) => a + b, 0) / scoreNums.length).toFixed(1) : "0.0";
  const scoreCount = scoreNums.length;
  
  // Chronological order (oldest to newest for timeline/trend)
  const chronological = [...scores].reverse();
  const firstScore = chronological[0]?.score || 0;
  const latestScore = chronological[chronological.length - 1]?.score || 0;
  const trendDiff = latestScore - firstScore;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            Performance Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Performance Timeline</h1>
          <p className="text-zinc-400 text-sm mt-1">Transparent Stableford score analytics derived strictly from your retained 5-score set.</p>
        </div>
        <Link
          href="/dashboard/scores"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white transition-colors flex items-center gap-2"
        >
          Manage Scores
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Transparent Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Average Score</span>
          <span className="text-4xl font-extrabold text-white">{avgScore}</span>
          <span className="text-xs text-zinc-400 mt-2">Stableford pts (Last {scoreCount})</span>
        </div>

        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Best Retained Score</span>
          <span className="text-4xl font-extrabold text-emerald-400">{bestScore}</span>
          <span className="text-xs text-zinc-400 mt-2">Personal high node</span>
        </div>

        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Active Rolling Nodes</span>
          <span className="text-4xl font-extrabold text-indigo-400">{scoreCount} <span className="text-lg text-zinc-500 font-normal">/ 5</span></span>
          <span className="text-xs text-zinc-400 mt-2">Next submission rolls oldest</span>
        </div>

        <div className="glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Net Trajectory</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold ${trendDiff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {trendDiff >= 0 ? `+${trendDiff}` : trendDiff}
            </span>
            <span className="text-xs text-zinc-500">pts</span>
          </div>
          <span className="text-xs text-zinc-400 mt-2">Oldest vs Latest node</span>
        </div>
      </div>

      {/* Interactive Visual Bar Timeline */}
      {scores.length > 0 ? (
        <>
          <div className="glass p-8 rounded-3xl border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-2">Chronological Score Evolution</h2>
            <p className="text-xs text-zinc-400 mb-8">Evolution of your dynamic nodes from earliest to most recent round.</p>

            <div className="grid grid-cols-5 gap-3 md:gap-6 items-end h-64 border-b border-zinc-800 pb-4">
              {chronological.map((item, idx) => {
                const heightPercent = Math.round((item.score / 45) * 100);
                return (
                  <div key={item.id} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-white mb-2 opacity-80 group-hover:opacity-100 group-hover:text-emerald-400 transition-colors">
                      {item.score} pts
                    </span>
                    <div
                      className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-zinc-800 to-indigo-600 group-hover:from-emerald-900 group-hover:to-emerald-400 transition-all duration-300 relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/60" />
                    </div>
                    <span className="text-[10px] md:text-xs text-zinc-500 mt-3 text-center">
                      Round {idx + 1}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-zinc-600">
                      {new Date(item.played_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retained Set Breakdown */}
          <div className="glass p-8 rounded-3xl border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-6">Retained Performance Nodes</h2>
            <div className="space-y-3">
              {scores.map((s, idx) => (
                <div key={s.id} className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {new Date(s.played_at).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-zinc-500">Node ID: {s.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-emerald-400">{s.score} <span className="text-xs font-normal text-zinc-400">pts</span></span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      Active in Draw
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="glass p-12 rounded-3xl border border-dashed border-zinc-800 text-center">
          <p className="text-white font-semibold mb-2">No Performance Records Yet</p>
          <p className="text-sm text-zinc-500 mb-6">
            Log your first Stableford score to start generating your rolling 5-score timeline and performance trajectory.
          </p>
          <Link
            href="/dashboard/scores"
            className="inline-flex px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold"
          >
            Log Stableford Score
          </Link>
        </div>
      )}
    </div>
  );
}
