import type {
  Subject,
  Assignment,
  StudyTask,
  Sprint,
  StudySession,
  QuizScore,
  AIRecommendation,
  WeeklyStudyPoint,
  UserProfile,
  Flashcard,
  QuizQuestion,
} from "@/types";

/* -------------------------------------------------------------------------- */
/* Date helpers — demo deadlines are relative to "now" so they always look     */
/* fresh regardless of when the app is opened.                                 */
/* -------------------------------------------------------------------------- */
function hoursFromNow(h: number): string {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d.toISOString();
}
function daysFromNow(d: number): string {
  return hoursFromNow(d * 24);
}
function daysAgo(d: number): string {
  return hoursFromNow(-d * 24);
}

/* --------------------------------- Subjects ------------------------------- */
export const demoSubjects: Subject[] = [
  { id: "bio", name: "Biology", color: "#22c55e", confidence: "low" },
  { id: "math", name: "Math", color: "#6366f1", confidence: "high" },
  { id: "eng", name: "English", color: "#a855f7", confidence: "medium" },
  { id: "hist", name: "History", color: "#f59e0b", confidence: "high" },
  { id: "chem", name: "Chemistry", color: "#ef4444", confidence: "low" },
  { id: "cs", name: "Computer Science", color: "#0ea5e9", confidence: "medium" },
  { id: "fin", name: "Finance", color: "#14b8a6", confidence: "medium" },
  { id: "phys", name: "Physics", color: "#ec4899", confidence: "low" },
];

export function subjectById(id?: string): Subject | undefined {
  return demoSubjects.find((s) => s.id === id);
}

/* ------------------------------- Assignments ------------------------------ */
export const demoAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Biology Chapter 4 Quiz",
    subjectId: "bio",
    type: "quiz",
    dueDate: daysFromNow(2),
    estimatedMinutes: 45,
    difficulty: "hard",
    status: "not-started",
    gradeWeight: 15,
    notes: "Cell respiration, photosynthesis, ATP cycle.",
    createdAt: daysAgo(3),
  },
  {
    id: "a2",
    title: "Math Problem Set",
    subjectId: "math",
    type: "homework",
    dueDate: hoursFromNow(8),
    estimatedMinutes: 30,
    difficulty: "medium",
    status: "in-progress",
    gradeWeight: 5,
    createdAt: daysAgo(2),
  },
  {
    id: "a3",
    title: "English Essay Draft",
    subjectId: "eng",
    type: "essay",
    dueDate: daysFromNow(2),
    estimatedMinutes: 60,
    difficulty: "medium",
    status: "not-started",
    gradeWeight: 20,
    notes: "Thesis + 3 supporting paragraphs on The Great Gatsby.",
    createdAt: daysAgo(4),
  },
  {
    id: "a4",
    title: "History Reading Notes",
    subjectId: "hist",
    type: "reading",
    dueDate: daysFromNow(5),
    estimatedMinutes: 40,
    difficulty: "easy",
    status: "not-started",
    gradeWeight: 5,
    createdAt: daysAgo(1),
  },
  {
    id: "a5",
    title: "Chemistry Lab Report",
    subjectId: "chem",
    type: "lab",
    dueDate: daysFromNow(4),
    estimatedMinutes: 75,
    difficulty: "hard",
    status: "in-progress",
    gradeWeight: 25,
    notes: "Titration results, error analysis, conclusion.",
    createdAt: daysAgo(5),
  },
  {
    id: "a6",
    title: "CS Algorithms Practice",
    subjectId: "cs",
    type: "project",
    dueDate: daysFromNow(9),
    estimatedMinutes: 50,
    difficulty: "medium",
    status: "not-started",
    gradeWeight: 10,
    createdAt: daysAgo(1),
  },
  {
    id: "a7",
    title: "History Midterm Exam",
    subjectId: "hist",
    type: "exam",
    dueDate: daysFromNow(6),
    estimatedMinutes: 120,
    difficulty: "hard",
    status: "not-started",
    gradeWeight: 30,
    notes: "Chapters 1-6, focus on causes of WWI.",
    createdAt: daysAgo(2),
  },
];

