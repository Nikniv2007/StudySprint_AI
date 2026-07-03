"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormInput } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { AILoading } from "@/components/ui/Spinner";
import { AIOutput, AISection } from "@/components/study/AIOutput";
import { EmptyState } from "@/components/study/EmptyState";
import { DifficultyBadge } from "@/components/study/Badges";
import { useToast } from "@/components/ui/Toast";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { generateStudySprint, type SprintInput } from "@/lib/ai/mock-ai";
import { demoSubjects } from "@/lib/data/demo";
import { formatMinutes, relativeDue } from "@/lib/utils/format";
import type {
  StudySprint,
  SprintLength,
  Difficulty,
  Confidence,
  StudyType,
} from "@/types";
import {
  Rocket,
  Target,
  ListOrdered,
  Package,
  MessageCircleQuestion,
  Play,
  Save,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";

const lengths: SprintLength[] = [15, 25, 45, 60, 90];

const studyTypeOptions: { label: string; value: StudyType }[] = [
  { label: "Reading", value: "reading" },
  { label: "Practice Problems", value: "practice" },
  { label: "Memorization", value: "memorization" },
  { label: "Essay Writing", value: "essay" },
  { label: "Exam Review", value: "exam-review" },
  { label: "Flashcards", value: "flashcards" },
  { label: "Quiz Practice", value: "quiz-practice" },
  { label: "Project Work", value: "project" },
];

export default function CreateSprintPage() {
  const router = useRouter();
  const { toast } = useToast();
  const saved = useCollection<StudySprint>(STORAGE_KEYS.savedSprints, []);

  const [subject, setSubject] = React.useState("Biology");
  const [customSubject, setCustomSubject] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [length, setLength] = React.useState<SprintLength>(45);
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [studyType, setStudyType] = React.useState<StudyType>("exam-review");
  const [deadline, setDeadline] = React.useState("");
  const [confidence, setConfidence] = React.useState<Confidence>("medium");

  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<StudySprint | null>(null);
  const [error, setError] = React.useState("");

  const resolvedSubject = subject === "Custom" ? customSubject.trim() : subject;

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!resolvedSubject) {
      setError("Please choose or name a subject.");
      return;
    }
    if (!goal.trim()) {
      setError("Add a study goal so the sprint has a clear target.");
      return;
    }
    if (deadline && new Date(deadline) < new Date(new Date().toDateString())) {
      setError("Deadline can't be in the past.");
      return;
    }

    setLoading(true);
    setResult(null);
    const input: SprintInput = {
      subject: resolvedSubject,
      subjectId: demoSubjects.find((s) => s.name === resolvedSubject)?.id,
      goal,
      length,
      difficulty,
      studyType,
      confidence,
      deadline: deadline || undefined,
    };
    try {
      const sprint = await generateStudySprint(input);
      setResult(sprint);
    } finally {
      setLoading(false);
    }
  }

  function saveSprint() {
    if (!result) return;
    saved.add({ ...result, id: result.id });
    toast({
      tone: "success",
      title: "Sprint saved",
      description: "Find it below and in your Study History.",
    });
  }

  function startFocus() {
    toast({
      tone: "info",
      title: "Launching Focus Mode",
      description: `${result?.length}-minute sprint on ${result?.subject}.`,
    });
    router.push("/focus");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create Study Sprint"
        title="Build a focused study sprint"
        subtitle="Tell StudySprint AI what you're working on and get a minute-by-minute plan."
        actions={
          <Button variant="outline" onClick={() => router.push("/focus")}>
            <Play className="h-4 w-4" />
            Open Focus Mode
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ------------------------------------------------ Form */}
        <Card className="p-6 lg:col-span-2">
          <SectionHeader
            icon={<Rocket className="h-5 w-5" />}
            title="Sprint setup"
          />
          <form onSubmit={generate} className="space-y-4">
            <SelectField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={[
                ...demoSubjects.map((s) => ({ label: s.name, value: s.name })),
                { label: "Custom…", value: "Custom" },
              ]}
            />
            {subject === "Custom" && (
              <FormInput
                label="Custom subject"
                placeholder="e.g. Organic Chemistry"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
            )}

            <FormInput
              label="Study goal"
              placeholder="Review Chapter 5 for quiz."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <div>
              <p className="mb-1.5 text-sm font-medium">Sprint length</p>
              <div className="grid grid-cols-5 gap-2">
                {lengths.map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len)}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                      length === len
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-border text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                options={[
                  { label: "Easy", value: "easy" },
                  { label: "Medium", value: "medium" },
                  { label: "Hard", value: "hard" },
                ]}
              />
              <SelectField
                label="Confidence"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as Confidence)}
                options={[
                  { label: "Low", value: "low" },
                  { label: "Medium", value: "medium" },
                  { label: "High", value: "high" },
                ]}
              />
            </div>

            <SelectField
              label="Study type"
              value={studyType}
              onChange={(e) => setStudyType(e.target.value as StudyType)}
              options={studyTypeOptions}
            />

            <FormInput
              label="Deadline (optional)"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              <Sparkles className="h-4 w-4" />
              Generate Sprint
            </Button>
          </form>
        </Card>

        {/* ------------------------------------------------ Output */}
        <div className="lg:col-span-3">
          {loading ? (
            <AILoading label="Designing your study sprint…" />
          ) : result ? (
            <AIOutput
              title={`${result.subject} · ${formatMinutes(result.length)} sprint`}
              actions={<DifficultyBadge difficulty={result.difficulty} />}
            >
              <div className="space-y-5">
                <AISection title="Sprint goal" icon={<Target className="h-4 w-4" />}>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {result.sprintGoal}
                  </p>
                </AISection>

                <AISection
                  title="Sprint breakdown"
                  icon={<ListOrdered className="h-4 w-4" />}
                >
                  <ol className="space-y-2">
                    {result.breakdown.map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-xl border border-border bg-white/70 p-3"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">
                            {step.label}{" "}
                            <span className="font-normal text-muted-foreground">
                              · {formatMinutes(step.minutes)}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </AISection>

                <div className="grid gap-5 sm:grid-cols-2">
                  <AISection
                    title="Materials needed"
                    icon={<Package className="h-4 w-4" />}
                  >
                    <ul className="space-y-1.5">
                      {result.materials.map((m) => (
                        <li
                          key={m}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </AISection>

                  <AISection
                    title="End-of-sprint reflection"
                    icon={<MessageCircleQuestion className="h-4 w-4" />}
                  >
                    <ul className="space-y-1.5">
                      {result.reflectionPrompts.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ai" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </AISection>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button onClick={startFocus}>
                    <Play className="h-4 w-4" />
                    Start Focus Mode
                  </Button>
                  <Button variant="secondary" onClick={saveSprint}>
                    <Save className="h-4 w-4" />
                    Save Sprint
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResult(null);
                      toast({ tone: "info", title: "Cleared — tweak your inputs and generate again." });
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Generate Another
                  </Button>
                </div>
              </div>
            </AIOutput>
          ) : (
            <EmptyState
              icon={<Rocket className="h-7 w-7" />}
              title="Your sprint plan will appear here"
              description="Fill out the form and hit Generate Sprint to get a focused, minute-by-minute study plan."
            />
          )}
        </div>
      </div>

      {/* ------------------------------------------------ Saved sprints */}
      {saved.hydrated && saved.items.length > 0 && (
        <section>
          <SectionHeader
            title="Saved sprints"
            description="Stored locally — also shown in your Study History"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.items.map((s) => (
              <Card key={s.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {s.subject}
                    </p>
                    <p className="font-semibold leading-tight">{s.goal}</p>
                  </div>
                  <Badge tone="brand">{formatMinutes(s.length)}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <DifficultyBadge difficulty={s.difficulty} />
                  {s.deadline && (
                    <span className="text-xs text-muted-foreground">
                      {relativeDue(s.deadline)}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push("/focus")}>
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      saved.remove(s.id);
                      toast({ tone: "info", title: "Sprint removed" });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
