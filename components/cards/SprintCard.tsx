"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { subjectById } from "@/lib/data/demo";
import { formatDate } from "@/lib/utils/format";
import { Play, CheckCircle2, CalendarClock, Zap } from "lucide-react";
import type { Sprint } from "@/types";

export interface SprintCardProps {
  sprint: Sprint;
  onStart?: (sprint: Sprint) => void;
  className?: string;
}

const statusConfig = {
  active: { tone: "brand" as const, label: "Active", Icon: Zap },
  scheduled: { tone: "warning" as const, label: "Scheduled", Icon: CalendarClock },
  completed: { tone: "success" as const, label: "Completed", Icon: CheckCircle2 },
};

export function SprintCard({ sprint, onStart, className }: SprintCardProps) {
  const subject = subjectById(sprint.subjectId);
  const { tone, label, Icon } = statusConfig[sprint.status];

  return (
    <Card className={cn("flex flex-col gap-3 p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${subject?.color}, ${subject?.color}cc)`,
            }}
          >
            <span className="text-sm font-bold">{sprint.length}</span>
          </div>
          <div>
            <h3 className="font-semibold leading-tight">{sprint.title}</h3>
            <p className="text-xs text-muted-foreground">
              {subject?.name} · {sprint.length}-minute sprint
            </p>
          </div>
        </div>
        <Badge tone={tone}>
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {sprint.status === "completed" && sprint.completedAt
            ? `Completed ${formatDate(sprint.completedAt)}${
                sprint.focusScore ? ` · ${sprint.focusScore}% focus` : ""
              }`
            : sprint.scheduledFor
              ? `Scheduled for ${formatDate(sprint.scheduledFor)}`
              : "Ready when you are"}
        </p>
        {sprint.status !== "completed" && (
          <Button size="sm" variant="secondary" onClick={() => onStart?.(sprint)}>
            <Play className="h-4 w-4" />
            Start
          </Button>
        )}
      </div>
    </Card>
  );
}
