# StudySprint AI

**Study smarter. Sprint faster. Stay ahead.**

StudySprint AI turns your assignments, exams, notes, and goals into focused
study sprints, personalized schedules, quizzes, flashcards, and progress
insights. It's built to answer one question: **"What should I study next, and
how should I study it?"**

## Tech Stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** with a custom academic-tech design system
- **Lucide React** icons
- **Recharts** for data visualization
- **localStorage** persistence (SSR-safe wrapper)
- **Mock AI engine** with clean seams for a real provider (see `lib/ai`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the landing page — and
click **Get started** to enter the app dashboard.

## Project Structure

```
app/
  page.tsx                 # Landing page
  (app)/                   # Authenticated app shell (sidebar + topbar)
    dashboard/             # Main control center
    planner/ sprints/ assignments/ flashcards/ quizzes/
    notes/ focus/ progress/ history/ settings/
components/
  layout/   # Sidebar, Topbar, MobileNav, AppShell, marketing nav/footer
  ui/       # Button, Card, Badge, ProgressBar, Modal, Toast
  cards/    # StatCard, FeatureCard, TaskCard, SprintCard, AIRecommendationCard
  charts/   # ChartCard, WeeklyStudyChart (Recharts)
  forms/    # FormInput, FormTextarea, SelectField
  study/    # Headers, Badges, EmptyState, TimerDisplay, ComingSoon
lib/
  ai/       # Mock AI engine (prioritization, flashcards, quiz, summarize)
  data/     # Realistic demo data
  storage/  # Typed localStorage wrapper
  utils/    # cn(), formatting helpers
types/
  index.ts  # Shared domain types
```

## Features

**Part 1 — Foundation:** global layout, design system, reusable components,
polished landing page, populated dashboard, Focus Mode, Progress, History,
and Settings.

**Part 2 — Study tools (all functional, all persisted to localStorage):**

- **Create Study Sprint** — generates a minute-by-minute sprint plan (goal,
  breakdown, materials, reflection) from your subject, goal, length,
  difficulty, study type, deadline, and confidence.
- **AI Study Planner** — builds a prioritized daily schedule with a priority
  explanation, catch-up plan, and study-balance analysis.
- **Assignment & Exam Tracker** — full add / edit / delete / complete with an
  AI priority algorithm (Critical → Low) based on due date, difficulty,
  effort, status, and grade weight.
- **Flashcard Generator** — parses notes into an interactive flip-card deck
  with shuffle, know/review marking, weak-card review, and saved decks.
- **Quiz Generator** — multiple-choice, true/false, short-answer, fill-blank,
  or mixed; instant scoring, per-question explanations, weak-topic analysis,
  and a recommended follow-up sprint.
- **Notes Summarizer** — summary, key points, term definitions, likely exam
  topics, practice questions, and a suggested study sprint.

All AI logic lives in `lib/ai/mock-ai.ts` and is driven by real user inputs
(deadline, difficulty, confidence, subject, study type, available time,
status) so outputs vary intelligently. Persistence flows through
`lib/storage/` (typed `useLocalStorage` / `useCollection` hooks).

## Connecting a real AI provider

All AI logic lives in `lib/ai/index.ts` behind the `callAI()` seam. Replace its
body with a call to your API (e.g. Claude) and the rest of the app works
unchanged.
