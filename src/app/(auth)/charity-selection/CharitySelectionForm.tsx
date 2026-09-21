"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitCharitySelection } from "./actions";

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function CharitySelectionForm({ charities, userId }: { charities: Charity[], userId: string }) {
  const router = useRouter();
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImpactAnimation, setShowImpactAnimation] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCharity) return;
    setIsSubmitting(true);
    
    await submitCharitySelection(userId, selectedCharity, percentage);
    router.push("/subscription");
  };

  return (
    <>
      <AnimatePresence>
        {showImpactAnimation && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080A0A]/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <Heart className="w-12 h-12 text-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">YOUR IMPACT HAS BEGUN.</h2>
              <p className="text-emerald-400">{percentage}% OF YOUR SUBSCRIPTION GOES TO YOUR CHOSEN CAUSE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {charities.map((charity) => (
          <Card 
            key={charity.id}
            className={`glass p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${selectedCharity === charity.id ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
            onClick={() => setSelectedCharity(charity.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">
                {charity.category}
              </span>
              {selectedCharity === charity.id && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <h3 className="text-lg font-bold mb-2">{charity.name}</h3>
            <p className="text-sm text-zinc-400 line-clamp-3">{charity.description}</p>
          </Card>
        ))}
      </div>

      {selectedCharity && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl max-w-2xl mx-auto flex flex-col items-center"
        >
          <h3 className="text-xl font-bold mb-6">Select Contribution Percentage</h3>
          <div className="flex gap-4 mb-8 w-full overflow-x-auto pb-4 justify-center">
            {[10, 15, 20, 25].map((pct) => (
              <button
                key={pct}
                onClick={() => setPercentage(pct)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${percentage === pct ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <Button 
            size="lg" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-14 text-lg rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Confirm Impact
          </Button>
        </motion.div>
      )}
    </>
  );
}
