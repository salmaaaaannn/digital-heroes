import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-white">
      <Link href="/" className="text-xl font-extrabold tracking-widest text-white">DIGITAL HEROES</Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
        <Link href="/charities" className="hover:text-white transition-colors">Charities</Link>
        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6">
          <Link href="/signup">Start Playing</Link>
        </Button>
      </div>
    </nav>
  );
}
