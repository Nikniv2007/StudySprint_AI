"use client";

import { PageHeader } from "@/components/study/Headers";
import { StatCard } from "@/components/cards/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import {
  WeeklyStudyChart,
  SubjectAreaChart,
} from "@/components/charts/WeeklyStudyChart";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  demoWeeklyStudy,
  demoQuizScores,
  subjectById,
  totalWeeklyMinutes,
  averageQuizScore,
  strongestSubject,
  weakestSubject,
} from "@/lib/data/demo";
import { formatMinutes, pct } from "@/lib/utils/format";
import { Clock, Target, Flame, CheckCircle2 } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Progress Tracker"
        title="Your progress"
        subtitle="Study time, quiz scores, streaks, and where to focus next."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Study time (week)" value={formatMinutes(totalWeeklyMinutes())} icon={<Clock className="h-5 w-5" />} accent="brand" trend={{ value: "18%", direction: "up" }} />
        <StatCard label="Avg quiz score" value={pct(averageQuizScore())} icon={<Target className="h-5 w-5" />} accent="ai" />
        <StatCard label="Current streak" value="6 days" icon={<Flame className="h-5 w-5" />} accent="warning" />
        <StatCard label="Completed sprints" value={12} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly Study Time" description="Minutes per day">
          <WeeklyStudyChart data={demoWeeklyStudy} />
        </ChartCard>
        <ChartCard title="Study Trend" description="Momentum across the week">
          <SubjectAreaChart data={demoWeeklyStudy} />
        </ChartCard>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Quiz scores by subject</h3>
          <p className="text-sm text-muted-foreground">
            Strongest: <span className="font-semibold text-success">{strongestSubject()}</span>{" "}
            · Weakest: <span className="font-semibold text-danger">{weakestSubject()}</span>
          </p>
        </div>
        <div className="space-y-4">
          {[...demoQuizScores]
            .sort((a, b) => b.score - a.score)
            .map((q) => {
              const subject = subjectById(q.subjectId);
              return (
                <div key={q.id} className="flex items-center gap-4">
                  <span className="w-32 shrink-0 text-sm font-medium">
                    {subject?.name}
                  </span>
                  <ProgressBar
                    value={q.score}
                    showLabel
                    tone={q.score >= 85 ? "success" : q.score >= 70 ? "brand" : "danger"}
                  />
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}
