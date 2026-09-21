import Link from "next/link";
import { Suspense } from "react";
import { SignupForm } from "./SignupForm";
import { HeartPulse } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="z-10 w-full max-w-lg p-8 md:p-10 glass rounded-3xl border border-zinc-800 shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-extrabold tracking-widest text-white">DIGITAL HEROES</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Create Account
          </h1>
          <p className="text-sm text-zinc-400">
            Track your performance. Join the monthly draw. Create real-world impact.
          </p>
        </div>

        <Suspense fallback={<div className="h-64 flex items-center justify-center text-zinc-500">Loading form...</div>}>
          <SignupForm />
        </Suspense>

        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center text-sm text-zinc-400">
          Already a hero?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Log in to command center
          </Link>
        </div>
      </div>
    </div>
  );
}
