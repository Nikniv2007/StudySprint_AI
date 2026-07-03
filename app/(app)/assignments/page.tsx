"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/study/Headers";
import { StatCard } from "@/components/cards/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { EmptyState } from "@/components/study/EmptyState";
import {
  DeadlineBadge,
  PriorityLevelBadge,
  StatusBadge,
  DifficultyBadge,
} from "@/components/study/Badges";
import { useToast } from "@/components/ui/Toast";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { calculatePriority, priorityWeight, uid } from "@/lib/ai/mock-ai";
import { demoAssignments, subjectById, demoSubjects } from "@/lib/data/demo";
import { formatMinutes } from "@/lib/utils/format";
import type {
  Assignment,
  AssignmentType,
  AssignmentStatus,
  Difficulty,
  PriorityLevel,
} from "@/types";
import {
  Plus,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Rocket,
  Pencil,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

const typeOptions: { label: string; value: AssignmentType }[] = [
  { label: "Homework", value: "homework" },
  { label: "Essay", value: "essay" },
  { label: "Project", value: "project" },
  { label: "Quiz", value: "quiz" },
  { label: "Exam", value: "exam" },
  { label: "Reading", value: "reading" },
  { label: "Lab", value: "lab" },
  { label: "Presentation", value: "presentation" },
];

const statusOptions: { label: string; value: AssignmentStatus }[] = [
  { label: "Not Started", value: "not-started" },
  { label: "In Progress", value: "in-progress" },
  { label: "Almost Done", value: "almost-done" },
  { label: "Completed", value: "completed" },
  { label: "Needs Review", value: "needs-review" },
];

type Draft = Omit<Assignment, "id" | "createdAt">;

function emptyDraft(): Draft {
  return {
    title: "",
    subjectId: demoSubjects[0].id,
    type: "homework",
    dueDate: "",
    estimatedMinutes: 45,
    difficulty: "medium",
    status: "not-started",
    gradeWeight: 10,
    notes: "",
  };
}

export default function AssignmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, add, update, remove, hydrated } = useCollection<Assignment>(
    STORAGE_KEYS.assignments,
    demoAssignments
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Draft>(emptyDraft());
  const [formError, setFormError] = React.useState("");
  const [sortByPriority, setSortByPriority] = React.useState(true);

  const open = items.filter((a) => a.status !== "completed");
  const urgent = open.filter((a) => new Date(a.dueDate).getTime() - Date.now() < 864e5).length;

  const withPriority = items.map((a) => ({ a, priority: calculatePriority(a) }));
  const sorted = [...withPriority].sort((x, y) => {
    if (sortByPriority) {
      const d = priorityWeight(y.priority) - priorityWeight(x.priority);
      if (d !== 0) return d;
    }
    return new Date(x.a.dueDate).getTime() - new Date(y.a.dueDate).getTime();
  });

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(a: Assignment) {
    setEditingId(a.id);
    setDraft({
      title: a.title,
      subjectId: a.subjectId,
      type: a.type,
      dueDate: a.dueDate,
      estimatedMinutes: a.estimatedMinutes,
      difficulty: a.difficulty,
      status: a.status,
      gradeWeight: a.gradeWeight,
      notes: a.notes,
    });
    setFormError("");
    setModalOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!draft.dueDate) {
      setFormError("Please set a due date.");
      return;
    }
    if (editingId) {
      update(editingId, draft);
      toast({ tone: "success", title: "Assignment updated" });
    } else {
      add({ ...draft, id: uid("assign"), createdAt: new Date().toISOString() });
      toast({ tone: "success", title: "Assignment added" });
    }
    setModalOpen(false);
  }

  function markComplete(a: Assignment) {
    update(a.id, { status: "completed" });
    toast({ tone: "success", title: "Marked complete", description: a.title });
  }

  function del(a: Assignment) {
    remove(a.id);
    toast({ tone: "info", title: "Assignment deleted", description: a.title });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tracker"
        title="Assignments & Exams"
        subtitle="Every deadline in one place, auto-sorted by AI priority."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setSortByPriority((s) => !s)}
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortByPriority ? "Priority order" : "Due-date order"}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Assignment
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Open items" value={open.length} icon={<ClipboardList className="h-5 w-5" />} accent="brand" />
        <StatCard label="Due within 24h" value={urgent} icon={<AlertTriangle className="h-5 w-5" />} accent="danger" />
        <StatCard label="Completed" value={items.length - open.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" />
        <StatCard label="Open workload" value={formatMinutes(open.reduce((s, a) => s + a.estimatedMinutes, 0))} accent="ai" />
      </div>

      {hydrated && items.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-7 w-7" />}
          title="No assignments yet"
          description="Add your first assignment or exam to start tracking deadlines and priorities."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Add Assignment</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map(({ a, priority }) => {
            const subject = subjectById(a.subjectId);
            return (
              <Card key={a.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1 h-9 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: subject?.color }}
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {subject?.name} · <span className="capitalize">{a.type}</span>
                      </p>
                      <h3 className="font-semibold leading-tight">{a.title}</h3>
                    </div>
                  </div>
                  <PriorityLevelBadge level={priority as PriorityLevel} />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <DeadlineBadge dueDate={a.dueDate} />
                  <StatusBadge status={a.status} />
                  <DifficultyBadge difficulty={a.difficulty} />
                  <Badge tone="muted">{formatMinutes(a.estimatedMinutes)}</Badge>
                  {a.gradeWeight ? <Badge tone="muted">{a.gradeWeight}% grade</Badge> : null}
                </div>

                {a.notes && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.notes}</p>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {a.status !== "completed" && (
                    <Button size="sm" variant="secondary" onClick={() => markComplete(a)}>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast({
                        tone: "info",
                        title: "Sprint from assignment",
                        description: `Prefilled a sprint for ${a.title}.`,
                      });
                      router.push("/sprints");
                    }}
                  >
                    <Rocket className="h-4 w-4" />
                    Sprint
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(a)} aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => del(a)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* -------------------------------------------------- Add / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit assignment" : "Add assignment"}
        description="Track homework, essays, projects, quizzes, and exams."
        className="max-w-2xl"
      >
        <form onSubmit={submit} className="space-y-4">
          <FormInput
            label="Title"
            placeholder="Biology Chapter 4 Quiz"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Subject"
              value={draft.subjectId}
              onChange={(e) => setDraft({ ...draft, subjectId: e.target.value })}
              options={demoSubjects.map((s) => ({ label: s.name, value: s.id }))}
            />
            <SelectField
              label="Type"
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as AssignmentType })}
              options={typeOptions}
            />
            <FormInput
              label="Due date"
              type="date"
              value={draft.dueDate ? draft.dueDate.slice(0, 10) : ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  dueDate: e.target.value ? new Date(e.target.value).toISOString() : "",
                })
              }
            />
            <FormInput
              label="Estimated time (min)"
              type="number"
              min={5}
              value={draft.estimatedMinutes}
              onChange={(e) => setDraft({ ...draft, estimatedMinutes: Number(e.target.value) })}
            />
            <SelectField
              label="Difficulty"
              value={draft.difficulty}
              onChange={(e) => setDraft({ ...draft, difficulty: e.target.value as Difficulty })}
              options={[
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" },
              ]}
            />
            <SelectField
              label="Status"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as AssignmentStatus })}
              options={statusOptions}
            />
            <FormInput
              label="Grade weight (%)"
              type="number"
              min={0}
              max={100}
              value={draft.gradeWeight ?? 0}
              onChange={(e) => setDraft({ ...draft, gradeWeight: Number(e.target.value) })}
            />
          </div>
          <FormTextarea
            label="Notes"
            placeholder="Topics to focus on, requirements, etc."
            value={draft.notes ?? ""}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            className="min-h-[80px]"
          />

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{formError}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Save changes" : "Add assignment"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
