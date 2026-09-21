"use client";

import { useState } from "react";
import { Search, HeartPulse } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddCharityDialog } from "./AddCharityDialog";
import { CharityRowActions } from "./CharityRowActions";

interface Charity {
  id: string;
  name: string;
  category: string;
  description: string | null;
  website_url: string | null;
  active: boolean;
  is_featured?: boolean;
}

export function CharitiesClientView({ initialCharities }: { initialCharities: Charity[] }) {
  const [search, setSearch] = useState("");

  const filteredCharities = initialCharities.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const activeCount = initialCharities.filter((c) => c.active).length;
  const archivedCount = initialCharities.filter((c) => !c.active).length;

  return (
    <div className="max-w-7xl mx-auto flex flex-col relative min-h-[80vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 z-10">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-extrabold capitalize text-white">Charities Management</h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Manage verified non-profit partners for subscriber contributions.
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="text-zinc-400">Total: <strong className="text-white">{initialCharities.length}</strong></span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400">Active: <strong>{activeCount}</strong></span>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400">Archived: <strong>{archivedCount}</strong></span>
          </div>
        </div>
        <AddCharityDialog />
      </div>

      {/* Search Filter Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search charities by name, category, or mission..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 rounded-xl focus-visible:ring-emerald-500"
          />
        </div>
      </div>
      
      <div className="glass rounded-3xl z-10 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 py-4">Name</TableHead>
              <TableHead className="text-zinc-400 py-4">Category</TableHead>
              <TableHead className="text-zinc-400 py-4">Status</TableHead>
              <TableHead className="text-zinc-400 py-4">Featured</TableHead>
              <TableHead className="text-right text-zinc-400 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCharities.map((charity) => (
              <TableRow
                key={charity.id}
                className={`border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                  !charity.active ? "opacity-60 bg-zinc-950/40" : ""
                }`}
              >
                <TableCell className="font-medium text-white">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{charity.name}</span>
                      {charity.website_url && (
                        <a
                          href={charity.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-zinc-500 hover:text-emerald-400 underline"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                    {charity.description && (
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{charity.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 uppercase text-xs tracking-wider font-semibold">
                  {charity.category}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={charity.active ? "default" : "secondary"}
                    className={
                      charity.active
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }
                  >
                    {charity.active ? "Active" : "Archived"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {charity.is_featured ? (
                    <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 bg-indigo-500/10">
                      Featured
                    </Badge>
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <CharityRowActions charity={charity} />
                </TableCell>
              </TableRow>
            ))}
            {filteredCharities.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                  {search ? `No charities match "${search}"` : "No charities registered  Click \"Add Charity\" to create one."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
