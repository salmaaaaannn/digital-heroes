import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createCheckoutSession } from "./actions";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default async function SubscriptionPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-transparent px-4 py-12">
      <div className="z-10 w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-900 bg-emerald-900/20 text-emerald-400 mb-6 font-medium text-sm">
            Step 3 of 3: Activate Your Account
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            Select Your Plan
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Get full access to the performance core, monthly draws, and start making an impact today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Monthly Impact</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-extrabold text-white">$29</span>
              <span className="text-zinc-400">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 text-zinc-300">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Full Performance Core access</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Entry into Monthly Prize Draws</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Minimum 10% Charity Contribution</li>
            </ul>

            <form action={createCheckoutSession}>
              <input type="hidden" name="priceId" value={process.env.STRIPE_MONTHLY_PRICE_ID} />
              <Button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold h-14 rounded-xl">
                Choose Monthly
              </Button>
            </form>
          </div>

          {/* Yearly Plan */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col border-emerald-500/50">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
              BEST VALUE
            </div>
            <h3 className="text-2xl font-bold mb-2">Yearly Impact</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-extrabold text-white">$290</span>
              <span className="text-zinc-400">/ year</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 text-zinc-300">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Full Performance Core access</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Entry into Monthly Prize Draws</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Minimum 10% Charity Contribution</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> 2 Months Free</li>
            </ul>

            <form action={createCheckoutSession}>
              <input type="hidden" name="priceId" value={process.env.STRIPE_YEARLY_PRICE_ID} />
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-14 rounded-xl">
                Choose Yearly
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
