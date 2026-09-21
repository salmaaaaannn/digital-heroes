import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicCharitiesPage() {
  const supabase = createClient();
  
  // Public listing: only display active charities
  const { data: dbCharities } = await supabase
    .from('charities')
    .select('*')
    .order('name', { ascending: true });

  // Filter out any archived charity safely (supports both active and is_active schema)
  const charities = (dbCharities || []).filter((c: any) => {
    if (c.active !== undefined && c.active !== null) return Boolean(c.active);
    if (c.is_active !== undefined && c.is_active !== null) return Boolean(c.is_active);
    return true;
  });

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Verified Philanthropic Partners
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Our Impact Partners</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Choose where your impact goes. At least 10% of every Digital Heroes subscription directly funds these verified organizations.
          </p>
        </div>

        {charities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity: any) => (
              <Link key={charity.id} href={`/charities/${charity.id}`} className="group">
                <Card className="glass p-8 h-full flex flex-col justify-between border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 group-hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        {charity.category}
                      </span>
                      {charity.website_url && (
                        <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-300 transition-colors">
                      {charity.name}
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6">
                      {charity.description || "Dedicated to driving measurable, positive community change."}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                    <span>View Mission Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl border border-zinc-800 max-w-md mx-auto">
            <p className="text-zinc-400 font-medium">No verified charities available currently.</p>
          </div>
        )}
      </div>
    </main>
  );
}
