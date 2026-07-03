import { ComingSoon } from "@/components/study/ComingSoon";
import { FileText } from "lucide-react";

export default function NotesPage() {
  return (
    <ComingSoon
      eyebrow="Notes Summarizer"
      title="Notes Summarizer"
      subtitle="Transform messy lecture notes into summaries, key points, and exam review sheets."
      icon={<FileText className="h-7 w-7" />}
      bullets={[
        "Paste raw notes and get a clean summary",
        "Extract key points and definitions automatically",
        "Generate an exam-ready review sheet",
        "Turn summaries into flashcards or quizzes in one click",
      ]}
    />
  );
}
