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

## Roadmap

Part 1 (this build) delivers the foundation: global layout, design system,
reusable components, a polished landing page, a fully populated dashboard, and
functional Focus Mode, Sprints, Assignments, Progress, History, and Settings
pages. The AI Planner, Flashcard, Quiz, and Notes modules have wired
placeholders ready for their feature builds.

## Connecting a real AI provider

All AI logic lives in `lib/ai/index.ts` behind the `callAI()` seam. Replace its
body with a call to your API (e.g. Claude) and the rest of the app works
unchanged.
