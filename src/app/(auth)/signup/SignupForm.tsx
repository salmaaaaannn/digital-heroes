"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, AlertCircle, Database, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // Prevent repeated signup requests
    setError(null);
    setSuccessMessage(null);

    // Client-side validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!termsAccepted) {
      setError("You must accept the terms and conditions to proceed.");
      return;
    }

    if (!configured) {
      setError(
        "Database connection missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured in .env.local to create real user accounts."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // Step 1: Execute single signUp request to Supabase Auth
      // NOTE: No auto-resend, no verifyOtp, no polling
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (authError) {
        const code = (authError as any).code || "";
        const msg = authError.message || "";

        if (code === "email_provider_disabled" || msg.includes("Email signups are disabled") || msg.toLowerCase().includes("provider disabled")) {
          setError(
            "Email authentication is currently disabled in your Supabase project. To fix: Open Supabase Dashboard -> Authentication -> Providers -> Email, and toggle 'Enable Email provider' to ON, then click Save."
          );
        } else if (code === "signup_disabled" || msg.toLowerCase().includes("signups are disabled")) {
          setError(
            "Signups are currently disabled in your Supabase project. To fix: Open Supabase Dashboard -> Authentication -> Providers -> Email, and toggle 'Allow new users to sign up' to ON, then click Save."
          );
        } else if (code === "over_email_send_rate_limit" || msg.toLowerCase().includes("rate limit")) {
          setError(
            "Supabase email rate limit exceeded. In your Supabase Dashboard under Authentication -> Providers -> Email, toggle 'Confirm email' to OFF and click 'Save' at the bottom of the card."
          );
        } else if (code === "user_already_exists" || msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
          setError("An account with this email address already exists. Please log in instead.");
        } else {
          setError(msg || "Failed to create account. Please verify your credentials and try again.");
        }
        setLoading(false);
        return;
      }

      // Step 2: Create profile row in public.profiles
      if (data?.user) {
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            role: "subscriber",
          });
        } catch (profileErr) {
          console.error("Profile sync notice:", profileErr);
        }
      }

      // Step 3: Show Account created successfully and redirect to /dashboard
      setSuccessMessage("Account created successfully. Redirecting to your dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(
        err?.message === "Failed to fetch"
          ? "Failed to connect to Supabase: The configured project URL is unreachable. Please verify your Supabase project status."
          : err?.message || "An unexpected error occurred during registration."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-5 text-left">
      {!configured && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs leading-relaxed">
          <Database className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>External Service Unconfigured:</strong> Live Supabase project is not yet connected in <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">.env.local</code>. Click below to preview the onboarding flow.
          </span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm animate-pulse">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
          Full Name
        </Label>
        <div className="relative">
          <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Full Name"
            required
            disabled={loading}
            className="pl-11 h-12 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
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
            className="pl-11 h-12 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      {/* Password & Confirm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="pl-9 pr-9 h-11 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500 text-sm rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="pl-9 h-11 bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500 text-sm rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Terms & Consent */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id="terms"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-950"
        />
        <label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed cursor-pointer select-none">
          I agree to the Digital Heroes Terms of Service and understand that a minimum 10% of my subscription supports my selected charity.
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 text-base transition-all mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating Hero Profile...</span>
          </>
        ) : (
          <>
            <span>Create Hero Account</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
