import Link from "next/link";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { HeroPreview } from "@/components/layout/HeroPreview";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Rocket,
  HelpCircle,
  Layers,
  FileText,
  BarChart3,
  ArrowRight,
  ListChecks,
  BrainCircuit,
  Timer,
  Star,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI Study Planner",
    description:
      "Creates personalized study schedules based on deadlines, workload, difficulty, confidence, and the time you actually have.",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Study Sprint Builder",
    description:
      "Breaks big academic tasks into focused 15, 25, 45, 60, or 90-minute study sessions you can actually finish.",
  },
  {
    icon: <HelpCircle className="h-6 w-6" />,
    title: "Quiz Generator",
    description:
      "Creates practice quizzes from your notes, topics, study guides, or any pasted content — instantly.",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Flashcard Maker",
    description:
      "Turns vocabulary, formulas, dates, and key concepts into clean study flashcards ready for review.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Notes Summarizer",
    description:
      "Transforms messy lecture notes into summaries, study guides, key points, and exam review sheets.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Progress Tracking",
    description:
      "Tracks study time, completed sprints, quiz scores, weak subjects, streaks, and productivity trends.",
  },
];

const steps = [
  {
    icon: <ListChecks className="h-6 w-6" />,
    title: "Enter Your Workload",
    description:
      "Add subjects, assignments, exams, deadlines, notes, and how much time you have to study.",
  },
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "AI Builds a Plan",
    description:
      "StudySprint AI prioritizes tasks by urgency, difficulty, confidence, and importance — automatically.",
  },
  {
    icon: <Timer className="h-6 w-6" />,
    title: "Start Focused Sprints",
    description:
      "Follow structured study blocks, test yourself with quizzes and flashcards, and track your progress.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-hero-gradient pb-24 pt-32 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.25),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-electric-400" />
              AI-powered study productivity
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Study Smarter.
              <br />
              Sprint Faster.
              <br />
              <span className="text-gradient">Stay Ahead.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              StudySprint AI turns your assignments, exams, notes, and goals into
              focused study sessions, personalized schedules, quizzes,
              flashcards, and progress insights.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sprints">
                <Button size="lg" className="w-full sm:w-auto">
                  <Rocket className="h-5 w-5" />
                  Start a Study Sprint
                </Button>
              </Link>
              <Link href="/planner">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/25 text-white hover:bg-white/10 sm:w-auto"
                >
                  Build My Study Plan
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {["#6366f1", "#a855f7", "#38bdf8", "#22c55e"].map((c) => (
                    <span
                      key={c}
                      className="h-7 w-7 rounded-full border-2 border-navy-900"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="ml-1">Loved by focused students</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="animate-fade-in [animation-delay:120ms]">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Everything you need
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One platform for your entire academic life
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stop juggling six apps. StudySprint AI plans, tests, summarizes, and
            tracks — so you can just focus and study.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- How it works */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From chaos to a clear plan in three steps
            </h2>
          </div>
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent md:block" />
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                  {s.icon}
                </div>
                <div className="mx-auto mt-4 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-600 shadow-soft ring-1 ring-brand-100">
                  {i + 1}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-hero-gradient px-8 py-16 text-center text-white sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.25),transparent_50%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stop guessing what to study next.
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Let StudySprint AI organize your academic life — deadlines, sprints,
              quizzes, and progress, all in one focused place.
            </p>
            <Link href="/sprints" className="mt-8 inline-block">
              <Button size="lg">
                Create My First Sprint
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
