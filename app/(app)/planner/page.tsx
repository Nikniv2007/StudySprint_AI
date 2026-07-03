import { ComingSoon } from "@/components/study/ComingSoon";
import { CalendarClock } from "lucide-react";

export default function PlannerPage() {
  return (
    <ComingSoon
      eyebrow="AI Study Planner"
      title="AI Study Planner"
      subtitle="A personalized schedule that adapts to your deadlines, workload, and confidence."
      icon={<CalendarClock className="h-7 w-7" />}
      bullets={[
        "Auto-generate a week-long study schedule from your assignments",
        "Rebalance instantly when a deadline moves",
        "Weight sessions by difficulty, confidence, and available time",
        "Drag-and-drop sprints across your calendar",
      ]}
    />
  );
}
