"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, AlertCircle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const configured = isSupabaseConfigured();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!configured) {
      setError(
        "Database connection missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured in .env.local for live authentication."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        const code = (authError as any).code || "";
        const msg = authError.message || "";

        if (code === "email_provider_disabled" || msg.toLowerCase().includes("provider disabled")) {
          setError(
            "Email authentication is disabled in your Supabase project. To fix: Open Supabase Dashboard -> Authentication -> Providers -> Email, and toggle 'Enable Email provider' to ON, then click Save."
          );
        } else if (code === "invalid_credentials" || msg.toLowerCase().includes("invalid login credentials")) {
          setError("Invalid email or password. Please verify your credentials and try again.");
        } else if (code === "email_not_confirmed" || msg.toLowerCase().includes("not confirmed")) {
          setError(
            "Email not yet confirmed. In your Supabase Dashboard under Authentication -> Providers -> Email, toggle 'Confirm email' to OFF and click Save."
          );
        } else {
          setError(msg || "Invalid credentials. Please verify your email and password.");
        }
        setLoading(false);
        return;
      }

      if (authData?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(
        err?.message === "Failed to fetch"
          ? "Failed to connect to Supabase: The configured project URL is unreachable. Please verify your Supabase project status."
          : err?.message || "An unexpected error occurred during login."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {!configured && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs leading-relaxed text-left">
          <Database className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>External Service Unconfigured:</strong> Connect your Supabase project credentials in <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">.env.local</code> to enable authentication.
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-left">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="pl-11 h-12 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Password
            </Label>
            <Link
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset instructions will be sent via email once your Supabase project SMTP is active.");
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={loading}
              className="pl-11 pr-11 h-12 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 text-base transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
