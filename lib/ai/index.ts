/**
 * Mock AI engine for StudySprint AI.
 *
 * Every function here is a pure, deterministic stand-in for a future LLM call.
 * The signatures are intentionally shaped like async API calls so a real
 * provider (e.g. Claude) can be dropped in behind `callAI` without changing
 * any calling code.
 */

import type {
  Assignment,
  AIRecommendation,
  Flashcard,
  QuizQuestion,
  StudyTask,
  SprintLength,
  Subject,
} from "@/types";
import { priorityRank, urgencyOf } from "@/lib/utils/format";

/* -------------------------------------------------------------------------- */
/* Seam for a real AI backend. Replace the body with a fetch to your API.      */
/* -------------------------------------------------------------------------- */
export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
}

export async function callAI(req: AIRequest): Promise<string> {
  // TODO: swap for real provider, e.g.:
  //   const res = await fetch("/api/ai", { method: "POST", body: JSON.stringify(req) });
  //   return (await res.json()).text;
  await new Promise((r) => setTimeout(r, 350)); // simulate latency
  return `Mock AI response for: ${req.prompt.slice(0, 60)}`;
}

/* --------------------------- Sprint recommendation ------------------------ */
export function recommendSprintLength(minutes: number): SprintLength {
  if (minutes <= 20) return 15;
  if (minutes <= 30) return 25;
  if (minutes <= 50) return 45;
  if (minutes <= 75) return 60;
  return 90;
}

/* ------------------------------ Prioritization ---------------------------- */
/**
 * Scores tasks by urgency + priority + confidence to answer
 * "what should I study next?". Higher score = study sooner.
 */
export function prioritizeTasks(
  tasks: StudyTask[],
  subjects: Subject[]
): StudyTask[] {
  const confBoost: Record<string, number> = { low: 3, medium: 1.5, high: 0 };
  const urgencyBoost = { urgent: 4, soon: 2.5, week: 1, later: 0 } as const;

  return [...tasks].sort((a, b) => {
    const sa =
      urgencyBoost[urgencyOf(a.dueDate)] +
      priorityRank(a.priority) +
      (confBoost[subjectConfidence(a.subjectId, subjects)] ?? 0);
    const sb =
      urgencyBoost[urgencyOf(b.dueDate)] +
      priorityRank(b.priority) +
      (confBoost[subjectConfidence(b.subjectId, subjects)] ?? 0);
    return sb - sa;
  });
}

function subjectConfidence(id: string, subjects: Subject[]): string {
  return subjects.find((s) => s.id === id)?.confidence ?? "medium";
}

/* ------------------------- Recommendation generation ---------------------- */
export function generateRecommendations(
  assignments: Assignment[],
  subjects: Subject[]
): AIRecommendation[] {
  const recs: AIRecommendation[] = [];

  // 1. Nearest urgent + low-confidence subject
  const urgent = [...assignments]
    .filter((a) => a.status !== "completed")
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )[0];
  if (urgent) {
    const subj = subjects.find((s) => s.id === urgent.subjectId);
    recs.push({
      id: "gen-1",
      title: `Prioritize ${subj?.name ?? "this task"}`,
      reason: `"${urgent.title}" is due soonest${
        subj?.confidence === "low" ? " and your confidence here is low" : ""
      }. Tackle it first to reduce risk.`,
      subjectId: urgent.subjectId,
      action: "prioritize",
      intensity: subj?.confidence === "low" ? "high" : "medium",
    });
  }

  // 2. Quick win
  const quick = [...assignments]
    .filter((a) => a.status !== "completed")
    .sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)[0];
  if (quick) {
    recs.push({
      id: "gen-2",
      title: `Knock out ${quick.title}`,
      reason: `Estimated at just ${quick.estimatedMinutes} minutes — an easy win to build momentum.`,
      subjectId: quick.subjectId,
      action: "study",
      intensity: "low",
    });
  }

  return recs;
}

/* ------------------------------- Flashcards ------------------------------- */
export async function generateFlashcards(
  source: string,
  subjectId?: string
): Promise<Flashcard[]> {
  await new Promise((r) => setTimeout(r, 400));
  const lines = source
    .split(/\n|\.|;/)
    .map((l) => l.trim())
    .filter((l) => l.length > 12)
    .slice(0, 8);

  return lines.map((line, i) => {
    const [front, back] = line.includes(":")
      ? line.split(":")
      : [`Key concept ${i + 1}`, line];
    return {
      id: `fc-${i}-${line.length}`,
      front: front.trim() || `Concept ${i + 1}`,
      back: back?.trim() || line,
      subjectId,
    };
  });
}

/* --------------------------------- Quiz ----------------------------------- */
export async function generateQuiz(
  topic: string,
  count = 5
): Promise<QuizQuestion[]> {
  await new Promise((r) => setTimeout(r, 450));
  return Array.from({ length: count }).map((_, i) => ({
    id: `gq-${i}`,
    question: `Sample question ${i + 1} about ${topic}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: i % 4,
    explanation: `This is a mock explanation for question ${i + 1} on ${topic}.`,
  }));
}

/* ------------------------------ Summarizer -------------------------------- */
export interface NoteSummary {
  summary: string;
  keyPoints: string[];
  examReady: string[];
}

export async function summarizeNotes(notes: string): Promise<NoteSummary> {
  await new Promise((r) => setTimeout(r, 500));
  const sentences = notes
    .split(/\.|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  return {
    summary:
      sentences.slice(0, 2).join(". ") ||
      "Your notes were summarized into the key ideas below.",
    keyPoints: sentences.slice(0, 5).map((s) => s.slice(0, 90)),
    examReady: sentences
      .slice(0, 4)
      .map((s, i) => `Q${i + 1}: ${s.slice(0, 70)}?`),
  };
}
