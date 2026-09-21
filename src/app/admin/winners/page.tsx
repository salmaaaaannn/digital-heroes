import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminWinnersPage() {
  const supabase = createClient();

  const { data: winners } = await supabase
    .from('winners')
    .select('id, match_count, prize_amount, status, created_at, draws(draw_date), profiles(full_name, email)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh]">
      <div className="flex justify-between items-center mb-8 z-10">
        <h1 className="text-3xl font-extrabold capitalize">Winners & Payouts</h1>
      </div>
      
      <div className="glass rounded-3xl z-10 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 py-4">Winner</TableHead>
              <TableHead className="text-zinc-400 py-4">Draw Date</TableHead>
              <TableHead className="text-zinc-400 py-4">Match Tier</TableHead>
              <TableHead className="text-zinc-400 py-4">Prize</TableHead>
              <TableHead className="text-zinc-400 py-4">Status</TableHead>
              <TableHead className="text-right text-zinc-400 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winners?.map((win: any) => (
              <TableRow key={win.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">
                  <div>{win.profiles?.full_name}</div>
                  <div className="text-xs text-zinc-500">{win.profiles?.email}</div>
                </TableCell>
                <TableCell className="text-zinc-400">
                  {new Date(win.draws?.draw_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-indigo-400">{win.match_count} Matches</span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-emerald-400">${win.prize_amount}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    win.status === 'paid' ? 'text-emerald-500 border-emerald-500/30' :
                    win.status === 'approved' ? 'text-indigo-400 border-indigo-500/30' :
                    'text-zinc-400 border-zinc-600'
                  }>
                    {win.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2 whitespace-nowrap">
                  {win.status === 'pending' && <Button variant="outline" size="sm" className="glass hover:bg-zinc-800">Review</Button>}
                  {win.status === 'approved' && <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">Mark Paid</Button>}
                </TableCell>
              </TableRow>
            ))}
            {(!winners || winners.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  No winners have been selected yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}