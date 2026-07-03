import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Sparkles } from "lucide-react";

export interface AIOutputProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/** Wrapper that gives generated AI content a consistent, branded frame. */
export function AIOutput({ title, children, actions, className }: AIOutputProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-brand-200/50 bg-card shadow-soft animate-fade-in",
        "bg-gradient-to-br from-brand-500/[0.04] to-electric-500/[0.06]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-soft">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-ai">
              StudySprint AI
            </p>
            {title && <p className="text-sm font-semibold leading-tight">{title}</p>}
          </div>
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/** Labeled sub-section inside an AI output block. */
export function AISection({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        {icon && <span className="text-brand-600">{icon}</span>}
        {title}
      </h4>
      {children}
    </div>
  );
}
