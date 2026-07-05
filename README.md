# StudySprint AI

**Study smarter. Sprint faster. Stay ahead.**

StudySprint AI is an AI-powered study productivity website that helps students
organize assignments, create focused study sprints, generate quizzes and
flashcards, summarize notes, track progress, and build personalized study
schedules. It combines a planner, timer, quiz maker, flashcard generator, notes
summarizer, and progress dashboard into one intelligent study coach.

Open the app and immediately know: **what's due soon, what matters most, what to
study today, how long to study, what you're weak in, what you've completed, and
what to do next.**

---

## ✨ Features

- **AI Study Planner** — builds a prioritized daily schedule from your subjects,
  exams, difficulty, confidence, and available time, with a priority
  explanation, catch-up plan, and study-balance analysis.
- **Study Sprint Builder** — generates a minute-by-minute sprint plan (goal,
  breakdown, materials, reflection) tailored to your inputs.
- **Assignment & Exam Tracker** — full add / edit / delete / complete with an AI
  priority algorithm (Critical → Low) based on due date, difficulty, effort,
  status, and grade weight.
- **Flashcard Generator** — turns notes and terms into an interactive flip-card
  deck with shuffle, know / need-review marking, weak-card review, and saved
  decks.
- **Quiz Generator** — multiple choice, true/false, short answer, fill-in-the-
  blank, or mixed; instant scoring, per-question explanations, weak-topic
  analysis, and a recommended follow-up sprint.
- **Notes Summarizer** — summary, key points, term definitions, likely exam
  topics, practice questions, and a suggested study sprint.
- **Focus Mode** — distraction-free timer with modes (15 / 25 / 45 / 60 / custom),
  sprint goal, subject, checklist, scratch notes, motivational messages, a
  finish-sprint reflection modal, and a confetti celebration.
- **Progress Tracker** — stats, weekly study bar chart, subject-distribution pie
  chart, quiz-score trend line, completion progress, and AI insight cards.
- **Study History** — searchable, filterable timeline of every session with
  focus rating, reflection notes, quiz scores, and follow-up recommendations.
- **Profile & Settings** — profile fields plus AI personalization (study style,
  planner style, reminder style, AI strictness) and dark mode.
- **LocalStorage persistence** — all your data survives refresh, with helpers to
  get / save / update / delete and reset demo data.
- **Mock AI logic** — realistic, input-driven output today; structured for a
  real AI API tomorrow.

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** with a custom academic-tech design system
- **Custom reusable component library** (shadcn-style primitives)
- **Lucide React** icons
- **Recharts** for data visualization
- **LocalStorage** for persistence

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open the app
# http://localhost:3000
```

Click **Get started** on the landing page to enter the dashboard, then explore
the tools from the sidebar. Your data persists locally in the browser.

To create a production build:

```bash
npm run build
npm run start
```

---

## 📄 Screens / Pages

| Page | What it does |
|------|--------------|
| **Landing** | Marketing hero, feature grid, how-it-works, and CTA. |
| **Dashboard** | Control center: study-load warning, recommended next sprint, today's plan, deadlines, AI recommendations, progress snapshot, weekly chart. |
| **Create Study Sprint** | Form → AI-generated sprint plan (goal, breakdown, materials, reflection); save sprints. |
| **AI Study Planner** | Enter subjects/exams/time → prioritized daily schedule, catch-up plan, balance analysis. |
| **Assignment & Exam Tracker** | CRUD for schoolwork with AI priority sorting. |
| **Flashcard Generator** | Notes → interactive flip-card deck with review tools and saved decks. |
| **Quiz Generator** | Topic/material → quiz, answer it, get scored results with explanations. |
| **Notes Summarizer** | Messy notes → summary, key points, terms, exam topics, questions. |
| **Focus Mode** | Distraction-free timer with checklist, notes, and a finish-sprint reflection. |
| **Progress Tracker** | Stats and charts (bar, pie, line, completion) plus AI insights. |
| **Study History** | Searchable, filterable log of all study sessions. |
| **Profile / Settings** | Edit profile, AI personalization, dark mode, reset data. |

---

## 🤖 AI Logic

StudySprint AI currently uses **mock AI logic** in [`lib/ai/mock-ai.ts`](lib/ai/mock-ai.ts).
Every generator (`generateStudySprint`, `generateStudyPlan`, `generateFlashcards`,
`generateQuiz`, `summarizeNotes`, `generateRecommendations`, `calculatePriority`,
`generateProgressInsights`) is **driven by real user inputs** — deadline,
difficulty, confidence, subject, study type, available time, and status — so the
output varies intelligently instead of returning canned text.

All generators funnel through a single `callAI()` seam. To connect a real
provider (OpenAI, Anthropic, etc.), replace the body of `callAI()` with a fetch
to your endpoint and parse the structured response — no calling code changes.

---

## 💾 Data & Persistence

Persistence flows through [`lib/storage/`](lib/storage):

- `useLocalStorage` / `useCollection` — SSR-safe React hooks for state + storage.
- `store.ts` — non-hook helpers: `getData`, `saveData`, `updateData`,
  `deleteData`, and Focus-Mode hand-off helpers.
- `resetAllData()` — clears the workspace; demo data re-seeds on next load.

Persisted data: assignments & exams, study sprints, flashcard decks, quiz
results, study history, profile settings, focus-session reflections, notes
summaries, and planner outputs. The app never crashes on empty storage — every
collection falls back to a safe seed.

---

## 🔮 Future Improvements

- Real AI API integration (OpenAI / Anthropic)
- Google Calendar sync
- PDF upload support (generate cards/quizzes from documents)
- Account login & authentication
- Cloud database (multi-device sync)
- Study groups & shared decks
- Push / email notifications
- Native mobile app version

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE)
file for details.

---

## 👤 Author

**Nirek Sharma**

---

## 📦 Project Structure

```
app/
  page.tsx                 # Landing page
  (app)/                   # Authenticated app shell (sidebar + topbar)
    dashboard/  sprints/  planner/  assignments/
    flashcards/ quizzes/  notes/    focus/
    progress/   history/  settings/
components/
  layout/  theme/  ui/  cards/  charts/  forms/  study/  dashboard/
lib/
  ai/       # Mock AI engine (mock-ai.ts) + barrel
  data/     # Realistic demo data
  storage/  # localStorage hooks + helpers
  utils/    # cn(), formatting
types/
  index.ts  # Shared domain types
```
