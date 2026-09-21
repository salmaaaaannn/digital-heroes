"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Sequence timings
    const timers = [
      setTimeout(() => setStage(1), 500),   // Ring expands
      setTimeout(() => setStage(2), 2000),  // Impact Activated
      setTimeout(() => setStage(3), 4000),  // Show Details
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#080A0A] overflow-hidden">
      
      {/* Abstract Ring Animation */}
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 1, borderWidth: "50px" }}
            animate={{ scale: 10, opacity: 0, borderWidth: "1px" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute border-emerald-500 rounded-full w-32 h-32"
          />
        )}
      </AnimatePresence>

      <div className="z-10 text-center flex flex-col items-center">
        <AnimatePresence mode="wait">
          {stage === 2 && (
            <motion.h1
              key="impact"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-5xl md:text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            >
              IMPACT ACTIVATED
            </motion.h1>
          )}

          {stage >= 3 && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl w-full max-w-md flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              
              <h2 className="text-2xl font-bold mb-6 text-white">Welcome to Digital Heroes</h2>
              
              <ul className="space-y-4 w-full text-left mb-8 text-zinc-300">
                <li className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">SUBSCRIPTION ACTIVE</span>
                </li>
                <li className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">CHARITY CONTRIBUTION ACTIVE</span>
                </li>
                <li className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">DRAW PARTICIPATION ACTIVE</span>
                </li>
              </ul>
              
              <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 h-14 rounded-xl text-lg font-bold">
                <Link href="/dashboard">ENTER DASHBOARD</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
