"use client";

import * as React from "react";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { AILoading } from "@/components/ui/Spinner";
import { AIOutput, AISection } from "@/components/study/AIOutput";
import { EmptyState } from "@/components/study/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useLocalStorage } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  generateStudyPlan,
  type PlannerInput,
  type PlannerSubjectInput,
} from "@/lib/ai/mock-ai";
import { formatMinutes } from "@/lib/utils/format";
import type { StudyPlan, PlannerStyle, Difficulty, Confidence, SprintLength } from "@/types";
import {
  CalendarClock,
  Plus,
  Trash2,
  Sparkles,
  CalendarDays,
  ListChecks,
  Scale,
  Lightbulb,
  Clock,
} from "lucide-react";

interface SubjectRow extends PlannerSubjectInput {
  id: string;
}

const styleOptions: { label: string; value: PlannerStyle }[] = [
  { label: "Relaxed", value: "relaxed" },
  { label: "Balanced", value: "balanced" },
  { label: "Aggressive", value: "aggressive" },
  { label: "Exam Cram", value: "exam-cram" },
];

let rowSeq = 0;
function newRow(name = ""): SubjectRow {
  return {
    id: `row-${++rowSeq}`,
    name,
    difficulty: "medium",
    confidence: "medium",
    hasExam: false,
  };
}

const balanceTone = {
  light: "success",
  balanced: "brand",
  overloaded: "danger",
} as const;

