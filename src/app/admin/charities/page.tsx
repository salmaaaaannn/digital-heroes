import { createClient } from "@/lib/supabase/server";
import { CharitiesClientView } from "./CharitiesClientView";

export const dynamic = "force-dynamic";

export default async function AdminCharitiesPage() {
  const supabase = createClient();

  // Query all charities for administrators (both active and archived)
  // Uses select('*') so it safely operates regardless of schema variations
  const { data: dbCharities, error } = await supabase
    .from('charities')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("AdminCharitiesPage fetch error:", error);
  }

  // Normalize active field from either 'active' or 'is_active'
  const charities = (dbCharities || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    category: c.category || "General",
    description: c.description || null,
    website_url: c.website_url || null,
    active: c.active !== undefined ? Boolean(c.active) : Boolean(c.is_active),
    is_featured: Boolean(c.is_featured || c.featured),
  }));

  return <CharitiesClientView initialCharities={charities} />;
}
