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
import { AIOutput, AISection } from "@/components/study/AIOutput";
import { EmptyState } from "@/components/study/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { summarizeNotes, type NotesInput } from "@/lib/ai/mock-ai";
import type { NoteSummary, NoteStyle } from "@/types";
import {
  FileText,
  Sparkles,
  AlignLeft,
  ListChecks,
  BookMarked,
  GraduationCap,
  MessageCircleQuestion,
  Rocket,
  Trash2,
} from "lucide-react";

const styleOptions: { label: string; value: NoteStyle }[] = [
  { label: "Simple Summary", value: "simple" },
  { label: "Key Points", value: "key-points" },
  { label: "Study Guide", value: "study-guide" },
  { label: "Exam Review", value: "exam-review" },
  { label: "Confusing Terms", value: "confusing-terms" },
  { label: "Practice Questions", value: "practice-questions" },
];

export default function NotesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const saved = useCollection<NoteSummary>(STORAGE_KEYS.noteSummaries, []);

  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [style, setStyle] = React.useState<NoteStyle>("study-guide");

  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<NoteSummary | null>(null);
  const [error, setError] = React.useState("");

  async function summarize(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (notes.trim().length < 40) {
      setError("Paste at least a few sentences of notes to summarize.");
      return;
    }
    setLoading(true);
    setResult(null);
    const input: NotesInput = { title, notes, style };
    try {
      const summary = await summarizeNotes(input);
      setResult(summary);
      saved.add(summary);
      toast({ tone: "success", title: "Notes summarized", description: "Saved to your workspace." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Notes Summarizer"
        title="Notes Summarizer"
        subtitle="Turn messy lecture notes into summaries, key points, terms, and exam review."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <Card className="p-6 lg:col-span-2 h-fit">
          <SectionHeader icon={<FileText className="h-5 w-5" />} title="Your notes" />
          <form onSubmit={summarize} className="space-y-4">
            <FormInput
              label="Title (optional)"
              placeholder="Bio Lecture 12 — Cellular Respiration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormTextarea
              label="Paste notes"
              placeholder="Lecture notes, textbook paragraphs, handouts, messy notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[220px]"
            />
            <SelectField
              label="Output style"
              value={style}
              onChange={(e) => setStyle(e.target.value as NoteStyle)}
              options={styleOptions}
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              <Sparkles className="h-4 w-4" />
              Summarize Notes
            </Button>
          </form>
        </Card>

        {/* Output */}
        <div className="lg:col-span-3">
          {loading ? (
            <AILoading label="Reading and condensing your notes…" />
          ) : result ? (
            <AIOutput
              title={result.title}
              actions={
                <Badge tone="ai" className="capitalize">
                  {styleOptions.find((s) => s.value === result.style)?.label}
                </Badge>
              }
            >
              <div className="space-y-5">
                <AISection title="Summary" icon={<AlignLeft className="h-4 w-4" />}>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {result.summary}
                  </p>
                </AISection>

                {result.keyPoints.length > 0 && (
                  <AISection title="Key points" icon={<ListChecks className="h-4 w-4" />}>
                    <ul className="space-y-1.5">
                      {result.keyPoints.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </AISection>
                )}

                {result.terms.length > 0 && (
                  <AISection title="Important terms" icon={<BookMarked className="h-4 w-4" />}>
                    <dl className="space-y-2">
                      {result.terms.map((t, i) => (
                        <div key={i} className="rounded-xl border border-border bg-muted/40 p-3">
                          <dt className="text-sm font-semibold">{t.term}</dt>
                          <dd className="text-sm text-muted-foreground">{t.definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </AISection>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <AISection title="Likely exam topics" icon={<GraduationCap className="h-4 w-4" />}>
                    <div className="flex flex-wrap gap-1.5">
                      {result.examTopics.map((t) => (
                        <Badge key={t} tone="warning">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </AISection>

                  <AISection
                    title="Practice questions"
                    icon={<MessageCircleQuestion className="h-4 w-4" />}
                  >
                    <ul className="space-y-1.5">
                      {result.practiceQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ai" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </AISection>
                </div>

                <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
                  <p className="text-sm font-semibold text-brand-700">Suggested study sprint</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{result.suggestedSprint}</p>
                  <Button size="sm" className="mt-3" onClick={() => router.push("/sprints")}>
                    <Rocket className="h-4 w-4" />
                    Create this sprint
                  </Button>
                </div>
              </div>
            </AIOutput>
          ) : (
            <EmptyState
              icon={<FileText className="h-7 w-7" />}
              title="Your study-ready notes will appear here"
              description="Paste your notes and pick an output style to get a clean summary, key points, and exam review."
            />
          )}
        </div>
      </div>

      {/* Saved summaries */}
      {saved.hydrated && saved.items.length > 0 && (
        <section>
          <SectionHeader title="Saved summaries" description="Stored locally in your browser" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.items.slice(0, 6).map((s) => (
              <Card key={s.id} className="flex items-start justify-between gap-3 p-4">
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    setResult(s);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <p className="truncate font-semibold leading-tight">{s.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.summary}</p>
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    saved.remove(s.id);
                    toast({ tone: "info", title: "Summary removed" });
                  }}
                  aria-label="Delete summary"
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
