import { Badge } from "@/components/ui/Badge";
import { urgencyOf, relativeDue } from "@/lib/utils/format";
import type {
  Priority,
  PriorityLevel,
  Difficulty,
  AssignmentStatus,
} from "@/types";
import {
  Flame,
  Clock,
  AlertTriangle,
  CalendarDays,
  Zap,
  CircleDot,
  Loader,
  CheckCircle2,
  RotateCcw,
  Circle,
} from "lucide-react";

/* -------------------------------- Priority -------------------------------- */
const priorityConfig: Record<
  Priority,
  { tone: "danger" | "warning" | "muted"; label: string }
> = {
  high: { tone: "danger", label: "High Priority" },
  medium: { tone: "warning", label: "Medium Priority" },
  low: { tone: "muted", label: "Low Priority" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = priorityConfig[priority];
  return (
    <Badge tone={c.tone}>
      {priority === "high" && <Flame className="h-3 w-3" />}
      {c.label}
    </Badge>
  );
}

/* -------------------------------- Deadline -------------------------------- */
const urgencyConfig = {
  urgent: { tone: "danger" as const, Icon: AlertTriangle },
  soon: { tone: "warning" as const, Icon: Clock },
  week: { tone: "brand" as const, Icon: CalendarDays },
  later: { tone: "muted" as const, Icon: CalendarDays },
};

export function DeadlineBadge({ dueDate }: { dueDate: string }) {
  const level = urgencyOf(dueDate);
  const { tone, Icon } = urgencyConfig[level];
  return (
    <Badge tone={tone}>
      <Icon className="h-3 w-3" />
      {relativeDue(dueDate)}
    </Badge>
  );
}

/* ---------------------------- Priority level ------------------------------ */
const priorityLevelConfig: Record<
  PriorityLevel,
  { tone: "danger" | "warning" | "brand" | "muted"; label: string }
> = {
  critical: { tone: "danger", label: "Critical" },
  high: { tone: "warning", label: "High" },
  medium: { tone: "brand", label: "Medium" },
  low: { tone: "muted", label: "Low" },
};

export function PriorityLevelBadge({ level }: { level: PriorityLevel }) {
  const c = priorityLevelConfig[level];
  return (
    <Badge tone={c.tone}>
      {level === "critical" && <Zap className="h-3 w-3" />}
      {c.label}
    </Badge>
  );
}

/* ------------------------------- Difficulty ------------------------------- */
const difficultyConfig: Record<
  Difficulty,
  { tone: "success" | "warning" | "danger"; label: string }
> = {
  easy: { tone: "success", label: "Easy" },
  medium: { tone: "warning", label: "Medium" },
  hard: { tone: "danger", label: "Hard" },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const c = difficultyConfig[difficulty];
  return <Badge tone={c.tone}>{c.label}</Badge>;
}

/* ----------------------------- Assignment status -------------------------- */
const statusConfig: Record<
  AssignmentStatus,
  { tone: "muted" | "brand" | "warning" | "success" | "ai"; label: string; Icon: typeof Circle }
> = {
  "not-started": { tone: "muted", label: "Not Started", Icon: Circle },
  "in-progress": { tone: "brand", label: "In Progress", Icon: Loader },
  "almost-done": { tone: "warning", label: "Almost Done", Icon: CircleDot },
  completed: { tone: "success", label: "Completed", Icon: CheckCircle2 },
  "needs-review": { tone: "ai", label: "Needs Review", Icon: RotateCcw },
};

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  const c = statusConfig[status];
  return (
    <Badge tone={c.tone}>
      <c.Icon className="h-3 w-3" />
      {c.label}
    </Badge>
  );
}
