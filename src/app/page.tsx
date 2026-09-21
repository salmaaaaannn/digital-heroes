import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, HeartPulse, Sparkles, Check, Trophy, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  // Public hero preview: only active charities
  const { data: dbCharities } = await supabase
    .from('charities')
    .select('*')
    .order('name', { ascending: true })
    .limit(10);

  const featuredCharities = (dbCharities || [])
    .filter((c: any) => {
      if (c.active !== undefined && c.active !== null) return Boolean(c.active);
      if (c.is_active !== undefined && c.is_active !== null) return Boolean(c.is_active);
      return true;
    })
    .slice(0, 3);

  return (
    <main className="flex-1 flex flex-col items-center overflow-x-hidden selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 w-full max-w-5xl mx-auto pt-16 md:pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-8">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            A New Paradigm in Golf & Philanthropy
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
          Feel the impact. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-emerald-400">
            Play with purpose.
          </span>
        </h1>

        <p className="text-lg sm:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-normal leading-relaxed">
          The subscription platform combining Stableford performance tracking, monthly cash draws, and direct charity funding.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-emerald-950/60" asChild>
            <Link href="/signup" className="flex items-center gap-2">
              Become a Digital Hero
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base glass border-zinc-800 hover:bg-zinc-800 text-white" asChild>
            <Link href="/how-it-works">See How It Works</Link>
          </Button>
        </div>

        {/* Platform Architecture & Impact Metrics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl border-t border-zinc-800/80 pt-10">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">Min 10%</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Charity Floor</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Verified Payouts</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">5-Score</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Rolling Core Window</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">40/35/25%</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Draw Prize Split</div>
          </div>
        </div>
      </section>

      {/* 3 Pillars in Seconds */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Three Core Pillars</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">The Digital Heroes Loop</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PLAY */}
          <div className="glass p-8 md:p-10 rounded-3xl border border-zinc-800 flex flex-col items-start text-left relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400">
              <Activity className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Pillar 1</span>
            <h3 className="text-2xl font-bold mb-3">PLAY</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Track your authentic Stableford golf performance. The platform dynamically maintains your latest 5 rounds as your active Performance Core.
            </p>
            <span className="text-xs text-zinc-500 font-mono mt-auto">Score Range: 1–45 points</span>
          </div>

          {/* DRAW */}
          <div className="glass p-8 md:p-10 rounded-3xl border border-zinc-800 flex flex-col items-start text-left relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Pillar 2</span>
            <h3 className="text-2xl font-bold mb-3">DRAW</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Your 5 score numbers automatically become your monthly draw entry. Match 3, 4, or 5 numbers for cash prizes, with rollovers on unclaimed jackpots.
            </p>
            <span className="text-xs text-zinc-500 font-mono mt-auto">Monthly Draw on 30th</span>
          </div>

          {/* IMPACT */}
          <div className="glass p-8 md:p-10 rounded-3xl border border-zinc-800 flex flex-col items-start text-left relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6 text-rose-400">
              <HeartPulse className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Pillar 3</span>
            <h3 className="text-2xl font-bold mb-3">IMPACT</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              At least 10% of your subscription directly funds a verified cause of your choice. Track verified impact disbursements directly in your Impact Passport.
            </p>
            <span className="text-xs text-zinc-500 font-mono mt-auto">Min 10% Platform Floor</span>
          </div>
        </div>
      </section>

      {/* Featured Charities Preview */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 border-t border-zinc-800/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Giving Partners</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Verified Impact Causes</h2>
          </div>
          <Link href="/charities" className="mt-4 md:mt-0 text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            Browse All Charities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCharities.length === 0 ? (
            <div className="col-span-full text-center py-12 glass rounded-3xl border border-zinc-800">
              <p className="text-zinc-400 font-medium text-sm">No charities registered yet. Verified partners will appear here.</p>
            </div>
          ) : (
            featuredCharities.map((c: any, i: number) => (
              <div key={c.id || i} className="glass p-8 rounded-3xl border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 uppercase tracking-wider mb-4 inline-block">
                    {c.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{c.name}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{c.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800/80 text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> Fully Audited Partner
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="glass p-12 md:p-16 rounded-3xl border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black mb-4 relative z-10">
            Play for more than the game.
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8 text-base leading-relaxed relative z-10">
            Join a collective of players turning golf performance into real humanitarian impact and monthly rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-10 h-14 font-bold" asChild>
              <Link href="/signup">Become a Digital Hero</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 border-zinc-700 hover:bg-zinc-800 text-white" asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
