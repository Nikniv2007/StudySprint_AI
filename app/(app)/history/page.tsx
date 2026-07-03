"use client";

import * as React from "react";
import { PageHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/forms/SelectField";
import { EmptyState } from "@/components/study/EmptyState";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { demoSessions, subjectById, demoSubjects, demoQuizScores } from "@/lib/data/demo";
import { formatMinutes, formatDate } from "@/lib/utils/format";
import type { StudySprint } from "@/types";
import {
  Search,
  Clock,
  Zap,
  History as HistoryIcon,
  Star,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

type Kind = "sprint" | "review" | "practice" | "planning";

interface HistoryItem {
  id: string;
  title: string;
  subjectName?: string;
  subjectId?: string;
  color?: string;
  date: string;
  minutes: number;
  kind: Kind;
  completed: boolean;
  focusRating?: number;
  reflection?: string;
  reviewNext?: string;
  quizScore?: number;
  missed?: boolean;
}

const kindTone: Record<Kind, "brand" | "ai" | "success" | "warning"> = {
  sprint: "brand",
  review: "ai",
  practice: "success",
  planning: "warning",
};

const FILTERS = [
  { label: "All sessions", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Missed / partial", value: "missed" },
  { label: "Sprints", value: "sprint" },
  { label: "Quiz sessions", value: "quiz" },
  { label: "Flashcard sessions", value: "review" },
];

export default function HistoryPage() {
  const { items: saved, hydrated } = useCollection<StudySprint>(
    STORAGE_KEYS.savedSprints,
    []
  );

  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [subjectFilter, setSubjectFilter] = React.useState("all");

  const fromSaved: HistoryItem[] = saved.map((s) => {
    const quiz = demoQuizScores.find((q) => q.subjectId === s.subjectId);
    return {
      id: s.id,
      title: s.goal,
      subjectName: s.subject,
      subjectId: s.subjectId,
      color: subjectById(s.subjectId)?.color ?? "#6366f1",
      date: s.completedAt ?? s.createdAt,
      minutes: s.length,
      kind: "sprint",
      completed: s.taskCompleted ?? s.completed ?? true,
      focusRating: s.focusRating,
      reflection: s.reflectionConfusing || s.reflectionNotes,
      reviewNext: s.reflectionReviewNext,
      quizScore: quiz?.score,
    };
  });

  const fromDemo: HistoryItem[] = demoSessions.map((s) => ({
    id: s.id,
    title: s.title,
    subjectName: subjectById(s.subjectId)?.name,
    subjectId: s.subjectId,
    color: subjectById(s.subjectId)?.color,
    date: s.date,
    minutes: s.durationMinutes,
    kind: s.type,
    completed: true,
    focusRating: s.focusScore ? Math.round(s.focusScore / 20) : undefined,
    quizScore: demoQuizScores.find((q) => q.subjectId === s.subjectId)?.score,
  }));

  const all = [...fromSaved, ...fromDemo].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filtered = all.filter((item) => {
    if (query && !`${item.title} ${item.subjectName}`.toLowerCase().includes(query.toLowerCase()))
      return false;
    if (subjectFilter !== "all" && item.subjectId !== subjectFilter) return false;
    switch (filter) {
      case "completed":
        return item.completed;
      case "missed":
        return !item.completed;
      case "sprint":
        return item.kind === "sprint";
      case "quiz":
        return item.quizScore !== undefined;
      case "review":
        return item.kind === "review";
      default:
        return true;
    }
  });

  const totalMinutes = filtered.reduce((s, x) => s + x.minutes, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study History"
        title="Study history"
        subtitle={`${filtered.length} sessions · ${formatMinutes(totalMinutes)} of focused study.`}
      />

      {/* Filters */}
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search sessions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-300"
          />
        </div>
        <SelectField
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={FILTERS}
          className="sm:w-52"
        />
        <SelectField
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          options={[
            { label: "All subjects", value: "all" },
            ...demoSubjects.map((s) => ({ label: s.name, value: s.id })),
          ]}
          className="sm:w-44"
        />
      </Card>

      {hydrated && filtered.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-7 w-7" />}
          title="No sessions match"
          description={
            all.length === 0
              ? "Complete a sprint in Focus Mode to start building your study history."
              : "Try clearing the search or filters."
          }
          action={
            all.length > 0 ? (
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  setSubjectFilter("all");
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <Zap className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold leading-tight">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.subjectName} · {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={kindTone[item.kind]} className="capitalize">
                        {item.kind}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatMinutes(item.minutes)}
                      </span>
                      {item.completed ? (
                        <Badge tone="success">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge tone="warning">
                          <XCircle className="h-3 w-3" />
                          Partial
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* meta row */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    {item.focusRating !== undefined && (
                      <span className="inline-flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < item.focusRating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </span>
                    )}
                    {item.quizScore !== undefined && (
                      <Badge tone={item.quizScore >= 85 ? "success" : item.quizScore >= 70 ? "brand" : "danger"}>
                        Quiz {item.quizScore}%
                      </Badge>
                    )}
                  </div>

                  {item.reflection && (
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {item.reflection}
                    </p>
                  )}
                  {item.reviewNext && (
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-brand-600">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Review next: {item.reviewNext}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
