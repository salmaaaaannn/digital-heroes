"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Archive, CheckCircle } from "lucide-react";
import { archiveCharity, activateCharity } from "./actions";
import { EditCharityDialog } from "./EditCharityDialog";

interface Charity {
  id: string;
  name: string;
  category: string;
  description: string | null;
  website_url: string | null;
  active: boolean;
  is_featured?: boolean;
}

export function CharityRowActions({ charity }: { charity: Charity }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    if (charity.active) {
      await archiveCharity(charity.id);
    } else {
      await activateCharity(charity.id);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <EditCharityDialog charity={charity} />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={loading}
        className={
          charity.active
            ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
            : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        }
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
        ) : charity.active ? (
          <Archive className="w-3.5 h-3.5 mr-1" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5 mr-1" />
        )}
        {charity.active ? "Archive" : "Activate"}
      </Button>
    </div>
  );
}
