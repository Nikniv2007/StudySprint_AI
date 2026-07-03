"use client";

import * as React from "react";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AILoading } from "@/components/ui/Spinner";
import { FlipCard } from "@/components/study/FlipCard";
import { EmptyState } from "@/components/study/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useCollection } from "@/lib/storage/hooks";
import { STORAGE_KEYS } from "@/lib/storage";
import { generateFlashcards, uid, type FlashcardInput } from "@/lib/ai/mock-ai";
import { demoSubjects } from "@/lib/data/demo";
import type { Flashcard, FlashcardDeck, Difficulty } from "@/types";
import {
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Check,
  RotateCcw,
  Save,
  Trash2,
  BookOpen,
} from "lucide-react";

export default function FlashcardsPage() {
  const { toast } = useToast();
  const decks = useCollection<FlashcardDeck>(STORAGE_KEYS.decks, []);

  const [subject, setSubject] = React.useState("Biology");
  const [content, setContent] = React.useState("");
  const [count, setCount] = React.useState("8");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");

  const [loading, setLoading] = React.useState(false);
  const [cards, setCards] = React.useState<Flashcard[]>([]);
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [error, setError] = React.useState("");
  const [reviewOnly, setReviewOnly] = React.useState(false);

  const activeCards = reviewOnly
    ? cards.filter((c) => c.status === "review")
    : cards;
  const current = activeCards[index];

  const known = cards.filter((c) => c.status === "know").length;
  const needReview = cards.filter((c) => c.status === "review").length;

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Paste some notes, vocabulary, or a topic to generate cards.");
      return;
    }
    setLoading(true);
    setCards([]);
    const input: FlashcardInput = {
      subject,
      content,
      count: Math.max(1, Math.min(30, Number(count) || 8)),
      difficulty,
    };
    try {
      const generated = await generateFlashcards(input);
      setCards(generated);
      setIndex(0);
      setFlipped(false);
      setReviewOnly(false);
      toast({ tone: "success", title: `${generated.length} flashcards ready` });
    } finally {
      setLoading(false);
    }
  }

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => {
      const len = activeCards.length;
      return len ? (i + delta + len) % len : 0;
    });
  }

  function mark(status: "know" | "review") {
    if (!current) return;
    setCards((prev) =>
      prev.map((c) => (c.id === current.id ? { ...c, status } : c))
    );
    toast({
      tone: status === "know" ? "success" : "warning",
      title: status === "know" ? "Marked as known" : "Marked for review",
    });
    setTimeout(() => go(1), 150);
  }

  function shuffle() {
    setCards((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    setIndex(0);
    setFlipped(false);
    toast({ tone: "info", title: "Deck shuffled" });
  }

  function saveDeck() {
    if (!cards.length) return;
    decks.add({
      id: uid("deck"),
      title: `${subject} deck`,
      subject,
      difficulty,
      cards,
      createdAt: new Date().toISOString(),
    });
    toast({ tone: "success", title: "Deck saved", description: "Available below to review anytime." });
  }

  function loadDeck(deck: FlashcardDeck) {
    setCards(deck.cards);
    setSubject(deck.subject);
    setDifficulty(deck.difficulty);
    setIndex(0);
    setFlipped(false);
    setReviewOnly(false);
    toast({ tone: "info", title: `Loaded ${deck.title}` });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flashcard Maker"
        title="Flashcard Generator"
        subtitle="Turn notes, vocabulary, and key terms into an interactive flashcard deck."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <Card className="p-6 lg:col-span-2">
          <SectionHeader icon={<Layers className="h-5 w-5" />} title="Create a deck" />
          <form onSubmit={generate} className="space-y-4">
            <SelectField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={demoSubjects.map((s) => ({ label: s.name, value: s.name }))}
            />
            <FormTextarea
              label="Notes, vocabulary, or study guide"
              placeholder={"Mitochondria: the powerhouse of the cell\nPhotosynthesis: converts light to glucose\n..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[160px]"
              hint="Tip: 'Term: definition' lines make the cleanest cards."
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Number of cards"
                type="number"
                min={1}
                max={30}
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
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              <Sparkles className="h-4 w-4" />
              Generate Flashcards
            </Button>
          </form>
        </Card>

        {/* Deck viewer */}
        <div className="lg:col-span-3">
          {loading ? (
            <AILoading label="Building your flashcards…" />
          ) : cards.length === 0 ? (
            <EmptyState
              icon={<Layers className="h-7 w-7" />}
              title="Your flashcards will appear here"
              description="Generate a deck, then flip through, shuffle, and mark cards as known or for review."
            />
          ) : activeCards.length === 0 ? (
            <EmptyState
              icon={<Check className="h-7 w-7" />}
              title="No cards left to review 🎉"
              description="You've cleared your review pile."
              action={
                <Button onClick={() => { setReviewOnly(false); setIndex(0); }}>
                  Back to full deck
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge tone="brand">
                    {index + 1} / {activeCards.length}
                  </Badge>
                  {reviewOnly && <Badge tone="warning">Review mode</Badge>}
                  {current?.status === "know" && <Badge tone="success">Known</Badge>}
                  {current?.status === "review" && <Badge tone="warning">Needs review</Badge>}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="text-success">✓ {known} known</span>
                  <span className="text-warning">↻ {needReview} review</span>
                </div>
              </div>

              <ProgressBar value={((index + 1) / activeCards.length) * 100} />

              {current && (
                <FlipCard
                  card={current}
                  flipped={flipped}
                  onFlip={() => setFlipped((f) => !f)}
                />
              )}

              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Previous">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-1 justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => mark("review")}>
                    <RotateCcw className="h-4 w-4" />
                    Need review
                  </Button>
                  <Button size="sm" onClick={() => mark("know")}>
                    <Check className="h-4 w-4" />
                    Know it
                  </Button>
                </div>
                <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Next">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={shuffle}>
                  <Shuffle className="h-4 w-4" />
                  Shuffle
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReviewOnly((r) => !r);
                    setIndex(0);
                    setFlipped(false);
                  }}
                  disabled={needReview === 0}
                >
                  <BookOpen className="h-4 w-4" />
                  {reviewOnly ? "Full deck" : `Review weak (${needReview})`}
                </Button>
                <Button variant="ghost" size="sm" onClick={saveDeck}>
                  <Save className="h-4 w-4" />
                  Save deck
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved decks */}
      {decks.hydrated && decks.items.length > 0 && (
        <section>
          <SectionHeader title="Saved decks" description="Stored locally in your browser" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.items.map((deck) => (
              <Card key={deck.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold leading-tight">{deck.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {deck.cards.length} cards · {deck.difficulty}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="secondary" onClick={() => loadDeck(deck)}>
                    Study
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      decks.remove(deck.id);
                      toast({ tone: "info", title: "Deck removed" });
                    }}
                    aria-label="Delete deck"
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