/* ------------------------------- Study tasks ------------------------------ */
export const demoTasks: StudyTask[] = [
  {
    id: "t1",
    subjectId: "bio",
    title: "Biology Chapter 4 Review",
    dueDate: daysFromNow(1),
    priority: "high",
    estimatedMinutes: 45,
    recommendedSprint: 45,
    status: "todo",
  },
  {
    id: "t2",
    subjectId: "math",
    title: "Math Homework Practice",
    dueDate: hoursFromNow(8),
    priority: "medium",
    estimatedMinutes: 30,
    recommendedSprint: 25,
    status: "todo",
  },
  {
    id: "t3",
    subjectId: "eng",
    title: "English Essay Outline",
    dueDate: daysFromNow(2),
    priority: "medium",
    estimatedMinutes: 25,
    recommendedSprint: 25,
    status: "todo",
  },
  {
    id: "t4",
    subjectId: "chem",
    title: "Chemistry Titration Notes",
    dueDate: daysFromNow(4),
    priority: "high",
    estimatedMinutes: 45,
    recommendedSprint: 45,
    status: "todo",
  },
];

/* --------------------------------- Sprints -------------------------------- */
export const demoSprints: Sprint[] = [
  {
    id: "s1",
    title: "Biology Chapter 4 Deep Review",
    subjectId: "bio",
    length: 45,
    status: "scheduled",
    scheduledFor: hoursFromNow(3),
  },
  {
    id: "s2",
    title: "Math Problem Set Blitz",
    subjectId: "math",
    length: 25,
    status: "scheduled",
    scheduledFor: hoursFromNow(5),
  },
  {
    id: "s3",
    title: "English Essay Planning",
    subjectId: "eng",
    length: 25,
    status: "completed",
    completedAt: daysAgo(1),
    focusScore: 88,
  },
];

/* ------------------------------ Study history ----------------------------- */
export const demoSessions: StudySession[] = [
  {
    id: "h1",
    subjectId: "bio",
    title: "45-minute Biology Review",
    durationMinutes: 45,
    date: daysAgo(0),
    type: "review",
    focusScore: 82,
  },
  {
    id: "h2",
    subjectId: "math",
    title: "25-minute Math Practice",
    durationMinutes: 25,
    date: daysAgo(1),
    type: "practice",
    focusScore: 91,
  },
  {
    id: "h3",
    subjectId: "eng",
    title: "30-minute English Essay Planning",
    durationMinutes: 30,
    date: daysAgo(1),
    type: "planning",
    focusScore: 88,
  },
  {
    id: "h4",
    subjectId: "hist",
    title: "40-minute History Reading",
    durationMinutes: 40,
    date: daysAgo(2),
    type: "review",
    focusScore: 76,
  },
  {
    id: "h5",
    subjectId: "math",
    title: "50-minute Math Sprint",
    durationMinutes: 50,
    date: daysAgo(3),
    type: "sprint",
    focusScore: 84,
  },
  {
    id: "h6",
    subjectId: "cs",
    title: "60-minute CS Algorithms",
    durationMinutes: 60,
    date: daysAgo(4),
    type: "sprint",
    focusScore: 79,
  },
];

/* ------------------------------- Quiz scores ------------------------------ */
export const demoQuizScores: QuizScore[] = [
  { id: "q1", subjectId: "bio", score: 78, date: daysAgo(3), totalQuestions: 10 },
  { id: "q2", subjectId: "math", score: 85, date: daysAgo(5), totalQuestions: 12 },
  { id: "q3", subjectId: "hist", score: 92, date: daysAgo(6), totalQuestions: 10 },
  { id: "q4", subjectId: "chem", score: 64, date: daysAgo(7), totalQuestions: 10 },
  { id: "q5", subjectId: "eng", score: 88, date: daysAgo(8), totalQuestions: 8 },
];

