"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ShieldCheck,
  HeartPulse,
  Settings,
  Home,
  Gift,
  Award,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { name: "Command Center", href: "/dashboard", icon: Home },
  { name: "Performance Core", href: "/dashboard/scores", icon: Activity },
  { name: "Monthly Draws", href: "/dashboard/draws", icon: ShieldCheck },
  { name: "Your Impact", href: "/dashboard/charity", icon: HeartPulse },
  { name: "Performance Intel", href: "/dashboard/performance", icon: TrendingUp },
  { name: "Impact Passport", href: "/dashboard/impact", icon: Sparkles },
  { name: "Achievements", href: "/dashboard/achievements", icon: Award },
  { name: "Winnings", href: "/dashboard/winnings", icon: Gift },
];

export function DashboardSidebar({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r border-zinc-800 bg-[#111515] p-6 flex flex-col z-20 shadow-2xl flex-shrink-0">
      <Link href="/dashboard" className="text-xl font-extrabold tracking-widest mb-10 text-white hover:text-emerald-400 transition-colors">
        DIGITAL HEROES
      </Link>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-sm ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950/30 font-semibold"
                  : "text-zinc-400 hover:bg-zinc-850 hover:text-white border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-zinc-800 space-y-2 mt-4">
        <Link
          href="/dashboard/settings"
          prefetch={true}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-sm ${
            pathname === "/dashboard/settings"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
              : "text-zinc-400 hover:bg-zinc-850 hover:text-white border border-transparent"
          }`}
        >
          <Settings className="w-4 h-4 text-zinc-400" />
          <span>Settings</span>
        </Link>
        <div className="px-3.5 pt-2 flex items-center justify-between text-xs text-zinc-500">
          <span className="truncate max-w-[120px]" title={userEmail || "Subscriber"}>
            {userEmail || "Subscriber"}
          </span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
