"use client";

import * as React from "react";
import { PageHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/study/EmptyState";
import { demoSessions, subjectById } from "@/lib/data/demo";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { formatMinutes, formatDate } from "@/lib/utils/format";
import type { StudySprint, StudySession } from "@/types";
import { CheckCircle2, Clock, Zap, History as HistoryIcon } from "lucide-react";

const typeTone = {
  sprint: "brand",
  review: "ai",
  practice: "success",
  planning: "warning",
} as const;

interface TimelineItem {
  id: string;
  title: string;
  subjectName?: string;
  color?: string;
  date: string;
  minutes: number;
  type: keyof typeof typeTone;
  focusScore?: number;
}

export default function HistoryPage() {
  const saved = useCollection<StudySprint>(STORAGE_KEYS.savedSprints, []);

  const fromSessions: TimelineItem[] = demoSessions.map((s: StudySession) => ({
    id: s.id,
    title: s.title,
    subjectName: subjectById(s.subjectId)?.name,
    color: subjectById(s.subjectId)?.color,
    date: s.date,
    minutes: s.durationMinutes,
    type: s.type,
    focusScore: s.focusScore,
  }));

  const fromSaved: TimelineItem[] = saved.items.map((s) => ({
    id: s.id,
    title: s.goal,
    subjectName: s.subject,
    color: subjectById(s.subjectId)?.color ?? "#6366f1",
    date: s.createdAt,
    minutes: s.length,
    type: "sprint",
  }));

  const items = [...fromSaved, ...fromSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalMinutes = items.reduce((sum, x) => sum + x.minutes, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Study History"
        title="Study history"
        subtitle={`${items.length} sessions · ${formatMinutes(
          totalMinutes
        )} of focused study logged.`}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-7 w-7" />}
          title="No study sessions yet"
          description="Complete a sprint or save one from the Create Study Sprint page to build your history."
        />
      ) : (
        <Card className="p-0">
          <div className="relative space-y-0 p-5">
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              return (
                <div key={item.id} className="relative flex gap-4 pb-6">
                  {!isLast && (
                    <span className="absolute left-[19px] top-10 h-full w-px bg-border" />
                  )}
                  <div
                    className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium leading-tight">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.subjectName} · {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={typeTone[item.type]} className="capitalize">
                        {item.type}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatMinutes(item.minutes)}
                      </span>
                      {item.focusScore && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {item.focusScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
