import { ComingSoon } from "@/components/study/ComingSoon";
import { HelpCircle } from "lucide-react";

export default function QuizzesPage() {
  return (
    <ComingSoon
      eyebrow="Quiz Generator"
      title="Quiz Generator"
      subtitle="Create practice quizzes from your notes, topics, or study guides — instantly."
      icon={<HelpCircle className="h-7 w-7" />}
      bullets={[
        "Multiple choice, true/false, and short answer questions",
        "Instant scoring with explanations",
        "Auto-target your weakest subjects",
        "Save scores to your progress tracker",
      ]}
    />
  );
}
