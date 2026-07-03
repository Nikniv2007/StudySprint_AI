"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { formatClock } from "@/lib/utils/format";

export interface TimerDisplayProps {
  /** Remaining seconds. */
  seconds: number;
  /** Total seconds for the ring progress. */
  totalSeconds: number;
  running?: boolean;
  label?: string;
  size?: number;
  className?: string;
}

export function TimerDisplay({
  seconds,
  totalSeconds,
  running,
  label,
  size = 220,
  className,
}: TimerDisplayProps) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const dash = circumference * (1 - progress);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {running && (
        <span className="absolute inset-3 rounded-full bg-brand-400/20 animate-pulse-ring" />
      )}
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#timerGrad)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dash}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
          {formatClock(seconds)}
        </span>
        {label && (
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
