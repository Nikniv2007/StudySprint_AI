"use client";

import * as React from "react";

const COLORS = ["#6366f1", "#a855f7", "#38bdf8", "#22c55e", "#f59e0b", "#ec4899"];

/**
 * Lightweight, dependency-free confetti burst. Render when `fire` is true;
 * pieces clean themselves up after the animation.
 */
export function Confetti({ fire }: { fire: boolean }) {
  const [pieces, setPieces] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!fire) return;
    setPieces(Array.from({ length: 80 }, (_, i) => i));
    const t = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(t);
  }, [fire]);

  if (pieces.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {pieces.map((i) => {
        const left = (i * 137.5) % 100; // golden-angle spread, deterministic
        const delay = (i % 10) * 0.08;
        const duration = 2.2 + ((i * 7) % 12) / 10;
        const color = COLORS[i % COLORS.length];
        const size = 6 + ((i * 3) % 8);
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              width: size,
              height: size + 4,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
