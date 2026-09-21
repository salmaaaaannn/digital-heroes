import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CharityDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: charity } = await supabase.from('charities').select('*').eq('id', params.id).maybeSingle();
  
  if (!charity) {
    notFound();
  }

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 block">
          {charity.category}
        </span>
        <h1 className="text-5xl font-extrabold mb-8">{charity.name}</h1>
        
        <div className="glass p-12 rounded-3xl mb-12 text-lg text-zinc-300 leading-relaxed border-zinc-800">
          {charity.description}
        </div>

        <div className="flex gap-4">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">
            <Link href="/signup">Support This Cause</Link>
          </Button>
          {charity.website_url && (
            <Button size="lg" variant="outline" className="glass hover:bg-zinc-800 rounded-xl">
              <a href={charity.website_url} target="_blank" rel="noreferrer">Visit Website</a>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
