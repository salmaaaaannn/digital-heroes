"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Shield,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Sparkles,
  Trophy,
  HeartPulse,
  Activity,
  DollarSign,
  Users,
  Banknote,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavbarProps {
  initialUser?: { email?: string; id: string } | null;
  initialRole?: "admin" | "subscriber" | null;
}

export default function Navbar({ initialUser = null, initialRole = null }: NavbarProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    setUser(initialUser);
    setRole(initialRole);
  }, [initialUser, initialRole]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Listen to client-side auth state changes
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email, id: session.user.id });
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();
        setRole((profile?.role as "admin" | "subscriber") || "subscriber");
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/login");
    router.refresh();
  };

  // Determine navigation links based on user role
  const getNavLinks = (): NavItem[] => {
    if (role === "admin") {
      return [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Subscriptions", href: "/admin/subscriptions", icon: Banknote },
        { name: "Scores", href: "/admin/scores", icon: Activity },
        { name: "Draws", href: "/admin/draws", icon: Trophy },
        { name: "Charities", href: "/admin/charities", icon: HeartPulse },
        { name: "Winners", href: "/admin/winners", icon: DollarSign },
        { name: "Analytics", href: "/admin/analytics", icon: Sparkles },
      ];
    }

    if (user && role === "subscriber") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Scores", href: "/dashboard/scores", icon: Activity },
        { name: "Charity", href: "/dashboard/charity", icon: HeartPulse },
        { name: "Draws", href: "/dashboard/draws", icon: Trophy },
        { name: "Winnings", href: "/dashboard/winnings", icon: DollarSign },
      ];
    }

    // Public Visitor
    return [
      { name: "Home", href: "/", icon: Sparkles },
      { name: "How It Works", href: "/how-it-works", icon: Activity },
      { name: "Charities", href: "/charities", icon: HeartPulse },
      { name: "Pricing", href: "/pricing", icon: Banknote },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-zinc-800/80 bg-[#080A0A]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link
            href={role === "admin" ? "/admin" : user ? "/dashboard" : "/"}
            className="group flex items-center gap-2.5 transition-transform active:scale-95"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-md shadow-emerald-500/20">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="text-base font-black tracking-wider text-white group-hover:text-emerald-400 transition-colors">
              DIGITAL HEROES
            </span>
          </Link>

          {role === "admin" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              <Shield className="h-2.5 w-2.5" />
              Admin
            </span>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-zinc-800/90 text-white shadow-sm border border-zinc-700/50"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-white hover:border-zinc-700 transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="max-w-[130px] truncate text-zinc-300">{user.email}</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-[#0c0f0f] p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-[11px] text-zinc-500 border-b border-zinc-800/80 mb-1">
                    Signed in as <br />
                    <span className="font-semibold text-zinc-300 truncate block">{user.email}</span>
                  </div>

                  {role === "admin" ? (
                    <Link
                      href="/admin/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 text-zinc-400" />
                      Settings
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 text-zinc-400" />
                      Settings
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors px-2 py-1"
              >
                Login
              </Link>
              <Button
                size="sm"
                className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 shadow-md shadow-emerald-950/40"
                asChild
              >
                <Link href="/signup">Join Now</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-800 bg-[#080A0A]/95 px-4 py-6 backdrop-blur-2xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-zinc-800 text-white border border-zinc-700/60"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {link.icon && <link.icon className="h-4 w-4 text-emerald-400" />}
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 border-t border-zinc-800/80 pt-4">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="px-4 py-1 text-xs text-zinc-500">
                  Signed in as <span className="font-semibold text-zinc-300">{user.email}</span>
                </div>
                <Link
                  href={role === "admin" ? "/admin/settings" : "/dashboard/settings"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-500"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export { Navbar };
