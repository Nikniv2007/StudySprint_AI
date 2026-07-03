import { Badge } from "@/components/ui/Badge";
import { urgencyOf, relativeDue } from "@/lib/utils/format";
import type { Priority } from "@/types";
import { Flame, Clock, AlertTriangle, CalendarDays } from "lucide-react";

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
