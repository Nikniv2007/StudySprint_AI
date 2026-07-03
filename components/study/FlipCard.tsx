"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { Flashcard } from "@/types";

export interface FlipCardProps {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  className?: string;
}

/** A single flippable flashcard with a 3D flip animation. */
export function FlipCard({ card, flipped, onFlip, className }: FlipCardProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className={cn("group relative h-72 w-full [perspective:1600px]", className)}
      aria-label="Flip card"
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-soft [backface-visibility:hidden]">
          <span className="absolute left-5 top-5 text-[11px] font-semibold uppercase tracking-widest text-brand-500">
            Question
          </span>
          <p className="text-xl font-semibold leading-snug">{card.front}</p>
          <span className="absolute bottom-5 text-xs text-muted-foreground">
            Tap to flip
          </span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-brand-200 bg-brand-gradient p-8 text-center text-white shadow-glow [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <span className="absolute left-5 top-5 text-[11px] font-semibold uppercase tracking-widest text-white/70">
            Answer
          </span>
          <p className="text-lg font-medium leading-relaxed">{card.back}</p>
          <span className="absolute bottom-5 text-xs text-white/70">
            Tap to flip back
          </span>
        </div>
      </div>
    </button>
  );
}
