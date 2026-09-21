import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { ScoreForm } from "./ScoreForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Activity } from "lucide-react";

export default async function ScoresPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/scores");
  }

  const supabase = createClient();

  const { data: dbScores } = await supabase
    .from('scores')
    .select('id, stableford_score, score_date, created_at')
    .eq('user_id', user.id)
    .order('score_date', { ascending: false })
    .limit(5);

  const scores = dbScores || [];

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-white">Performance Core Log</h1>
          <p className="text-sm text-zinc-400">
            Official Stableford entries power your monthly draw entry combinations and impact score.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Rolling Window: 5 Maximum</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Score Form */}
        <div className="md:col-span-1">
          <ScoreForm />
        </div>

        {/* Scores Table */}
        <div className="md:col-span-2 glass p-6 rounded-2xl border-zinc-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Rolling History</h2>
            </div>
            <span className="text-xs text-zinc-500">
              {scores.length}/5 rounds logged
            </span>
          </div>

          {scores.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-zinc-800/80">
              <Table>
                <TableHeader className="bg-zinc-900/60">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase">Round Date</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase text-center">Status</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase text-right">Stableford</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores.map((item, idx) => (
                    <TableRow key={item.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                      <TableCell className="font-medium text-zinc-200">
                        {new Date(item.score_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                          Node #{idx + 1}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-lg font-extrabold text-emerald-400">
                          {item.stableford_score}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl">
              <p className="text-white font-semibold mb-1">No scores yet</p>
              <p className="text-sm text-zinc-500">
                Add your first Stableford score to start your Performance Core.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
            <span>Retained node pool: {scores.length}/5</span>
            <span>Newest rounds evaluated first</span>
          </div>
        </div>
      </div>
    </div>
  );
}
