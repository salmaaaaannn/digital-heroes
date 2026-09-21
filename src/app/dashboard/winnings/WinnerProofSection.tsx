"use client";

import { useState } from "react";
import { Upload, CheckCircle2, Clock, AlertTriangle, FileText, Image as ImageIcon, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WinItem {
  id: string;
  drawDate: string;
  matchTier: number;
  amount: number;
  verificationStatus: "Pending" | "Approved" | "Rejected" | "Processing" | "Paid" | "Failed";
  proofUrl?: string | null;
}

export function WinnerProofSection({ initialWins }: { initialWins: WinItem[] }) {
  const [wins, setWins] = useState<WinItem[]>(initialWins);
  const [activeWinId, setActiveWinId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  function handleUploadSubmit(winId: string) {
    setUploading(true);
    setTimeout(() => {
      setWins((prev) =>
        prev.map((w) =>
          w.id === winId
            ? { ...w, verificationStatus: "Processing", proofUrl: previewUrl || null }
            : w
        )
      );
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setActiveWinId(null);
        setPreviewUrl(null);
        setUploadSuccess(false);
      }, 1500);
    }, 800);
  }

  const getStatusBadge = (status: WinItem["verificationStatus"]) => {
    switch (status) {
      case "Approved":
      case "Paid":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{status}</span>;
      case "Processing":
      case "Pending":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">{status}</span>;
      case "Rejected":
      case "Failed":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {wins.length === 0 ? (
        <div className="glass p-12 rounded-3xl border border-zinc-800 text-center flex flex-col items-center justify-center space-y-3">
          <Trophy className="w-12 h-12 text-zinc-600 mb-1" />
          <h3 className="text-lg font-bold text-white">No Winnings Recorded Yet</h3>
          <p className="text-zinc-400 text-xs max-w-md">
            Maintain an active 5-score Performance Core to participate in monthly draws. Any winning matches and verification proofs will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wins.map((win) => (
            <div key={win.id} className="glass p-6 md:p-8 rounded-3xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {win.matchTier}-Number Match
                  </span>
                  {getStatusBadge(win.verificationStatus)}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Monthly Draw #{win.id.slice(0, 8)}</h3>
                <p className="text-xs text-zinc-400">Draw Date: {win.drawDate}</p>
              </div>

              <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                <div className="text-3xl font-black text-emerald-400">
                  ${win.amount.toFixed(2)}
                </div>

                {win.verificationStatus === "Pending" && (
                  <button
                    onClick={() => setActiveWinId(win.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-950/40"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Scorecard Proof
                  </button>
                )}

                {win.verificationStatus === "Processing" && (
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" /> Verification under Admin Review
                  </div>
                )}

                {(win.verificationStatus === "Approved" || win.verificationStatus === "Paid") && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Proof Verified & Payout Authorized
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Proof Modal */}
      {activeWinId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass max-w-lg w-full p-8 rounded-3xl border border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setActiveWinId(null);
                setPreviewUrl(null);
              }}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Upload Winner Verification</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Upload a screenshot or photo of your official club scorecard or handicap app verifying the rounds that matched the draw.
            </p>

            {uploadSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <span className="font-bold text-white text-sm">Scorecard Uploaded Successfully</span>
                <span className="text-xs text-zinc-400">Admin compliance team will verify your payout.</span>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-zinc-800 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-900/40">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {previewUrl ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden flex items-center justify-center bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Scorecard Preview" className="object-contain h-full w-full" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <ImageIcon className="w-10 h-10 text-zinc-500 mb-3" />
                      <span className="text-sm font-semibold text-white mb-1">Click to select scorecard file</span>
                      <span className="text-xs text-zinc-500">Supports PNG, JPG, or PDF up to 10MB</span>
                    </div>
                  )}
                </label>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveWinId(null);
                      setPreviewUrl(null);
                    }}
                    className="rounded-xl border-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUploadSubmit(activeWinId)}
                    disabled={!previewUrl || uploading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                  >
                    {uploading ? "Uploading Proof..." : "Submit for Verification"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
