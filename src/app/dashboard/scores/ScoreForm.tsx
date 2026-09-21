"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitScore } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CubeLoader } from "@/components/ui/cube-loader";
import { AlertCircle, CheckCircle2, Trophy } from "lucide-react";

export function ScoreForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [score, setScore] = useState("");
  const [scoreDate, setScoreDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;

    setError(null);
    setSuccess(null);

    // Client-side quick checks
    const numScore = Number(score);
    if (!score || isNaN(numScore) || numScore < 1 || numScore > 45) {
      setError("Please enter a valid Stableford score between 1 and 45.");
      return;
    }

    if (!scoreDate) {
      setError("Please select the date this round was played.");
      return;
    }

    const formData = new FormData();
    formData.append("score", score);
    formData.append("playedAt", scoreDate);

    startTransition(async () => {
      try {
        const result = await submitScore(formData);

        if (!result.success) {
          setError(result.error || "Failed to record score.");
        } else {
          setSuccess(result.message || "Score logged successfully!");
          setScore("");
          router.refresh();
        }
      } catch (err: any) {
        console.error("Score submission error:", err);
        setError("Network error while submitting score. Please try again.");
      }
    });
  }

  return (
    <div className="glass p-6 rounded-2xl h-min border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold">Add Stableford Score</h2>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="score" className="text-xs font-semibold text-zinc-300">
            Stableford Score (1–45)
          </Label>
          <Input
            type="number"
            id="score"
            name="score"
            min="1"
            max="45"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 38"
            required
            disabled={isPending}
            className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="playedAt" className="text-xs font-semibold text-zinc-300">
            Round Date
          </Label>
          <Input
            type="date"
            id="playedAt"
            name="playedAt"
            value={scoreDate}
            onChange={(e) => setScoreDate(e.target.value)}
            required
            disabled={isPending}
            className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
        >
          {isPending ? (
            <>
              <CubeLoader size={20} />
              <span>Saving score...</span>
            </>
          ) : (
            <span>Log Performance</span>
          )}
        </Button>
      </form>

      <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
        Note: Digital Heroes maintains your latest 5 rolling scores. When a 6th score is recorded, the oldest round is automatically retired.
      </p>
    </div>
  );
}
