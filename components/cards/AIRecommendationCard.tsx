"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { subjectById } from "@/lib/data/demo";
import { Sparkles, ArrowRight } from "lucide-react";
import type { AIRecommendation } from "@/types";

export interface AIRecommendationCardProps {
  rec: AIRecommendation;
  onAct?: (rec: AIRecommendation) => void;
  className?: string;
}

const actionLabel: Record<AIRecommendation["action"], string> = {
  study: "Start studying",
  review: "Review now",
  prioritize: "Do this first",
  balance: "Rebalance",
};

export function AIRecommendationCard({
  rec,
  onAct,
  className,
}: AIRecommendationCardProps) {
  const subject = subjectById(rec.subjectId);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-brand-50 p-5 shadow-soft",
        className
      )}
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ai/20 blur-2xl" />
      <div className="relative flex gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-ai">
              AI Recommendation
            </p>
            {subject && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                style={{ backgroundColor: subject.color }}
              >
                {subject.name}
              </span>
            )}
          </div>
          <h3 className="mt-1 font-semibold leading-tight">{rec.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {rec.reason}
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="mt-2.5 -ml-2 h-8 px-2 text-ai hover:bg-violet-100"
            onClick={() => onAct?.(rec)}
          >
            {actionLabel[rec.action]}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
