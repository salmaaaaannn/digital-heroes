import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Trophy, Gift, CheckCircle, ShieldAlert } from "lucide-react";
import { WinnerProofSection } from "./WinnerProofSection";

export default async function WinningsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/winnings");
  }

  const supabase = createClient();
  const { data: dbWinnings } = await supabase
    .from('winners')
    .select('id, match_count, prize_amount, status, draws(draw_date)')
    .eq('user_id', user.id);

  const initialWins = (dbWinnings || []).map((w: any) => ({
    id: w.id,
    drawDate: new Date(w.draws?.draw_date || Date.now()).toLocaleDateString(),
    matchTier: w.match_count || 0,
    amount: Number(w.prize_amount) || 0,
    verificationStatus: (w.status ? w.status.charAt(0).toUpperCase() + w.status.slice(1) : "Pending") as any,
  }));

  const totalWon = initialWins.reduce((acc, w) => acc + w.amount, 0);
  const pendingWon = initialWins
    .filter(w => w.verificationStatus === "Pending" || w.verificationStatus === "Processing")
    .reduce((acc, w) => acc + w.amount, 0);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          Prize & Reward Center
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Your Winnings</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Review your monthly prize draw matches, upload score verification proof, and track cash distributions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass p-6 md:p-8 rounded-3xl border-zinc-800 flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Lifetime Total Won</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl md:text-5xl font-extrabold text-white">${totalWon.toFixed(2)}</span>
            <span className="text-xs text-zinc-500">USD</span>
          </div>
          <p className="text-xs text-zinc-400 mt-4">Verified draw winnings across all eligible tiers.</p>
        </div>

        <div className="glass p-6 md:p-8 rounded-3xl border-emerald-500/30 flex flex-col justify-between">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Pending Verification / Payout</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl md:text-5xl font-extrabold text-emerald-400">${pendingWon.toFixed(2)}</span>
            <span className="text-xs text-emerald-500/60">Awaiting payout</span>
          </div>
          <p className="text-xs text-zinc-400 mt-4">Upload your scorecard proof below to expedite admin verification.</p>
        </div>
      </div>

      {/* Winnings List & Proof Upload Interactive Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Draw Winning Records & Verification</h2>
        <WinnerProofSection initialWins={initialWins} />
      </div>
    </div>
  );
}
