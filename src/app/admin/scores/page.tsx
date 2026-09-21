import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminScoresPage() {
  const supabase = createClient();

  const { data: scores } = await supabase
    .from('scores')
    .select('id, stableford_score, score_date, profiles(full_name)')
    .order('score_date', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh]">
      <div className="flex justify-between items-center mb-8 z-10">
        <h1 className="text-3xl font-extrabold capitalize">Global Score Feed</h1>
      </div>
      
      <div className="glass rounded-3xl z-10 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 py-4">Player</TableHead>
              <TableHead className="text-zinc-400 py-4">Score</TableHead>
              <TableHead className="text-zinc-400 py-4">Date Played</TableHead>
              <TableHead className="text-zinc-400 py-4">Status</TableHead>
              <TableHead className="text-right text-zinc-400 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores?.map((score: any) => (
              <TableRow key={score.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">{score.profiles?.full_name || 'Golfer'}</TableCell>
                <TableCell>
                  <span className="text-xl font-bold text-emerald-400">{score.stableford_score}</span>
                </TableCell>
                <TableCell className="text-zinc-400">
                  {new Date(score.score_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-indigo-500 hover:bg-indigo-600">
                    Active Core
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
            {(!scores || scores.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                  No scores recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}