export default function PlannerPage() {
  const { toast } = useToast();
  const [, savePlan] = useLocalStorage<StudyPlan | null>(STORAGE_KEYS.plans, null);

  const [rows, setRows] = React.useState<SubjectRow[]>([
    { ...newRow("Biology"), difficulty: "hard", confidence: "low", hasExam: true, examInDays: 2 },
    { ...newRow("Math"), difficulty: "medium", confidence: "high" },
    { ...newRow("History"), difficulty: "easy", confidence: "medium" },
  ]);
  const [assignments, setAssignments] = React.useState(
    "English essay draft (Fri)\nChemistry lab report (Mon)"
  );
  const [availablePerDay, setAvailablePerDay] = React.useState("120");
  const [sessionLength, setSessionLength] = React.useState<SprintLength>(45);
  const [breakPref, setBreakPref] = React.useState<"short" | "medium" | "long">("medium");
  const [style, setStyle] = React.useState<PlannerStyle>("balanced");
  const [goal, setGoal] = React.useState("");
  const [startTime, setStartTime] = React.useState("16:00");
  const [days, setDays] = React.useState("5");

  const [loading, setLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<StudyPlan | null>(null);
  const [error, setError] = React.useState("");

  function updateRow(id: string, patch: Partial<SubjectRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const named = rows.filter((r) => r.name.trim());
    if (named.length === 0) {
      setError("Add at least one subject to build a plan.");
      return;
    }
    setLoading(true);
    setPlan(null);
    const input: PlannerInput = {
      subjects: named.map((r) => ({
        name: r.name.trim(),
        difficulty: r.difficulty,
        confidence: r.confidence,
        hasExam: r.hasExam,
        examInDays: r.hasExam ? r.examInDays : undefined,
      })),
      assignments,
      availableMinutesPerDay: Math.max(30, Number(availablePerDay) || 120),
      sessionLength,
      breakPreference: breakPref,
      style,
      goal,
      startTime,
      days: Math.max(1, Math.min(7, Number(days) || 5)),
    };
    try {
      const result = await generateStudyPlan(input);
      setPlan(result);
      savePlan(result);
      toast({ tone: "success", title: "Study plan ready", description: "Saved to your workspace." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI Study Planner"
        title="Build my study plan"
        subtitle="Enter your subjects, exams, and available time. StudySprint AI schedules the week."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <Card className="p-6 lg:col-span-2">
          <form onSubmit={generate} className="space-y-5">
            <div>
              <SectionHeader
                icon={<CalendarClock className="h-5 w-5" />}
                title="Subjects & exams"
                action={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setRows((r) => [...r, newRow()])}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                }
              />
              <div className="space-y-3">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="space-y-2 rounded-xl border border-border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FormInput
                        placeholder="Subject name"
                        value={row.name}
                        onChange={(e) => updateRow(row.id, { name: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setRows((r) => r.filter((x) => x.id !== row.id))}
                        className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-danger"
                        aria-label="Remove subject"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <SelectField
                        value={row.difficulty}
                        onChange={(e) =>
                          updateRow(row.id, { difficulty: e.target.value as Difficulty })
                        }
                        options={[
                          { label: "Easy", value: "easy" },
                          { label: "Medium", value: "medium" },
                          { label: "Hard", value: "hard" },
                        ]}
                      />
                      <SelectField
                        value={row.confidence}
                        onChange={(e) =>
                          updateRow(row.id, { confidence: e.target.value as Confidence })
                        }
                        options={[
                          { label: "Low confidence", value: "low" },
                          { label: "Med confidence", value: "medium" },
                          { label: "High confidence", value: "high" },
                        ]}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={row.hasExam}
                          onChange={(e) => updateRow(row.id, { hasExam: e.target.checked })}
                          className="h-4 w-4 rounded border-input accent-brand-600"
                        />
                        Upcoming exam
                      </label>
                      {row.hasExam && (
                        <FormInput
                          type="number"
                          min={0}
                          placeholder="in days"
                          value={row.examInDays ?? ""}
                          onChange={(e) =>
                            updateRow(row.id, { examInDays: Number(e.target.value) })
                          }
                          className="h-9 max-w-[110px]"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <FormTextarea
              label="Assignments (one per line)"
              value={assignments}
              onChange={(e) => setAssignments(e.target.value)}
              className="min-h-[80px]"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Study time / day (min)"
                type="number"
                value={availablePerDay}
                onChange={(e) => setAvailablePerDay(e.target.value)}
              />
              <SelectField
                label="Session length"
                value={String(sessionLength)}
                onChange={(e) => setSessionLength(Number(e.target.value) as SprintLength)}
                options={[15, 25, 45, 60, 90].map((n) => ({
                  label: `${n} min`,
                  value: String(n),
                }))}
              />
              <SelectField
                label="Break preference"
                value={breakPref}
                onChange={(e) => setBreakPref(e.target.value as typeof breakPref)}
                options={[
                  { label: "Short breaks", value: "short" },
                  { label: "Medium breaks", value: "medium" },
                  { label: "Long breaks", value: "long" },
                ]}
              />
              <SelectField
                label="Planner style"
                value={style}
                onChange={(e) => setStyle(e.target.value as PlannerStyle)}
                options={styleOptions}
              />
              <FormInput
                label="Start time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <FormInput
                label="Days to plan"
                type="number"
                min={1}
                max={7}
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>

            <FormInput
              label="Study goal (optional)"
              placeholder="Ace finals week"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              <Sparkles className="h-4 w-4" />
              Generate Study Plan
            </Button>
          </form>
        </Card>

        {/* Output */}
        <div className="lg:col-span-3">
          {loading ? (
            <AILoading label="Scheduling your week…" />
          ) : plan ? (
            <div className="space-y-6">
              <AIOutput
                title={`${styleOptions.find((s) => s.value === plan.style)?.label} plan`}
                actions={
                  <Badge tone={balanceTone[plan.balance.status]} className="capitalize">
                    {plan.balance.status}
                  </Badge>
                }
              >
                <AISection title="Why this plan" icon={<Lightbulb className="h-4 w-4" />}>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {plan.priorityExplanation}
                  </p>
                </AISection>
              </AIOutput>

              {/* Daily schedule */}
              <Card className="p-5">
                <SectionHeader
                  icon={<CalendarDays className="h-5 w-5" />}
                  title="Daily schedule"
                  description={`~${plan.balance.dailyAverage} min/day · ${formatMinutes(
                    plan.balance.totalMinutes
                  )} total`}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {plan.days.map((day) => (
                    <div key={day.day} className="rounded-xl border border-border p-4">
                      <p className="mb-3 font-semibold">{day.day}</p>
                      {day.blocks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Rest day</p>
                      ) : (
                        <ul className="space-y-2">
                          {day.blocks.map((b, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm">
                              <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
                                <Clock className="h-3 w-3" />
                                {b.start}
                              </span>
                              <span className="font-medium">{b.activity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Catch-up */}
              <Card className="p-5">
                <SectionHeader
                  icon={<ListChecks className="h-5 w-5" />}
                  title="Catch-up plan"
                  description="How to triage a heavy workload"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <CatchUpList title="Must do" tone="danger" items={plan.catchUp.mustDo} />
                  <CatchUpList title="Deep study" tone="brand" items={plan.catchUp.deepStudy} />
                  <CatchUpList title="Quick review" tone="warning" items={plan.catchUp.quickReview} />
                  <CatchUpList title="Can delay" tone="muted" items={plan.catchUp.canDelay} />
                </div>
              </Card>

              {/* Balance */}
              <Card className="flex items-start gap-3 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Scale className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Study balance</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {plan.balance.message}
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <EmptyState
              icon={<CalendarClock className="h-7 w-7" />}
              title="Your personalized schedule will appear here"
              description="Add your subjects and time, then generate a full study plan with priorities and balance."
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CatchUpList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "danger" | "brand" | "warning" | "muted";
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <Badge tone={tone} className="mb-2">
        {title}
      </Badge>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here — you&apos;re on track.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
