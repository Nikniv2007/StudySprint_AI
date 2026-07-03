import { ComingSoon } from "@/components/study/ComingSoon";
import { Layers } from "lucide-react";

export default function FlashcardsPage() {
  return (
    <ComingSoon
      eyebrow="Flashcard Maker"
      title="Flashcard Generator"
      subtitle="Turn vocabulary, formulas, dates, and key concepts into study-ready flashcards."
      icon={<Layers className="h-7 w-7" />}
      bullets={[
        "Generate flashcards from pasted notes or a topic",
        "Flip, shuffle, and spaced-repetition review",
        "Group decks by subject and confidence",
        "Track which cards you keep missing",
      ]}
    />
  );
}