/* --------------------------- AI recommendations --------------------------- */
export const demoRecommendations: AIRecommendation[] = [
  {
    id: "r1",
    title: "Review Biology today",
    reason:
      "Your Biology quiz is in 2 days and your confidence level is low. A focused 45-minute review now will raise your readiness the most.",
    subjectId: "bio",
    action: "study",
    intensity: "high",
  },
  {
    id: "r2",
    title: "Finish Math homework first",
    reason:
      "It's due tonight and should take under 30 minutes. Clearing it early frees your evening for Biology.",
    subjectId: "math",
    action: "prioritize",
    intensity: "medium",
  },
  {
    id: "r3",
    title: "Balance your week toward Chemistry",
    reason:
      "You've studied English 3 times this week but Chemistry only once — and Chemistry is your lowest quiz score (64%).",
    subjectId: "chem",
    action: "balance",
    intensity: "medium",
  },
];

/* ---------------------------- Weekly study chart -------------------------- */
export const demoWeeklyStudy: WeeklyStudyPoint[] = [
  { day: "Mon", minutes: 60 },
  { day: "Tue", minutes: 95 },
  { day: "Wed", minutes: 45 },
  { day: "Thu", minutes: 120 },
  { day: "Fri", minutes: 80 },
  { day: "Sat", minutes: 150 },
  { day: "Sun", minutes: 70 },
];

/* ------------------------------- User profile ----------------------------- */
export const demoProfile: UserProfile = {
  name: "Alex Rivera",
  email: "alex@studysprint.ai",
  role: "college",
  gradeLevel: "Sophomore",
  schoolType: "University",
  mainSubjects: ["Biology", "Math", "Chemistry"],
  studyGoals: "Raise my Chemistry grade and stay ahead of exam deadlines.",
  preferredStudyTime: "16:00",
  dailyAvailabilityMinutes: 120,
  weeklyGoalMinutes: 600,
  streakDays: 6,
  studyStyle: "mixed",
  plannerStyle: "balanced",
  reminderStyle: "motivational",
  aiStrictness: "balanced",
};

/* --------------------------- Flashcards / quizzes ------------------------- */
export const demoFlashcards: Flashcard[] = [
  { id: "f1", subjectId: "bio", status: "new", front: "What is the powerhouse of the cell?", back: "The mitochondria — it produces ATP through cellular respiration." },
  { id: "f2", subjectId: "bio", status: "new", front: "Define photosynthesis", back: "The process by which plants convert light energy, water, and CO₂ into glucose and oxygen." },
  { id: "f3", subjectId: "math", status: "new", front: "Quadratic formula", back: "x = (-b ± √(b² − 4ac)) / 2a" },
];

export const demoQuiz: QuizQuestion[] = [
  {
    id: "qq1",
    type: "multiple-choice",
    question: "Which organelle is responsible for producing ATP?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correctIndex: 1,
    explanation: "Mitochondria generate ATP via oxidative phosphorylation.",
    topic: "cell respiration",
  },
  {
    id: "qq2",
    type: "multiple-choice",
    question: "Photosynthesis primarily occurs in which structure?",
    options: ["Chloroplast", "Vacuole", "Lysosome", "Cell wall"],
    correctIndex: 0,
    explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis.",
    topic: "photosynthesis",
  },
];

/* --------------------------- Derived helpers ------------------------------ */
export function totalWeeklyMinutes(): number {
  return demoWeeklyStudy.reduce((sum, d) => sum + d.minutes, 0);
}

export function averageQuizScore(): number {
  return (
    demoQuizScores.reduce((s, q) => s + q.score, 0) / demoQuizScores.length
  );
}

export function strongestSubject(): string {
  const best = [...demoQuizScores].sort((a, b) => b.score - a.score)[0];
  return subjectById(best.subjectId)?.name ?? "—";
}

export function weakestSubject(): string {
  const worst = [...demoQuizScores].sort((a, b) => a.score - b.score)[0];
  return subjectById(worst.subjectId)?.name ?? "—";
}
