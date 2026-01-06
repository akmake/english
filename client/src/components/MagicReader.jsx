// src/components/MagicSentence.jsx
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MagicSentence({ sentenceParts }) {
  if (!sentenceParts) return null;

  return (
    // הוספנו כאן dir="ltr" כדי שהאנגלית תהיה משמאל לימין
    <div className="flex flex-wrap gap-1.5 items-center justify-start text-left" dir="ltr">
      <TooltipProvider delayDuration={0}>
        {sentenceParts.map((part, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <span className="cursor-help text-lg text-slate-700 hover:bg-yellow-200 hover:text-indigo-900 px-1 rounded transition-colors">
                {part.en}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-900 text-white border-none text-base">
              <p>{part.he}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}