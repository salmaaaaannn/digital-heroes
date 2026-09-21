import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/CommandPalette";
import Navbar from "@/components/layout/Navbar";
import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Digital Heroes | Play for more than the game",
  description: "Track your performance. Take your chance. Create real-world impact.",
};

// Persistent global 3D background with dynamic SSR disabled
const GlobalBackground = dynamic(() => import("@/components/3d/GlobalBackground"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080A0A]"
    >
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
    </div>
  ),
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialUser = null;
  let initialRole: "admin" | "subscriber" | null = null;

  try {
    const user = await getAuthUser();
    if (user) {
      initialUser = { email: user.email, id: user.id };
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      initialRole = (profile?.role as "admin" | "subscriber") || "subscriber";
    }
  } catch (e) {
    // Graceful fallback for unauthenticated visitors
  }

  return (
    <html lang="en" className={cn("dark", "font-sans", inter.variable)}>
      <body className={`${inter.className} bg-[#080A0A] text-white min-h-screen antialiased overflow-x-hidden selection:bg-emerald-500/30 relative flex flex-col`}>
        {/* Persistent Global 3D Background across entire application */}
        <GlobalBackground />

        {/* Unified Global Navbar adapting to Public, Subscriber, and Admin */}
        <Navbar initialUser={initialUser} initialRole={initialRole} />

        {/* Main Application Content Container */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>

        <CommandPalette />
      </body>
    </html>
  );
}
