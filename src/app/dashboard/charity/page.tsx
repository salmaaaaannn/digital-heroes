import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default async function CharityDashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/charity");
  }

  const supabase = createClient();
  const { data: charityInfo } = await supabase
    .from('user_charities')
    .select('percentage, charities(id, name, category, description)')
    .eq('user_id', user.id)
    .maybeSingle();

  const selectedCharity = (charityInfo?.charities as any) || null;
  const percentage = charityInfo?.percentage || 10;

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-white">Your Impact</h1>
      
      {selectedCharity ? (
        <div className="glass p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 border-zinc-800">
          <div className="w-32 h-32 bg-zinc-900 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
            <HeartPulse className="w-12 h-12 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1 block">
              {selectedCharity.category}
            </span>
            <h2 className="text-2xl font-bold mb-2 text-white">{selectedCharity.name}</h2>
            <p className="text-zinc-400 mb-6 text-sm leading-relaxed">{selectedCharity.description}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 text-sm">
              {percentage}% of Subscription Allocated
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-12 rounded-3xl border border-dashed border-zinc-800 text-center max-w-lg mx-auto mb-12">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <HeartPulse className="w-8 h-8 text-zinc-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Charity Selected Yet</h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Choose an official cause partner to allocate at least 10% of your monthly subscription directly to verified global projects.
          </p>
          <Link
            href="/charities"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
          >
            Explore Causes & Select Charity
          </Link>
        </div>
      )}
      
      {/* Real Impact Summary Card */}
      <div className="w-full glass p-6 rounded-2xl flex items-center justify-between border-zinc-800 text-sm text-zinc-400">
        <span>Verified on-chain contribution ledger</span>
        <span className="text-emerald-400 font-medium">Digital Heroes Impact Engine</span>
      </div>
    </div>
  );
}
