"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, Activity, HeartPulse, ShieldCheck, Gift, Settings, ShieldAlert, X, Sparkles, Award, TrendingUp, History } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands = [
    { name: "Go to Dashboard", href: "/dashboard", icon: Home, section: "Navigation" },
    { name: "Add / Manage Scores", href: "/dashboard/scores", icon: Activity, section: "Actions" },
    { name: "Performance Intelligence", href: "/dashboard/performance", icon: TrendingUp, section: "Navigation" },
    { name: "Impact Passport", href: "/dashboard/impact", icon: Sparkles, section: "Navigation" },
    { name: "Hero Achievements", href: "/dashboard/achievements", icon: Award, section: "Navigation" },
    { name: "Explore Charities", href: "/charities", icon: HeartPulse, section: "Navigation" },
    { name: "Monthly Draw Engine", href: "/dashboard/draws", icon: ShieldCheck, section: "Navigation" },
    { name: "View Winnings & Payouts", href: "/dashboard/winnings", icon: Gift, section: "Navigation" },
    { name: "Account Settings", href: "/dashboard/settings", icon: Settings, section: "Preferences" },
    { name: "Admin Control Center", href: "/admin", icon: ShieldAlert, section: "Admin" },
    { name: "Admin Draw Lab", href: "/admin/draws", icon: ShieldCheck, section: "Admin" },
    { name: "Admin Audit Log", href: "/admin/audit-log", icon: History, section: "Admin" },
  ];

  const filtered = commands.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.section.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(href: string) {
    setOpen(false);
    setSearch("");
    router.push(href);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl glass border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-zinc-800/80">
          <Search className="w-5 h-5 text-zinc-500 mr-3" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search routes (⌘K)..."
            className="w-full bg-transparent py-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No matching commands or routes found.
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.href + cmd.name}
                  onClick={() => handleSelect(cmd.href)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-800/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white">
                      {cmd.name}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 group-hover:text-zinc-400">
                    {cmd.section}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-zinc-950/60 border-t border-zinc-900 flex justify-between items-center text-[11px] text-zinc-500">
          <span>Navigate with ⌘K anytime</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
