import type { Priority } from "@/types";

/** Format minutes into a compact human string, e.g. 90 -> "1h 30m". */
export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Seconds -> mm:ss for the focus timer. */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/** Relative due-date label from now. */
export function relativeDue(iso: string, now = new Date()): string {
  const due = new Date(iso);
  const diffMs = due.getTime() - now.getTime();
  const diffH = diffMs / (1000 * 60 * 60);
  const diffDays = Math.round(diffH / 24);

  if (diffMs < 0) return "Overdue";
  if (diffH < 12) return "Due tonight";
  if (diffH < 24) return "Due tomorrow";
  if (diffDays <= 6) return `Due in ${diffDays} days`;
  if (diffDays <= 13) return "Due next week";
  return due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Urgency bucket used for deadline coloring. */
export function urgencyOf(
  iso: string,
  now = new Date()
): "urgent" | "soon" | "week" | "later" {
  const diffH = (new Date(iso).getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffH <= 24) return "urgent";
  if (diffH <= 72) return "soon";
  if (diffH <= 24 * 7) return "week";
  return "later";
}

export function priorityRank(p: Priority): number {
  return p === "high" ? 3 : p === "medium" ? 2 : 1;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function pct(n: number): string {
  return `${Math.round(n)}%`;
}
