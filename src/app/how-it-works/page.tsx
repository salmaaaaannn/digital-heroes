import { CreditCard, Activity, HeartHandshake, ShieldCheck, Cpu, Trophy, Landmark, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Activate Subscription",
      subtitle: "Membership",
      icon: CreditCard,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
      description: "Join the platform with a simple $29/mo or $290/yr plan. This activates your player profile, enables performance tracking, and enters you into the monthly prize ecosystem.",
    },
    {
      num: "02",
      title: "Log Your Latest 5 Scores",
      subtitle: "Performance Core",
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      description: "Submit your official Stableford scores (1–45). The platform maintains a strict rolling window of your 5 most recent scores—when a 6th is submitted, the oldest is automatically archived.",
    },
    {
      num: "03",
      title: "Select Your Impact Partner",
      subtitle: "Charity Choice",
      icon: HeartHandshake,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      description: "Direct a minimum 10% (or voluntarily increase up to 100%) of your recurring subscription to a vetted charity of your choice covering environmental conservation, youth education, or medical relief.",
    },
    {
      num: "04",
      title: "Automatic Monthly Draw Entry",
      subtitle: "The Draw",
      icon: ShieldCheck,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
      description: "Your 5 active score numbers automatically become your draw ticket for the monthly event. No extra purchases, ticket hoarding, or gambling mechanics—your real performance is your ticket.",
    },
    {
      num: "05",
      title: "Algorithmic Prize Calculation",
      subtitle: "Fair Distribution",
      icon: Cpu,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
      description: "On the final day of the month, 5 winning numbers (1–45) are generated. The prize pool is mathematically allocated: 40% to 5-matches, 35% to 4-matches, and 25% to 3-matches. Unclaimed 5-match pools roll over.",
    },
    {
      num: "06",
      title: "Winner Verification & Proof",
      subtitle: "Integrity",
      icon: Trophy,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      description: "Matching heroes upload a screenshot or photo of their club scorecard or digital handicap app. Admins audit the scorecard proof before authorizing instant Stripe cash payouts.",
    },
    {
      num: "07",
      title: "Charity Distribution",
      subtitle: "Impact Realized",
      icon: Landmark,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      description: "Charity shares are aggregated and paid directly to verified partner bank accounts. Verified donation receipts and impact updates are stamped permanently into each subscriber's Impact Passport.",
    },
  ];

  return (
    <main className="min-h-screen text-white overflow-x-hidden selection:bg-emerald-500/30">

      {/* Hero Header */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          The Complete Architecture
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
          How Digital Heroes Works
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          From your first Stableford round to monthly prize draws and transparent charity payouts—here is the complete 7-stage impact lifecycle.
        </p>
      </section>

      {/* 7-Step Interactive Visual Lifecycle */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-28">
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-emerald-500 before:to-zinc-800">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 ${
                  idx % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Center Node Badge */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#080A0A] border-2 border-emerald-500 flex items-center justify-center z-10 shadow-lg shadow-emerald-500/20">
                  <span className="text-xs font-black text-white">{step.num}</span>
                </div>

                {/* Card */}
                <div className="ml-16 md:ml-0 md:w-1/2 glass p-8 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${step.bg}`}>
                      <Icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div>
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${step.color}`}>
                        {step.subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-white leading-snug">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed mt-3">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Call to Action */}
        <div className="mt-20 glass p-10 md:p-14 rounded-3xl border border-emerald-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-emerald-900/20 to-transparent pointer-events-none" />
          <h2 className="text-3xl font-extrabold text-white mb-4 relative z-10">
            Ready to Play for More than the Game?
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8 text-sm leading-relaxed relative z-10">
            Create your player profile today. Your latest five scores will form your dynamic Performance Core and enter the upcoming monthly draw.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 font-bold" asChild>
              <Link href="/signup" className="flex items-center gap-2">
                Become a Digital Hero
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-zinc-700 hover:bg-zinc-800 text-white" asChild>
              <Link href="/charities">Explore Impact Partners</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
