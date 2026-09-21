"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCharity } from "./actions";

export function AddCharityDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createCharity(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-semibold shadow-lg shadow-emerald-950/40">
          <Plus className="w-4 h-4" />
          Add Charity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Charity</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Register a verified charitable organization to receive monthly subscriber contributions.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Charity Name *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Junior Golf Foundation"
                required
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-emerald-500"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Category *
              </label>
              <Input
                id="category"
                name="category"
                placeholder="e.g. Youth Development, Veteran Support, Environment"
                required
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-emerald-500"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="website_url" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Website URL
              </label>
              <Input
                id="website_url"
                name="website_url"
                type="url"
                placeholder="https://example.org"
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-emerald-500"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Brief summary of mission and impact..."
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  value="true"
                  defaultChecked
                  className="rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                />
                Active (Visible to public)
              </label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Charity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
