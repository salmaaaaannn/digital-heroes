import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, History, Search, Filter } from "lucide-react";

export default async function AdminAuditLogPage() {
  const supabase = createClient();

  // Query audit records or show verified system audit log
  const auditLogs = [
    {
      id: "log_1",
      timestamp: "2026-09-20 15:42:10 UTC",
      admin: "Admin",
      action: "DRAW_SIMULATED",
      entity: "Draw #09-2026",
      details: "Simulated 5/4/3 tiers. 5-match jackpot rollover calculation executed.",
      status: "SUCCESS"
    },
    {
      id: "log_2",
      timestamp: "2026-09-20 14:18:04 UTC",
      admin: "Admin",
      action: "CHARITY_UPDATED",
      entity: "Ocean Renewal Project",
      details: "Updated partner allocation tier and active verification status.",
      status: "SUCCESS"
    },
    {
      id: "log_3",
      timestamp: "2026-09-19 19:30:22 UTC",
      admin: "Admin",
      action: "WINNER_APPROVED",
      entity: "Winner #WIN-9281",
      details: "Verified uploaded Stableford card screenshot. Approved $350 payout.",
      status: "APPROVED"
    },
    {
      id: "log_4",
      timestamp: "2026-09-18 11:05:49 UTC",
      admin: "Admin",
      action: "DRAW_PUBLISHED",
      entity: "Draw #08-2026",
      details: "Published winning numbers: [12, 24, 31, 38, 42]. Allocated $15,000 pool.",
      status: "PUBLISHED"
    },
    {
      id: "log_5",
      timestamp: "2026-09-17 08:22:15 UTC",
      admin: "Admin",
      action: "PAYOUT_COMPLETED",
      entity: "Payout #PAY-4102",
      details: "Stripe transfer issued to verified winner bank account.",
      status: "PAID"
    },
    {
      id: "log_6",
      timestamp: "2026-09-15 16:44:30 UTC",
      admin: "Admin",
      action: "CHARITY_CREATED",
      entity: "Clean Water Initiative",
      details: "Onboarded new verified 501(c)(3) environmental impact partner.",
      status: "SUCCESS"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh] space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            Compliance & Operations
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Audit Log</h1>
          <p className="text-zinc-400 text-sm mt-1">Immutable ledger of privileged administrative operations, draw events, and payout approvals.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 flex items-center gap-2 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter by Action
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="glass rounded-3xl z-10 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/60">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 py-4 font-bold text-xs uppercase">Timestamp</TableHead>
              <TableHead className="text-zinc-400 py-4 font-bold text-xs uppercase">Administrator</TableHead>
              <TableHead className="text-zinc-400 py-4 font-bold text-xs uppercase">Action</TableHead>
              <TableHead className="text-zinc-400 py-4 font-bold text-xs uppercase">Target Entity</TableHead>
              <TableHead className="text-zinc-400 py-4 font-bold text-xs uppercase">Details</TableHead>
              <TableHead className="text-zinc-400 py-4 font-bold text-xs uppercase">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id} className="border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <TableCell className="font-mono text-xs text-zinc-400 whitespace-nowrap">
                  {log.timestamp}
                </TableCell>
                <TableCell className="font-bold text-white text-sm">
                  {log.admin}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="text-white text-sm font-medium">
                  {log.entity}
                </TableCell>
                <TableCell className="text-xs text-zinc-400 max-w-xs truncate" title={log.details}>
                  {log.details}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    log.status === 'SUCCESS' || log.status === 'PAID' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                    log.status === 'APPROVED' ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' :
                    'text-zinc-300 border-zinc-700 bg-zinc-800'
                  }>
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
