"use client";

import { useRouter } from "next/navigation";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { StatCard } from "@/components/cards/StatCard";
import { TaskCard } from "@/components/cards/TaskCard";
import { AIRecommendationCard } from "@/components/cards/AIRecommendationCard";
import { DeadlineList } from "@/components/dashboard/DeadlineList";
import { ChartCard } from "@/components/charts/ChartCard";
import { WeeklyStudyChart } from "@/components/charts/WeeklyStudyChart";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  demoTasks,
  demoAssignments,
  demoRecommendations,
  demoWeeklyStudy,
  demoProfile,
  totalWeeklyMinutes,
  averageQuizScore,
  strongestSubject,
  weakestSubject,
} from "@/lib/data/demo";
import { formatMinutes, pct } from "@/lib/utils/format";
import type { StudyTask, AIRecommendation } from "@/types";
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
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const upcomingCount = demoAssignments.filter(
    (a) => a.status !== "completed"
  ).length;

  function startTask(task: StudyTask) {
    toast({
      tone: "success",
      title: "Sprint started",
      description: `${task.recommendedSprint}-minute focus sprint on ${task.title}.`,
    });
    router.push("/focus");
  }

  function actOnRec(rec: AIRecommendation) {
    toast({
      tone: "info",
      title: "Added to your plan",
      description: rec.title,
    });
  }

  return (
    <div className="space-y-8">
      {/* --------------------------------------------------------- Header */}
      <PageHeader
        eyebrow={`${new Date().toLocaleDateString(undefined, {
          weekday: "long",
        })} · Let's get to work`}
        title="Welcome back!"
        subtitle={`You have ${upcomingCount} upcoming deadlines and 2 recommended study sprints today.`}
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

      {/* ----------------------------------------------- Progress snapshot */}
      <section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Study time (week)"
            value={formatMinutes(totalWeeklyMinutes())}
            icon={<Clock className="h-5 w-5" />}
            trend={{ value: "18%", direction: "up" }}
            accent="brand"
          />
          <StatCard
            label="Completed sprints"
            value={12}
            icon={<CheckCircle2 className="h-5 w-5" />}
            hint="+3 this week"
            accent="success"
          />
          <StatCard
            label="Current streak"
            value={`${demoProfile.streakDays} days`}
            icon={<Flame className="h-5 w-5" />}
            hint="Personal best!"
            accent="warning"
          />
          <StatCard
            label="Avg quiz score"
            value={pct(averageQuizScore())}
            icon={<Target className="h-5 w-5" />}
            trend={{ value: "5%", direction: "up" }}
            accent="ai"
          />
          <StatCard
            label="Strongest"
            value={strongestSubject()}
            icon={<TrendingUp className="h-5 w-5" />}
            accent="success"
          />
          <StatCard
            label="Needs work"
            value={weakestSubject()}
            icon={<TrendingDown className="h-5 w-5" />}
            accent="danger"
          />
        </div>
      </section>

      {/* ------------------------------------------- Main two-column grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* left / main column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Today's study plan */}
          <section>
            <SectionHeader
              icon={<ListChecks className="h-5 w-5" />}
              title="Today's Study Plan"
              description="Recommended sprints, prioritized for you"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/planner")}
                >
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

          {/* Weekly chart */}
          <section>
            <ChartCard
              title="Weekly Study Time"
              description="Minutes studied per day this week"
            >
              <WeeklyStudyChart data={demoWeeklyStudy} />
            </ChartCard>
          </section>
        </div>

        {/* right column */}
        <div className="space-y-8">
          {/* AI recommendations */}
          <section>
            <SectionHeader
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Recommendations"
            />
            <div className="space-y-4">
              {demoRecommendations.map((rec) => (
                <AIRecommendationCard key={rec.id} rec={rec} onAct={actOnRec} />
              ))}
            </div>
          </section>

          {/* Upcoming deadlines */}
          <section>
            <SectionHeader
              icon={<CalendarClock className="h-5 w-5" />}
              title="Upcoming Deadlines"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/assignments")}
                >
                  All
                </Button>
              }
            />
            <DeadlineList assignments={demoAssignments} />
          </section>
        </div>
      </div>
    </div>
  );
}
