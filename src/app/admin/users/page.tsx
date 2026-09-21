import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const supabase = createClient();

  // Only admins can get here (handled by layout)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, subscriptions(status), user_charities(charities(name))');

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh]">
      <h1 className="text-3xl font-extrabold mb-8 z-10 capitalize">User Management</h1>
      
      <div className="glass rounded-3xl z-10 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 py-4">Name</TableHead>
              <TableHead className="text-zinc-400 py-4">Role</TableHead>
              <TableHead className="text-zinc-400 py-4">Subscription</TableHead>
              <TableHead className="text-zinc-400 py-4">Charity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile: any) => (
              <TableRow key={profile.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                <TableCell className="font-medium text-white">{profile.full_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs uppercase">{profile.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={profile.subscriptions?.[0]?.status === 'active' ? 'default' : 'secondary'} className={profile.subscriptions?.[0]?.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {profile.subscriptions?.[0]?.status || 'none'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400 truncate max-w-[200px]" title={profile.user_charities?.[0]?.charities?.name}>
                  {profile.user_charities?.[0]?.charities?.name || 'Not set'}
                </TableCell>
              </TableRow>
            ))}
            {(!profiles || profiles.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}