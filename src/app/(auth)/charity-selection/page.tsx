import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CharitySelectionForm from "./CharitySelectionForm";

export default async function CharitySelectionPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch active charities for selection
  const { data: dbCharities } = await supabase.from("charities").select("*").order("name", { ascending: true });
  const activeCharities = (dbCharities || []).filter((c: any) => {
    if (c.active !== undefined && c.active !== null) return Boolean(c.active);
    if (c.is_active !== undefined && c.is_active !== null) return Boolean(c.is_active);
    return true;
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-transparent px-4 py-12">
      <div className="z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            Select Your Cause
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Choose where your impact goes. A minimum of 10% of your subscription will be allocated to the charity of your choice.
          </p>
        </div>

        <CharitySelectionForm charities={activeCharities} userId={user.id} />
      </div>
    </div>
  );
}
