"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/study/Headers";
import { TimerDisplay } from "@/components/study/TimerDisplay";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { Confetti } from "@/components/study/Confetti";
import { useToast } from "@/components/ui/Toast";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { getActiveSprint, clearActiveSprint } from "@/lib/storage/store";
import { uid } from "@/lib/ai/mock-ai";
import { demoSubjects } from "@/lib/data/demo";
import type { SprintLength, StudySprint } from "@/types";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Flag,
  ListChecks,
  StickyNote,
  Zap,
  Coffee,
  Timer as TimerIcon,
  Star,
} from "lucide-react";

interface Mode {
  label: string;
  length: SprintLength | number;
  desc: string;
}

const MODES: Mode[] = [
  { label: "Quick Sprint", length: 15, desc: "Fast focus" },
  { label: "Pomodoro", length: 25, desc: "Classic" },
  { label: "Study Block", length: 45, desc: "Deep review" },
  { label: "Deep Work", length: 60, desc: "Full immersion" },
];

const DEFAULT_CHECKLIST = [
  "Review notes",
  "Study core concept",
  "Practice active recall",
  "Complete practice questions",
  "Write reflection",
];

const MOTIVATION = [
  "Every focused minute compounds. You've got this. 💪",
  "Progress, not perfection. Keep going.",
  "Deep focus now, free time later. 🚀",
  "You're building a study streak worth bragging about.",
  "One sprint at a time. Stay present.",
];

