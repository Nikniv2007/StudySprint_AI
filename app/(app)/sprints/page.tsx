"use client";

import { useRouter } from "next/navigation";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { SprintCard } from "@/components/cards/SprintCard";
import { StatCard } from "@/components/cards/StatCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { demoSprints, demoSubjects } from "@/lib/data/demo";
import type { Sprint, SprintLength } from "@/types";
import { Rocket, Zap, CheckCircle2, Clock } from "lucide-react";

const lengths: SprintLength[] = [15, 25, 45, 60, 90];

export default function SprintsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const active = demoSprints.filter((s) => s.status !== "completed");
  const completed = demoSprints.filter((s) => s.status === "completed");

  function start(sprint: Sprint) {
    toast({
      tone: "success",
      title: "Sprint started",
      description: `${sprint.length}-minute focus sprint on ${sprint.title}.`,
    });
    router.push("/focus");
  }

  function quickStart(len: SprintLength) {
    toast({
      tone: "info",
      title: `${len}-minute sprint queued`,
      description: "Pick a subject in Focus Mode to begin.",
    });
    router.push("/focus");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Study Sprints"
        title="Focused study sprints"
        subtitle="Break big tasks into focused blocks. Pick a length and go."
        actions={
          <Button onClick={() => router.push("/focus")}>
            <Zap className="h-4 w-4" />
            Start Sprint
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Scheduled" value={active.length} icon={<Clock className="h-5 w-5" />} accent="warning" />
        <StatCard label="Completed today" value={completed.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" />
        <StatCard label="Focus time" value="4h 20m" icon={<Rocket className="h-5 w-5" />} accent="brand" />
        <StatCard label="Avg focus" value="86%" icon={<Zap className="h-5 w-5" />} accent="ai" />
      </div>

      {/* Quick start */}
      <Card className="p-5">
        <SectionHeader title="Quick start a sprint" description="Choose a focused block length" />
        <div className="flex flex-wrap gap-3">
          {lengths.map((len) => (
            <button
              key={len}
              onClick={() => quickStart(len)}
              className="group flex flex-1 min-w-[100px] flex-col items-center gap-1 rounded-2xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-glow"
            >
              <span className="text-2xl font-bold text-brand-600">{len}</span>
              <span className="text-xs font-medium text-muted-foreground">minutes</span>
            </button>
          ))}
        </div>
      </Card>

      <section>
        <SectionHeader title="Scheduled sprints" />
        <div className="grid gap-4 sm:grid-cols-2">
          {active.map((s) => (
            <SprintCard key={s.id} sprint={s} onStart={start} />
          ))}
        </div>
      </section>

      {completed.length > 0 && (
        <section>
          <SectionHeader title="Completed" />
          <div className="grid gap-4 sm:grid-cols-2">
            {completed.map((s) => (
              <SprintCard key={s.id} sprint={s} />
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-muted-foreground">
        {demoSubjects.length} subjects loaded from your demo workspace.
      </p>
    </div>
  );
}
