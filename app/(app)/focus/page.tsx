"use client";

import * as React from "react";
import { PageHeader } from "@/components/study/Headers";
import { TimerDisplay } from "@/components/study/TimerDisplay";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { SelectField } from "@/components/forms/SelectField";
import { demoSubjects } from "@/lib/data/demo";
import type { SprintLength } from "@/types";
import { Play, Pause, RotateCcw, Coffee, Volume2 } from "lucide-react";

const lengths: SprintLength[] = [15, 25, 45, 60, 90];

export default function FocusPage() {
  const { toast } = useToast();
  const [length, setLength] = React.useState<SprintLength>(25);
  const [subject, setSubject] = React.useState(demoSubjects[0].id);
  const [remaining, setRemaining] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);

  const total = length * 60;

  // reset timer whenever the length changes and we're not mid-run
  React.useEffect(() => {
    if (!running) setRemaining(length * 60);
  }, [length, running]);

  // tick
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          toast({
            tone: "success",
            title: "Sprint complete! 🎉",
            description: `Great focus. You finished a ${length}-minute sprint.`,
          });
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, length, toast]);

  function toggle() {
    if (remaining === 0) setRemaining(total);
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setRemaining(total);
  }

  const subjectName = demoSubjects.find((s) => s.id === subject)?.name;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Focus Mode"
        title="Focus Mode"
        subtitle="Eliminate distractions. One sprint, full attention."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer */}
        <Card className="flex flex-col items-center justify-center gap-6 p-8 lg:col-span-2">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Studying
            </p>
            <p className="text-lg font-semibold">{subjectName}</p>
          </div>

          <TimerDisplay
            seconds={remaining}
            totalSeconds={total}
            running={running}
            label={running ? "Focusing" : "Ready"}
          />

          <div className="flex items-center gap-3">
            <Button size="lg" onClick={toggle}>
              {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {running ? "Pause" : remaining === 0 ? "Restart" : "Start"}
            </Button>
            <Button size="lg" variant="outline" onClick={reset}>
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </Card>

        {/* Settings */}
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Sprint setup
            </h3>
            <SelectField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={demoSubjects.map((s) => ({ label: s.name, value: s.id }))}
            />
            <div>
              <p className="mb-1.5 text-sm font-medium">Sprint length</p>
              <div className="grid grid-cols-3 gap-2">
                {lengths.map((len) => (
                  <button
                    key={len}
                    onClick={() => setLength(len)}
                    disabled={running}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                      length === len
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-border text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    {len}m
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="space-y-3 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Focus toolkit
            </h3>
            <button className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left text-sm hover:bg-muted/50">
              <Coffee className="h-4 w-4 text-warning" />
              Take a 5-minute break
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left text-sm hover:bg-muted/50">
              <Volume2 className="h-4 w-4 text-brand-600" />
              Ambient focus sounds
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