export default function FocusPage() {
  const router = useRouter();
  const { toast } = useToast();
  const history = useCollection<StudySprint>(STORAGE_KEYS.savedSprints, []);

  const [length, setLength] = React.useState<number>(25);
  const [customLength, setCustomLength] = React.useState("30");
  const [useCustom, setUseCustom] = React.useState(false);
  const [subject, setSubject] = React.useState(demoSubjects[0].name);
  const [goal, setGoal] = React.useState("Focused study session");

  const [remaining, setRemaining] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [checklist, setChecklist] = React.useState(
    DEFAULT_CHECKLIST.map((label) => ({ label, done: false }))
  );
  const [notes, setNotes] = React.useState("");

  const [finishOpen, setFinishOpen] = React.useState(false);
  const [celebrate, setCelebrate] = React.useState(false);
  const [activeSprintId, setActiveSprintId] = React.useState<string | undefined>();

  // Finish-modal fields
  const [taskCompleted, setTaskCompleted] = React.useState(true);
  const [rating, setRating] = React.useState(4);
  const [confusing, setConfusing] = React.useState("");
  const [reviewNext, setReviewNext] = React.useState("");

  const total = (useCustom ? Math.max(1, Number(customLength) || 30) : length) * 60;
  const motivation = MOTIVATION[Math.floor(remaining / 30) % MOTIVATION.length];

  // Preload a sprint handed off from the Create Sprint page.
  React.useEffect(() => {
    const active = getActiveSprint();
    if (active) {
      setSubject(active.subject);
      setGoal(active.goal);
      setLength(active.length);
      setUseCustom(false);
      setActiveSprintId(active.id);
      setRemaining(active.length * 60);
      clearActiveSprint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset the clock when length changes while idle.
  React.useEffect(() => {
    if (!running) setRemaining(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // Tick.
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          setFinishOpen(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    if (remaining === 0) setRemaining(total);
    setRunning((r) => !r);
  }

  function reset() {
    if (running && !window.confirm("Reset the timer? Your progress this sprint will be lost.")) {
      return;
    }
    setRunning(false);
    setRemaining(total);
    toast({ tone: "info", title: "Timer reset" });
  }

  function toggleStep(i: number) {
    setChecklist((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, done: !s.done } : s))
    );
  }

  const doneCount = checklist.filter((s) => s.done).length;

  function finishSprint() {
    const completed: StudySprint = {
      id: activeSprintId ?? uid("sprint"),
      subject,
      subjectId: demoSubjects.find((s) => s.name === subject)?.id,
      goal,
      length: (useCustom ? 25 : length) as SprintLength,
      difficulty: "medium",
      studyType: "exam-review",
      confidence: "medium",
      sprintGoal: goal,
      breakdown: [],
      materials: [],
      reflectionPrompts: [],
      createdAt: new Date().toISOString(),
      completed: true,
      completedAt: new Date().toISOString(),
      taskCompleted,
      focusRating: rating,
      reflectionConfusing: confusing,
      reflectionReviewNext: reviewNext,
      reflectionNotes: notes,
    };
    history.add(completed);
    setFinishOpen(false);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 200);
    toast({
      tone: "success",
      title: "Sprint complete! 🎉",
      description: "Saved to your Study History.",
    });
    // Reset for the next round.
    setRemaining(total);
    setChecklist(DEFAULT_CHECKLIST.map((label) => ({ label, done: false })));
    setNotes("");
    setConfusing("");
    setReviewNext("");
  }

  return (
    <div className="space-y-8">
      <Confetti fire={celebrate} />

      <PageHeader
        eyebrow="Focus Mode"
        title="Focus Mode"
        subtitle="Distraction-free. One sprint, full attention."
        actions={
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Exit
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* -------------------------------------------------- Timer column */}
        <Card className="flex flex-col items-center justify-center gap-6 p-8 lg:col-span-2">
          <div className="text-center">
            <Badge tone="brand" className="mb-2">
              {subject}
            </Badge>
            <p className="text-lg font-semibold">{goal}</p>
          </div>

          <TimerDisplay
            seconds={remaining}
            totalSeconds={total}
            running={running}
            label={running ? "Focusing" : remaining === 0 ? "Done" : "Ready"}
          />

          <p className="max-w-sm text-center text-sm italic text-muted-foreground">
            {motivation}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={toggle}>
              {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {running ? "Pause" : remaining === 0 ? "Restart" : "Start"}
            </Button>
            <Button size="lg" variant="outline" onClick={reset}>
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                setRunning(false);
                setFinishOpen(true);
              }}
            >
              <Flag className="h-5 w-5" />
              Finish Sprint
            </Button>
          </div>
        </Card>

        {/* -------------------------------------------------- Side column */}
        <div className="space-y-6">
          {/* Timer modes */}
          <Card className="space-y-3 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
              <TimerIcon className="h-4 w-4" /> Timer modes
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.label}
                  onClick={() => {
                    setUseCustom(false);
                    setLength(m.length);
                  }}
                  disabled={running}
                  className={`rounded-xl border p-3 text-left transition-colors disabled:opacity-50 ${
                    !useCustom && length === m.length
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                      : "border-border hover:bg-muted/60"
                  }`}
                >
                  <p className="text-sm font-semibold">{m.length}m</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </button>
              ))}
            </div>
            <div
              className={`rounded-xl border p-3 ${
                useCustom ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-border"
              }`}
            >
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  disabled={running}
                  className="h-4 w-4 accent-brand-600"
                />
                Custom timer
              </label>
              {useCustom && (
                <FormInput
                  type="number"
                  min={1}
                  max={180}
                  value={customLength}
                  onChange={(e) => setCustomLength(e.target.value)}
                  className="mt-2 h-9"
                  hint="Minutes"
                />
              )}
            </div>
          </Card>

          {/* Sprint setup (subject + goal) */}
          <Card className="space-y-3 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
              <Zap className="h-4 w-4" /> Sprint
            </h3>
            <SelectField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={demoSubjects.map((s) => ({ label: s.name, value: s.name }))}
            />
            <FormInput
              label="Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </Card>

          {/* Checklist */}
          <Card className="p-5">
            <h3 className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-brand-600">
              <span className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> Checklist
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {doneCount}/{checklist.length}
              </span>
            </h3>
            <ul className="space-y-1.5">
              {checklist.map((step, i) => (
                <li key={step.label}>
                  <button
                    onClick={() => toggleStep(i)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted/50"
                  >
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        step.done ? "text-success" : "text-muted-foreground/40"
                      }`}
                    />
                    <span
                      className={step.done ? "text-muted-foreground line-through" : ""}
                    >
                      {step.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Notes */}
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
              <StickyNote className="h-4 w-4" /> Scratch notes
            </h3>
            <FormTextarea
              placeholder="Jot ideas, questions, or things to look up later…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </Card>
        </div>
      </div>

      {/* -------------------------------------------------- Finish modal */}
      <Modal
        open={finishOpen}
        onClose={() => setFinishOpen(false)}
        title="Finish sprint"
        description="A quick reflection helps StudySprint AI plan your next session."
      >
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-sm font-medium">Did you complete the task?</p>
            <div className="flex gap-2">
              {[
                { label: "Yes", value: true },
                { label: "Partially", value: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setTaskCompleted(opt.value)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                    taskCompleted === opt.value
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium">Focus rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                  className="rounded-lg p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${
                      n <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <FormTextarea
            label="What was confusing?"
            placeholder="Anything that slowed you down…"
            value={confusing}
            onChange={(e) => setConfusing(e.target.value)}
            className="min-h-[70px]"
          />
          <FormInput
            label="What should you review next?"
            placeholder="e.g. ATP cycle, essay conclusion…"
            value={reviewNext}
            onChange={(e) => setReviewNext(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFinishOpen(false)}>
              Keep studying
            </Button>
            <Button onClick={finishSprint}>
              <CheckCircle2 className="h-4 w-4" />
              Save & finish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
