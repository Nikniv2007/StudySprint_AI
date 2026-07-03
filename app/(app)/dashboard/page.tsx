"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { StatCard } from "@/components/cards/StatCard";
import { TaskCard } from "@/components/cards/TaskCard";
import { AIRecommendationCard } from "@/components/cards/AIRecommendationCard";
import { DeadlineList } from "@/components/dashboard/DeadlineList";
import { ChartCard } from "@/components/charts/ChartCard";
import { WeeklyStudyChart } from "@/components/charts/WeeklyStudyChart";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { generateRecommendations } from "@/lib/ai/mock-ai";
import {
  demoTasks,
  demoAssignments,
  demoRecommendations,
  demoWeeklyStudy,
  demoProfile,
  demoSubjects,
  totalWeeklyMinutes,
  averageQuizScore,
  strongestSubject,
  weakestSubject,
} from "@/lib/data/demo";
import { formatMinutes, pct } from "@/lib/utils/format";
import type { StudyTask, AIRecommendation, Assignment } from "@/types";
import {
  Rocket,
  Plus,
  HelpCircle,
  Timer,
  Clock,
  CheckCircle2,
  Flame,
  Target,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  Sparkles,
  ListChecks,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items: assignments } = useCollection<Assignment>(
    STORAGE_KEYS.assignments,
    demoAssignments
  );

  const open = assignments.filter((a) => a.status !== "completed");
  const dueSoon = open.filter(
    (a) => new Date(a.dueDate).getTime() - Date.now() < 3 * 864e5
  );
  const overloaded = dueSoon.length >= 3;

  const recommendations = React.useMemo(() => {
    const generated = generateRecommendations(assignments, demoSubjects);
    return generated.length ? generated : demoRecommendations;
  }, [assignments]);

  const nextTask = demoTasks[0];

  function startTask(task: StudyTask) {
    toast({
      tone: "success",
      title: "Sprint started",
      description: `${task.recommendedSprint}-minute focus sprint on ${task.title}.`,
    });
    router.push("/focus");
  }

  function actOnRec(rec: AIRecommendation) {
    toast({ tone: "info", title: "Added to your plan", description: rec.title });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        eyebrow={`${new Date().toLocaleDateString(undefined, { weekday: "long" })} · Let's get to work`}
        title="Welcome back!"
        subtitle={`You have ${open.length} upcoming deadlines and ${recommendations.length} recommended study sprints today.`}
        actions={
          <>
            <Button onClick={() => router.push("/sprints")}>
              <Rocket className="h-4 w-4" />
              New Sprint
            </Button>
            <Button variant="secondary" onClick={() => router.push("/assignments")}>
              <Plus className="h-4 w-4" />
              Add Assignment
            </Button>
            <Button variant="outline" onClick={() => router.push("/quizzes")}>
              <HelpCircle className="h-4 w-4" />
              Generate Quiz
            </Button>
            <Button variant="outline" onClick={() => router.push("/focus")}>
              <Timer className="h-4 w-4" />
              Focus Mode
            </Button>
          </>
        }
      />

      {/* Study load warning */}
      {overloaded && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Heavy workload ahead
            </p>
            <p className="text-sm text-amber-700/90 dark:text-amber-200/80">
              You have {dueSoon.length} deadlines within 3 days. Build a plan now to avoid a last-minute scramble.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => router.push("/planner")}>
            Plan it
          </Button>
        </div>
      )}

      {/* Recommended next sprint */}
      <Card className="flex flex-col items-start gap-4 overflow-hidden bg-brand-gradient p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Rocket className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Recommended next sprint
            </p>
            <p className="text-lg font-bold">{nextTask.title}</p>
            <p className="text-sm text-white/80">
              {formatMinutes(nextTask.estimatedMinutes)} · {nextTask.recommendedSprint}-minute sprint
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => startTask(nextTask)}>
          Start now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>

      {/* Progress snapshot */}
      <section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Study time (week)" value={formatMinutes(totalWeeklyMinutes())} icon={<Clock className="h-5 w-5" />} trend={{ value: "18%", direction: "up" }} accent="brand" />
          <StatCard label="Completed sprints" value={12} icon={<CheckCircle2 className="h-5 w-5" />} hint="+3 this week" accent="success" />
          <StatCard label="Current streak" value={`${demoProfile.streakDays} days`} icon={<Flame className="h-5 w-5" />} hint="Personal best!" accent="warning" />
          <StatCard label="Avg quiz score" value={pct(averageQuizScore())} icon={<Target className="h-5 w-5" />} trend={{ value: "5%", direction: "up" }} accent="ai" />
          <StatCard label="Strongest" value={strongestSubject()} icon={<TrendingUp className="h-5 w-5" />} accent="success" />
          <StatCard label="Needs work" value={weakestSubject()} icon={<TrendingDown className="h-5 w-5" />} accent="danger" />
        </div>
      </section>

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <SectionHeader
              icon={<ListChecks className="h-5 w-5" />}
              title="Today's Study Plan"
              description="Recommended sprints, prioritized for you"
              action={
                <Button variant="ghost" size="sm" onClick={() => router.push("/planner")}>
                  View plan
                </Button>
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {demoTasks.map((task) => (
                <TaskCard key={task.id} task={task} onStart={startTask} />
              ))}
            </div>
          </section>

          <section>
            <ChartCard title="Weekly Study Time" description="Minutes studied per day this week">
              <WeeklyStudyChart data={demoWeeklyStudy} />
            </ChartCard>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <SectionHeader icon={<Sparkles className="h-5 w-5" />} title="AI Recommendations" />
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <AIRecommendationCard key={rec.id} rec={rec} onAct={actOnRec} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              icon={<CalendarClock className="h-5 w-5" />}
              title="Upcoming Deadlines"
              action={
                <Button variant="ghost" size="sm" onClick={() => router.push("/assignments")}>
                  All
                </Button>
              }
            />
            <DeadlineList assignments={assignments} />
          </section>
        </div>
      </div>
    </div>
  );
}
