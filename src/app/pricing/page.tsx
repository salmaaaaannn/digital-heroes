import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-6">Simple, Impactful Pricing</h1>
        <p className="text-xl text-zinc-400 mb-16 max-w-2xl mx-auto">
          One plan. Complete access. Direct impact.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div className="glass p-12 rounded-3xl flex flex-col border-zinc-800">
            <h3 className="text-2xl font-bold mb-4">Monthly</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-extrabold text-white">$29</span>
              <span className="text-zinc-400">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1 text-zinc-300">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Full Performance Core access</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Entry into Monthly Prize Draws</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Minimum 10% Charity Contribution</li>
            </ul>

            <Button className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold h-14 rounded-xl">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <div className="glass p-12 rounded-3xl flex flex-col border-emerald-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
              BEST VALUE
            </div>
            <h3 className="text-2xl font-bold mb-4">Yearly</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-extrabold text-white">$290</span>
              <span className="text-zinc-400">/ year</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1 text-zinc-300">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Full Performance Core access</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Entry into Monthly Prize Draws</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Minimum 10% Charity Contribution</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> 2 Months Free</li>
            </ul>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-14 rounded-xl">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
