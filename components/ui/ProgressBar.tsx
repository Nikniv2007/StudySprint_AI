import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  tone?: "brand" | "success" | "warning" | "danger";
}

const toneMap = {
  brand: "bg-brand-gradient",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function ProgressBar({
  value,
  className,
  barClassName,
  showLabel = false,
  tone = "brand",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            toneMap[tone],
            barClassName
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs font-semibold text-muted-foreground">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
