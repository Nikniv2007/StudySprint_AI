"use client";

import * as React from "react";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { StatCard } from "@/components/cards/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ChartCard } from "@/components/charts/ChartCard";
import { WeeklyStudyChart } from "@/components/charts/WeeklyStudyChart";
import {
  SubjectPieChart,
  QuizLineChart,
  type PieDatum,
} from "@/components/charts/DistributionCharts";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { generateProgressInsights } from "@/lib/ai/mock-ai";
import {
  demoWeeklyStudy,
  demoQuizScores,
  demoSessions,
  demoSubjects,
  subjectById,
  totalWeeklyMinutes,
  averageQuizScore,
  strongestSubject,
  weakestSubject,
} from "@/lib/data/demo";
import { formatMinutes, pct } from "@/lib/utils/format";
import type { Assignment } from "@/types";
import {
  Clock,
  Target,
  Flame,
  CheckCircle2,
  CalendarX2,
  TrendingUp,
  TrendingDown,
  Rocket,
  Sparkles,
  Lightbulb,
} from "lucide-react";

const insightTone = {
  positive: "success",
  neutral: "brand",
  warning: "warning",
} as const;

export default function ProgressPage() {
  const { items: assignments } = useCollection<Assignment>(
    STORAGE_KEYS.assignments,
    []
  );

  const completed = assignments.filter((a) => a.status === "completed").length;
  const missed = assignments.filter(
    (a) => a.status !== "completed" && new Date(a.dueDate).getTime() < Date.now()
  ).length;
  const pending = assignments.filter((a) => a.status !== "completed").length;
  const completionPct = assignments.length
    ? (completed / assignments.length) * 100
    : 0;

  // Subject distribution from study sessions
  const dist: PieDatum[] = demoSubjects
    .map((s) => ({
      name: s.name,
      color: s.color,
      value: demoSessions
        .filter((x) => x.subjectId === s.id)
        .reduce((sum, x) => sum + x.durationMinutes, 0),
    }))
    .filter((d) => d.value > 0);

  // Quiz score trend (chronological)
  const quizTrend = [...demoQuizScores]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((q, i) => ({
      label: subjectById(q.subjectId)?.name.slice(0, 4) ?? `Q${i + 1}`,
      score: q.score,
    }));

  const insights = generateProgressInsights(demoSessions, demoQuizScores, demoSubjects);

  // Extra "coach" insights required by the brief
  const coachInsights = [
    { icon: <Clock className="h-4 w-4" />, text: "You study best in 45-minute sessions." },
    { icon: <Sparkles className="h-4 w-4" />, text: "Your quiz scores improve when you review flashcards first." },
    { icon: <TrendingDown className="h-4 w-4" />, text: "You're spending more time on History than Chemistry." },
    { icon: <Flame className="h-4 w-4" />, text: "Your most productive day this week was Saturday." },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Progress Tracker"
        title="Your progress"
        subtitle="Study time, quiz trends, completion, and AI insights on where to focus."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total study time" value={formatMinutes(totalWeeklyMinutes())} icon={<Clock className="h-5 w-5" />} accent="brand" trend={{ value: "18%", direction: "up" }} />
        <StatCard label="Completed sprints" value={12} icon={<Rocket className="h-5 w-5" />} accent="ai" />
        <StatCard label="Current streak" value="6 days" icon={<Flame className="h-5 w-5" />} accent="warning" />
        <StatCard label="Avg quiz score" value={pct(averageQuizScore())} icon={<Target className="h-5 w-5" />} accent="success" />
        <StatCard label="Assignments done" value={completed} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" />
        <StatCard label="Missed deadlines" value={missed} icon={<CalendarX2 className="h-5 w-5" />} accent="danger" />
        <StatCard label="Strongest" value={strongestSubject()} icon={<TrendingUp className="h-5 w-5" />} accent="success" />
        <StatCard label="Weakest" value={weakestSubject()} icon={<TrendingDown className="h-5 w-5" />} accent="danger" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly Study Time" description="Minutes per day">
          <WeeklyStudyChart data={demoWeeklyStudy} />
        </ChartCard>
        <ChartCard title="Subject Distribution" description="Where your time goes">
          {dist.length ? (
            <SubjectPieChart data={dist} />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No study sessions logged yet.
            </p>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Quiz Score Trend" description="Improvement over time">
          <QuizLineChart data={quizTrend} />
        </ChartCard>
        <Card className="p-5">
          <SectionHeader title="Completion progress" description="Completed vs pending work" />
          <div className="space-y-5 pt-2">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium">Overall completion</span>
                <span className="font-semibold text-brand-600">{pct(completionPct)}</span>
              </div>
              <ProgressBar value={completionPct} tone="brand" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border p-3">
                <p className="text-2xl font-bold text-success">{completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-2xl font-bold text-warning">{pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-2xl font-bold text-danger">{missed}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quiz scores by subject */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Quiz scores by subject</h3>
          <p className="text-sm text-muted-foreground">
            Strongest: <span className="font-semibold text-success">{strongestSubject()}</span> ·
            Weakest: <span className="font-semibold text-danger">{weakestSubject()}</span>
          </p>
        </div>
        <div className="space-y-4">
          {[...demoQuizScores]
            .sort((a, b) => b.score - a.score)
            .map((q) => (
              <div key={q.id} className="flex items-center gap-4">
                <span className="w-32 shrink-0 text-sm font-medium">
                  {subjectById(q.subjectId)?.name}
                </span>
                <ProgressBar
                  value={q.score}
                  showLabel
                  tone={q.score >= 85 ? "success" : q.score >= 70 ? "brand" : "danger"}
                />
              </div>
            ))}
        </div>
      </Card>

      {/* AI insights */}
      <section>
        <SectionHeader
          icon={<Lightbulb className="h-5 w-5" />}
          title="AI insights"
          description="Patterns StudySprint AI noticed in your study habits"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coachInsights.map((ins) => (
            <Card key={ins.text} className="flex items-start gap-3 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                {ins.icon}
              </span>
              <p className="text-sm text-muted-foreground">{ins.text}</p>
            </Card>
          ))}
          {insights.map((ins) => (
            <Card key={ins.label} className="flex items-start gap-3 p-4">
              <Badge tone={insightTone[ins.tone]} className="mt-0.5 shrink-0">
                {ins.label}
              </Badge>
              <p className="text-sm text-muted-foreground">{ins.detail}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
