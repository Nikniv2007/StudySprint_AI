import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { DeadlineBadge } from "@/components/study/Badges";
import { subjectById } from "@/lib/data/demo";
import type { Assignment } from "@/types";

const statusLabel: Record<Assignment["status"], string> = {
  todo: "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

export function DeadlineList({ assignments }: { assignments: Assignment[] }) {
  const sorted = [...assignments]
    .filter((a) => a.status !== "completed")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="divide-y divide-border">
      {sorted.map((a) => {
        const subject = subjectById(a.subjectId);
        return (
          <Link
            key={a.id}
            href="/assignments"
            className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40"
          >
            <span
              className="h-10 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: subject?.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium leading-tight">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                {subject?.name} · {statusLabel[a.status]}
              </p>
            </div>
            <DeadlineBadge dueDate={a.dueDate} />
          </Link>
        );
      })}
    </Card>
  );
}
