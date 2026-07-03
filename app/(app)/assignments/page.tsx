"use client";

import { PageHeader } from "@/components/study/Headers";
import { StatCard } from "@/components/cards/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PriorityBadge, DeadlineBadge } from "@/components/study/Badges";
import { useToast } from "@/components/ui/Toast";
import { demoAssignments, subjectById } from "@/lib/data/demo";
import { formatMinutes } from "@/lib/utils/format";
import { Plus, ClipboardList, AlertTriangle, CheckCircle2 } from "lucide-react";

const typeTone = {
  assignment: "brand",
  exam: "danger",
  quiz: "warning",
  project: "ai",
  reading: "muted",
  lab: "success",
} as const;

export default function AssignmentsPage() {
  const { toast } = useToast();

  const open = demoAssignments.filter((a) => a.status !== "completed");
  const urgent = open.filter(
    (a) =>
      new Date(a.dueDate).getTime() - Date.now() < 1000 * 60 * 60 * 24
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tracker"
        title="Assignments & Exams"
        subtitle="Every deadline in one place, sorted by what matters most."
        actions={
          <Button
            onClick={() =>
              toast({
                tone: "info",
                title: "Add assignment",
                description: "The assignment form ships in the next build.",
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add Assignment
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Open items" value={open.length} icon={<ClipboardList className="h-5 w-5" />} accent="brand" />
        <StatCard label="Due within 24h" value={urgent} icon={<AlertTriangle className="h-5 w-5" />} accent="danger" />
        <StatCard label="Completed" value={demoAssignments.length - open.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" />
        <StatCard label="Total est. time" value={formatMinutes(open.reduce((s, a) => s + a.estimatedMinutes, 0))} accent="ai" />
      </div>

      <Card className="overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <span className="col-span-4">Title</span>
          <span className="col-span-2">Subject</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-2">Priority</span>
          <span className="col-span-2">Due</span>
        </div>
        <div className="divide-y divide-border">
          {[...demoAssignments]
            .sort(
              (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            )
            .map((a) => {
              const subject = subjectById(a.subjectId);
              return (
                <div
                  key={a.id}
                  className="grid grid-cols-1 items-center gap-2 px-5 py-4 transition-colors hover:bg-muted/30 md:grid-cols-12 md:gap-4"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <span
                      className="h-8 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: subject?.color }}
                    />
                    <span className="font-medium">{a.title}</span>
                  </div>
                  <span className="col-span-2 text-sm text-muted-foreground">
                    {subject?.name}
                  </span>
                  <div className="col-span-2">
                    <Badge tone={typeTone[a.type]} className="capitalize">
                      {a.type}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <PriorityBadge priority={a.priority} />
                  </div>
                  <div className="col-span-2">
                    <DeadlineBadge dueDate={a.dueDate} />
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}
