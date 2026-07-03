"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PriorityBadge, DeadlineBadge } from "@/components/study/Badges";
import { formatMinutes } from "@/lib/utils/format";
import { subjectById } from "@/lib/data/demo";
import { Play, Clock, Timer } from "lucide-react";
import type { StudyTask } from "@/types";

export interface TaskCardProps {
  task: StudyTask;
  onStart?: (task: StudyTask) => void;
  className?: string;
}

export function TaskCard({ task, onStart, className }: TaskCardProps) {
  const subject = subjectById(task.subjectId);

  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-4 transition-shadow hover:shadow-glow",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 h-9 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: subject?.color }}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {subject?.name}
            </p>
            <h3 className="font-semibold leading-tight">{task.title}</h3>
          </div>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <DeadlineBadge dueDate={task.dueDate} />
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatMinutes(task.estimatedMinutes)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Timer className="h-3.5 w-3.5" />
          {task.recommendedSprint}m sprint
        </span>
      </div>

      <Button
        size="sm"
        className="mt-1 w-full"
        onClick={() => onStart?.(task)}
      >
        <Play className="h-4 w-4" />
        Start Sprint
      </Button>
    </Card>
  );
}
