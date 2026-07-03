import * as React from "react";
import { cn } from "@/lib/utils/cn";

type Tone =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "ai"
  | "muted";

const tones: Record<Tone, string> = {
  default: "bg-muted text-foreground",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
  success: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-100",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100",
  danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100",
  ai: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100",
  muted: "bg-slate-100 text-slate-600",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
