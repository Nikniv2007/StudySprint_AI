"use client";

import { PageHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { demoSessions, subjectById } from "@/lib/data/demo";
import { formatMinutes, formatDate } from "@/lib/utils/format";
import { CheckCircle2, Clock, Zap } from "lucide-react";

const typeTone = {
  sprint: "brand",
  review: "ai",
  practice: "success",
  planning: "warning",
} as const;

export default function HistoryPage() {
  const totalMinutes = demoSessions.reduce(
    (s, x) => s + x.durationMinutes,
    0
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Study History"
        title="Study history"
        subtitle={`${demoSessions.length} sessions · ${formatMinutes(
          totalMinutes
        )} of focused study logged.`}
      />

      <Card className="p-0">
        <div className="relative space-y-0 p-5">
          {demoSessions.map((session, i) => {
            const subject = subjectById(session.subjectId);
            const isLast = i === demoSessions.length - 1;
            return (
              <div key={session.id} className="relative flex gap-4 pb-6">
                {!isLast && (
                  <span className="absolute left-[19px] top-10 h-full w-px bg-border" />
                )}
                <div
                  className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: subject?.color }}
                >
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium leading-tight">{session.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {subject?.name} · {formatDate(session.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={typeTone[session.type]} className="capitalize">
                      {session.type}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatMinutes(session.durationMinutes)}
                    </span>
                    {session.focusScore && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {session.focusScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
