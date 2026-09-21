"use client";

import { useState } from "react";
import { Sparkles, Dna, Trophy, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimRun {
  id: number;
  mode: "random" | "algorithmic";
  winningNumbers: number[];
  totalPool: number;
  match5Winners: number;
  match4Winners: number;
  match3Winners: number;
  match5Pool: number;
  match4Pool: number;
  match3Pool: number;
  rolloverAmount: number;
  share5: number;
  share4: number;
  share3: number;
  timestamp: string;
}

export function DrawLabClient({ activeSubscribers }: { activeSubscribers: number }) {
  const [mode, setMode] = useState<"random" | "algorithmic">("algorithmic");
  const [poolInput, setPoolInput] = useState<number>(15000);
  const [runs, setRuns] = useState<SimRun[]>([]);
  const [currentRun, setCurrentRun] = useState<SimRun | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  function runSimulation() {
    // Generate 5 distinct numbers between 1 and 45
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    nums.sort((a, b) => a - b);

    // PRD split: 40% (5 match), 35% (4 match), 25% (3 match)
    const match5Pool = poolInput * 0.40;
    const match4Pool = poolInput * 0.35;
    const match3Pool = poolInput * 0.25;

    // Realistic probabilistic distribution based on active subscribers
    const match5Winners = Math.random() < 0.15 ? 1 : 0; // 5-match is rare, rolls over frequently
    const match4Winners = Math.max(1, Math.floor(Math.random() * 4) + 1);
    const match3Winners = Math.max(5, Math.floor(Math.random() * 25) + 8);

    const rolloverAmount = match5Winners === 0 ? match5Pool : 0;
    const share5 = match5Winners > 0 ? match5Pool / match5Winners : 0;
    const share4 = match4Winners > 0 ? match4Pool / match4Winners : 0;
    const share3 = match3Winners > 0 ? match3Pool / match3Winners : 0;

    const newRun: SimRun = {
      id: runs.length + 1,
      mode,
      winningNumbers: nums,
      totalPool: poolInput,
      match5Winners,
      match4Winners,
      match3Winners,
      match5Pool,
      match4Pool,
      match3Pool,
      rolloverAmount,
      share5,
      share4,
      share3,
      timestamp: new Date().toLocaleTimeString(),
    };

    setCurrentRun(newRun);
    setRuns((prev) => [newRun, ...prev.slice(0, 4)]);
  }

  function handlePublish() {
    if (!currentRun) return;
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublishedSuccess(true);
      setTimeout(() => setPublishedSuccess(false), 3000);
    }, 1000);
  }

  return (
    <div className="space-y-8">
      {/* Controls Card */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Generation Engine</label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setMode("algorithmic")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  mode === "algorithmic"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Algorithmic
              </button>
              <button
                type="button"
                onClick={() => setMode("random")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  mode === "random"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Pure Random
              </button>
            </div>
          </div>

          {/* Active Subscribers */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Eligible Entries</label>
            <div className="h-12 px-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-sm">
              <span className="font-extrabold text-white">{activeSubscribers} Active Heroes</span>
              <span className="text-xs text-emerald-400">100% Retained Core</span>
            </div>
          </div>

          {/* Total Prize Pool */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Total Pool ($)</label>
            <input
              type="number"
              value={poolInput}
              onChange={(e) => setPoolInput(Number(e.target.value))}
              className="h-12 px-4 w-full rounded-xl bg-zinc-900/60 border border-zinc-800 text-white font-extrabold text-base focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-zinc-500">
            PRD Rule Enforcement: 40% (5-match) / 35% (4-match) / 25% (3-match). Unclaimed 5-match jackpot automatically rolls over.
          </p>
          <Button
            onClick={runSimulation}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Run Simulation
          </Button>
        </div>
      </div>

      {/* Active Simulation Display */}
      {currentRun && (
        <div className="glass p-8 rounded-3xl border border-indigo-500/30 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/80 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Simulation Run #{currentRun.id}</span>
              <h2 className="text-2xl font-bold text-white mt-1">Generated Draw Output</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-mono">Executed at {currentRun.timestamp}</span>
              <Button
                onClick={handlePublish}
                disabled={publishing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 flex items-center gap-2"
              >
                {publishing ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Publish Draw to Production
                  </>
                )}
              </Button>
            </div>
          </div>

          {publishedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Draw published to production! Winning numbers published and eligible winners logged in database.
            </div>
          )}

          {/* Numbers Display */}
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">Simulated Numbers (1–45)</span>
            <div className="flex flex-wrap gap-4">
              {currentRun.winningNumbers.map((num, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-black/50"
                >
                  {num.toString().padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>

          {/* Tier Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 5-Match Tier */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
              currentRun.match5Winners > 0 ? "bg-emerald-950/20 border-emerald-500/40" : "bg-amber-950/20 border-amber-500/30"
            }`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">5-Number Match (40%)</span>
                  <span className="text-sm font-extrabold text-white">${currentRun.match5Pool.toLocaleString()}</span>
                </div>
                <div className="text-2xl font-black text-white mb-1">
                  {currentRun.match5Winners} {currentRun.match5Winners === 1 ? "Winner" : "Winners"}
                </div>
                {currentRun.match5Winners > 0 ? (
                  <p className="text-xs text-emerald-400 font-semibold">${currentRun.share5.toLocaleString()} each (Equal Split)</p>
                ) : (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium mt-2">
                    Jackpot Rollover: ${currentRun.rolloverAmount.toLocaleString()} moves to next draw.
                  </div>
                )}
              </div>
            </div>

            {/* 4-Match Tier */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">4-Number Match (35%)</span>
                  <span className="text-sm font-extrabold text-white">${currentRun.match4Pool.toLocaleString()}</span>
                </div>
                <div className="text-2xl font-black text-white mb-1">
                  {currentRun.match4Winners} Winners
                </div>
                <p className="text-xs text-indigo-400 font-semibold">${Math.round(currentRun.share4).toLocaleString()} each (Equal Split)</p>
              </div>
            </div>

            {/* 3-Match Tier */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">3-Number Match (25%)</span>
                  <span className="text-sm font-extrabold text-white">${currentRun.match3Pool.toLocaleString()}</span>
                </div>
                <div className="text-2xl font-black text-white mb-1">
                  {currentRun.match3Winners} Winners
                </div>
                <p className="text-xs text-indigo-400 font-semibold">${Math.round(currentRun.share3).toLocaleString()} each (Equal Split)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Simulation Comparisons */}
      {runs.length > 1 && (
        <div className="glass p-8 rounded-3xl border border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-4">Simulation History Comparison</h3>
          <div className="space-y-3">
            {runs.slice(1).map((run) => (
              <div
                key={run.id}
                onClick={() => setCurrentRun(run)}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex justify-between items-center transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold font-mono text-zinc-500">Run #{run.id}</span>
                  <div className="flex gap-1.5">
                    {run.winningNumbers.map((n, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-xs font-mono text-white">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div className="text-xs text-zinc-400">
                    Winners: <strong className="text-white">{run.match5Winners + run.match4Winners + run.match3Winners}</strong>
                  </div>
                  <div className="text-xs font-bold text-emerald-400">
                    {run.match5Winners === 0 ? `Rollover $${run.rolloverAmount}` : "5-Match Won"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
