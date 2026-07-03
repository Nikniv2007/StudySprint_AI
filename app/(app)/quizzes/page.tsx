"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { AILoading } from "@/components/ui/Spinner";
import { AIOutput } from "@/components/study/AIOutput";
import { EmptyState } from "@/components/study/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  generateQuiz,
  gradeQuiz,
  type QuizInput,
} from "@/lib/ai/mock-ai";
import { demoSubjects } from "@/lib/data/demo";
import { cn } from "@/lib/utils/cn";
import type { Quiz, QuizResult, QuizQuestionType, Difficulty } from "@/types";
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Rocket,
  RefreshCw,
  Trophy,
  Target,
} from "lucide-react";

const typeOptions: { label: string; value: QuizQuestionType | "mixed" }[] = [
  { label: "Multiple Choice", value: "multiple-choice" },
  { label: "True / False", value: "true-false" },
  { label: "Short Answer", value: "short-answer" },
  { label: "Fill in the Blank", value: "fill-blank" },
  { label: "Mixed", value: "mixed" },
];

export default function QuizzesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const results = useCollection<QuizResult>(STORAGE_KEYS.quizResults, []);

  const [topic, setTopic] = React.useState("");
  const [subject, setSubject] = React.useState("Biology");
  const [material, setMaterial] = React.useState("");
  const [count, setCount] = React.useState("5");
  const [type, setType] = React.useState<QuizQuestionType | "mixed">("multiple-choice");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");

  const [loading, setLoading] = React.useState(false);
  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [error, setError] = React.useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!topic.trim()) {
      setError("Enter a topic to build a quiz around.");
      return;
    }
    setLoading(true);
    setQuiz(null);
    setResult(null);
    setAnswers({});
    const input: QuizInput = {
      topic,
      subject,
      material: material || undefined,
      count: Math.max(1, Math.min(20, Number(count) || 5)),
      type,
      difficulty,
    };
    try {
      const q = await generateQuiz(input);
      setQuiz(q);
      toast({ tone: "success", title: `${q.questions.length}-question quiz ready` });
    } finally {
      setLoading(false);
    }
  }

  function submit() {
    if (!quiz) return;
    const unanswered = quiz.questions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === ""
    );
    if (unanswered.length > 0) {
      toast({
        tone: "warning",
        title: "Some questions are blank",
        description: `${unanswered.length} unanswered — they'll be marked incorrect.`,
      });
    }
    const graded = gradeQuiz(quiz, answers);
    setResult(graded);
    results.add(graded);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setQuiz(null);
    setResult(null);
    setAnswers({});
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Quiz Generator"
        title="Quiz Generator"
        subtitle="Create a practice quiz from any topic or your own study material."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <Card className="p-6 lg:col-span-2 h-fit">
          <SectionHeader icon={<HelpCircle className="h-5 w-5" />} title="Quiz setup" />
          <form onSubmit={generate} className="space-y-4">
            <FormInput
              label="Topic"
              placeholder="Cell respiration"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <SelectField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={demoSubjects.map((s) => ({ label: s.name, value: s.name }))}
            />
            <FormTextarea
              label="Study material (optional)"
              placeholder="Paste notes to base questions on…"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Questions"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
              <SelectField
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                options={[
                  { label: "Easy", value: "easy" },
                  { label: "Medium", value: "medium" },
                  { label: "Hard", value: "hard" },
                ]}
              />
            </div>
            <SelectField
              label="Question type"
              value={type}
              onChange={(e) => setType(e.target.value as QuizQuestionType | "mixed")}
              options={typeOptions}
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              <Sparkles className="h-4 w-4" />
              Generate Quiz
            </Button>
          </form>
        </Card>

        {/* Quiz / results */}
        <div className="lg:col-span-3">
          {loading ? (
            <AILoading label="Writing your quiz questions…" />
          ) : result && quiz ? (
            <ResultsView
              quiz={quiz}
              result={result}
              answers={answers}
              onRetry={() => {
                setResult(null);
                setAnswers({});
              }}
              onNew={reset}
              onSprint={() => router.push("/sprints")}
            />
          ) : quiz ? (
            <div className="space-y-4">
              <SectionHeader
                title={`${quiz.topic} quiz`}
                description={`${quiz.questions.length} questions · ${quiz.difficulty}`}
              />
              {quiz.questions.map((q, qi) => (
                <Card key={q.id} className="p-5">
                  <div className="mb-3 flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                      {qi + 1}
                    </span>
                    <p className="font-medium">{q.question}</p>
                  </div>

                  {q.type === "multiple-choice" && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors",
                            answers[q.id] === String(oi)
                              ? "border-brand-500 bg-brand-50"
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={answers[q.id] === String(oi)}
                            onChange={() => setAnswers({ ...answers, [q.id]: String(oi) })}
                            className="h-4 w-4 accent-brand-600"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === "true-false" && (
                    <div className="flex gap-2">
                      {["True", "False"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                          className={cn(
                            "flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors",
                            answers[q.id] === opt
                              ? "border-brand-500 bg-brand-50 text-brand-700"
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {(q.type === "short-answer" || q.type === "fill-blank") && (
                    <FormInput
                      placeholder="Type your answer…"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    />
                  )}
                </Card>
              ))}

              <div className="flex gap-2">
                <Button onClick={submit} className="flex-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Quiz
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RefreshCw className="h-4 w-4" />
                  Start over
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<HelpCircle className="h-7 w-7" />}
              title="Your quiz will appear here"
              description="Enter a topic and generate a quiz, then answer and get instant scoring with explanations."
            />
          )}
        </div>
      </div>

      {/* Recent results */}
      {results.hydrated && results.items.length > 0 && !quiz && (
        <section>
          <SectionHeader title="Recent quiz results" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.slice(0, 6).map((r) => (
              <Card key={r.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold leading-tight">{r.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.subject} · {r.correct}/{r.total} correct
                  </p>
                </div>
                <Badge tone={r.score >= 85 ? "success" : r.score >= 60 ? "warning" : "danger"}>
                  {r.score}%
                </Badge>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ------------------------------- Results view ----------------------------- */
function ResultsView({
  quiz,
  result,
  answers,
  onRetry,
  onNew,
  onSprint,
}: {
  quiz: Quiz;
  result: QuizResult;
  answers: Record<string, string>;
  onRetry: () => void;
  onNew: () => void;
  onSprint: () => void;
}) {
  const tone = result.score >= 85 ? "success" : result.score >= 60 ? "warning" : "danger";
  return (
    <div className="space-y-5">
      <Card className="flex flex-col items-center gap-2 p-6 text-center">
        <span
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl text-white",
            tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-danger"
          )}
        >
          <Trophy className="h-8 w-8" />
        </span>
        <p className="text-4xl font-bold">{result.score}%</p>
        <p className="text-sm text-muted-foreground">
          {result.correct} of {result.total} correct on {quiz.topic}
        </p>
        {result.weakTopics.length > 0 && (
          <div className="mt-1 flex flex-wrap justify-center gap-1.5">
            {result.weakTopics.map((t) => (
              <Badge key={t} tone="danger">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <AIOutput title="Recommended next step" actions={<Target className="h-4 w-4 text-ai" />}>
        <p className="text-sm leading-relaxed text-muted-foreground">{result.recommendation}</p>
        <Button size="sm" className="mt-3" onClick={onSprint}>
          <Rocket className="h-4 w-4" />
          Start review sprint
        </Button>
      </AIOutput>

      <div className="space-y-3">
        <SectionHeader title="Review answers" />
        {quiz.questions.map((q, qi) => {
          const rec = result.answers.find((a) => a.questionId === q.id);
          const correct = rec?.correct;
          const given = answers[q.id];
          const givenLabel =
            q.type === "multiple-choice" && q.options && given !== undefined && given !== ""
              ? q.options[Number(given)]
              : given || "(blank)";
          const correctLabel =
            q.type === "multiple-choice" && q.options && q.correctIndex !== undefined
              ? q.options[q.correctIndex]
              : q.correctAnswer;
          return (
            <Card key={q.id} className="p-4">
              <div className="flex items-start gap-2">
                {correct ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {qi + 1}. {q.question}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted-foreground">Your answer: </span>
                    <span className={correct ? "text-success" : "text-danger"}>
                      {givenLabel}
                    </span>
                  </p>
                  {!correct && correctLabel && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Correct: </span>
                      <span className="text-success">{correctLabel}</span>
                    </p>
                  )}
                  {q.explanation && (
                    <p className="mt-1 text-sm text-muted-foreground">{q.explanation}</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onRetry} className="flex-1">
          <RefreshCw className="h-4 w-4" />
          Retake quiz
        </Button>
        <Button variant="outline" onClick={onNew} className="flex-1">
          New quiz
        </Button>
      </div>
    </div>
  );
}
