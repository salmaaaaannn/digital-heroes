"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BarChart3,
  Settings,
  Database,
  Activity,
  ShieldAlert,
  HeartPulse,
  Trophy,
  History,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

const adminNavItems = [
  { name: "Overview", href: "/admin", icon: Activity },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: ShieldAlert },
  { name: "Scores", href: "/admin/scores", icon: Activity },
  { name: "Draw Management", href: "/admin/draws", icon: Database },
  { name: "Charities", href: "/admin/charities", icon: HeartPulse },
  { name: "Winners", href: "/admin/winners", icon: Trophy },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Audit Log", href: "/admin/audit-log", icon: History },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r border-zinc-800 bg-[#111515] p-6 flex flex-col z-20 flex-shrink-0 shadow-2xl">
      <div className="text-sm font-extrabold tracking-widest mb-1 text-emerald-500">DIGITAL HEROES</div>
      <div className="text-xs font-bold text-zinc-500 tracking-widest mb-8">CONTROL CENTER</div>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-sm ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
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
          href="/admin/settings"
          prefetch={true}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-sm ${
            pathname === "/admin/settings"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
              : "text-zinc-400 hover:bg-zinc-850 hover:text-white border border-transparent"
          }`}
        >
          <Settings className="w-4 h-4 text-zinc-400" />
          <span>Settings</span>
        </Link>
        <div className="px-3.5 pt-2 flex items-center justify-between text-xs text-zinc-500">
          <span className="text-emerald-500 font-bold">Admin Active</span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
