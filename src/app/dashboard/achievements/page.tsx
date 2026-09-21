import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Award, CheckCircle2, Lock, Sparkles, Shield, Flame, Heart, Trophy } from "lucide-react";

export default async function AchievementsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/achievements");
  }

  const supabase = createClient();

  // Calculate achievements based on real database state concurrently
  const [scoresRes, charityRes, winningsRes] = await Promise.all([
    supabase.from('scores').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('user_charities').select('percentage').eq('user_id', user.id).maybeSingle(),
    supabase.from('winners').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  const totalScores = scoresRes.count || 0;
  const charityInfo = charityRes.data;
  const hasCharity = Boolean(charityInfo);
  const hasWon = (winningsRes.count || 0) > 0;

  const achievements = [
    {
      id: "first_step",
      title: "First Step",
      description: "Submitted your first Stableford golf performance score.",
      icon: Flame,
      unlocked: totalScores >= 1,
      badge: "Core Active",
      category: "Performance"
    },
    {
      id: "five_strong",
      title: "Five Strong",
      description: "Maintained a complete 5-score dynamic Performance Core.",
      icon: Shield,
      unlocked: totalScores >= 5,
      badge: "Full Entry",
      category: "Performance"
    },
    {
      id: "impact_started",
      title: "Impact Started",
      description: "Selected your impact partner and locked in monthly giving.",
      icon: Heart,
      unlocked: hasCharity,
      badge: "Giving Active",
      category: "Impact"
    },
    {
      id: "first_draw",
      title: "First Draw",
      description: "Entered an active monthly draw with your retained score set.",
      icon: Sparkles,
      unlocked: totalScores >= 5,
      badge: "Entered",
      category: "Rewards"
    },
    {
      id: "impact_builder",
      title: "Impact Builder",
      description: "Elevated your contribution rate above the 10% platform floor.",
      icon: Award,
      unlocked: (charityInfo?.percentage || 15) > 10,
      badge: "Philanthropist",
      category: "Impact"
    },
    {
      id: "draw_hero",
      title: "Draw Hero",
      description: "Matched 3, 4, or 5 numbers and won a verified draw prize tier.",
      icon: Trophy,
      unlocked: hasWon,
      badge: "Winner",
      category: "Rewards"
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Hero Achievements
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Achievements & Badges</h1>
          <p className="text-zinc-400 text-sm mt-1">Motivational milestones tracking your performance, charity impact, and draw participation.</p>
        </div>
        <div className="px-5 py-2.5 rounded-xl glass border-zinc-800 text-sm font-semibold text-white">
          <span className="text-emerald-400 font-extrabold">{unlockedCount}</span> of {achievements.length} Unlocked
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass p-6 rounded-2xl border-zinc-800">
        <div className="flex justify-between text-xs font-bold uppercase text-zinc-400 mb-2">
          <span>Overall Progression</span>
          <span>{Math.round((unlockedCount / achievements.length) * 100)}%</span>
        </div>
        <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                item.unlocked
                  ? 'glass border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-zinc-950/40 border-zinc-850 opacity-60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    item.unlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    item.unlocked
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">{item.category}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs font-semibold">
                {item.unlocked ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Unlocked
                  </span>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
