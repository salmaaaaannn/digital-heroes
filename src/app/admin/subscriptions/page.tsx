import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminSubscriptionsPage() {
  const supabase = createClient();

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('id, status, current_period_start, current_period_end, stripe_subscription_id, profiles(full_name, email)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh]">
      <h1 className="text-3xl font-extrabold mb-8 z-10 capitalize">Subscriptions Management</h1>
      
      <div className="glass rounded-3xl z-10 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 py-4">User</TableHead>
              <TableHead className="text-zinc-400 py-4">Status</TableHead>
              <TableHead className="text-zinc-400 py-4">Period Start</TableHead>
              <TableHead className="text-zinc-400 py-4">Period End</TableHead>
              <TableHead className="text-zinc-400 py-4">Stripe ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions?.map((sub: any) => (
              <TableRow key={sub.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">
                  <div>{sub.profiles?.full_name}</div>
                  <div className="text-xs text-zinc-500">{sub.profiles?.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={sub.status === 'active' ? 'default' : 'secondary'} className={sub.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {sub.status || 'unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">
                  {sub.current_period_start ? new Date(sub.current_period_start).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">
                  {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-zinc-500 text-xs font-mono">
                  {sub.stripe_subscription_id}
                </TableCell>
              </TableRow>
            ))}
            {(!subscriptions || subscriptions.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                  No subscriptions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}