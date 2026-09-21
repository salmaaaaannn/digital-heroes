import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DrawNumbers } from "@/components/3d/DrawNumbers";

export default async function DrawsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/draws");
  }

  const supabase = createClient();
  // Fetch real draw from Supabase
  const [drawsRes, scoresRes] = await Promise.all([
    supabase.from('draws').select('id, draw_date, status, winning_numbers').order('draw_date', { ascending: false }).limit(1),
    supabase.from('scores').select('stableford_score').eq('user_id', user.id).order('score_date', { ascending: false }).limit(5),
  ]);

  const currentDraw = drawsRes.data?.[0] || null;
  const entryNumbers = scoresRes.data?.map(s => s.stableford_score) || [];

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold mb-4 text-white">Monthly Reward Engine</h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Your active subscription and rolling window of 5 Stableford scores constitute your official monthly draw entry.
        </p>
      </div>

      <div className="w-full h-64 md:h-80 relative mb-12 rounded-3xl overflow-hidden glass border-zinc-800 flex items-center justify-center p-8">
        {currentDraw ? (
          <div className="text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 block">
              Status: {currentDraw.status}
            </span>
            <h2 className="text-3xl font-extrabold mb-2 text-white">
              {currentDraw.status === 'published' ? 'OFFICIAL DRAW RESULTS' : 'UPCOMING DRAW'}
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Draw Date: {new Date(currentDraw.draw_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            {currentDraw.winning_numbers && currentDraw.winning_numbers.length > 0 && (
              <div className="flex gap-3 justify-center items-center">
                {currentDraw.winning_numbers.map((num: number, i: number) => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg font-bold text-emerald-400">
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2 text-zinc-300">No published draw yet.</h2>
            <p className="text-sm text-zinc-500">
              The next official monthly draw has not been scheduled yet. Check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Your Real Entry */}
      <div className="w-full max-w-3xl glass p-8 rounded-2xl border-zinc-800">
        <h3 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4 text-white">Your Active Entry Combination</h3>
        {entryNumbers.length > 0 ? (
          <>
            <div className="flex gap-4 items-center justify-center flex-wrap">
              {entryNumbers.map((num, i) => (
                <div key={i} className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl font-extrabold text-white shadow-inner">
                  {num}
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-xs text-zinc-500">
              Derived strictly from your {entryNumbers.length} most recent official Stableford rounds.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-400 font-medium mb-2">No active entry nodes found.</p>
            <p className="text-xs text-zinc-500 mb-4">
              Log your rounds in the Performance Core to construct your 5-node draw combination.
            </p>
            <Link
              href="/dashboard/scores"
              className="inline-flex px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Log Stableford Scores
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
