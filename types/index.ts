// Core domain types for StudySprint AI

/* ------------------------------- Primitives ------------------------------- */
export type Priority = "high" | "medium" | "low";
export type PriorityLevel = "critical" | "high" | "medium" | "low";
export type Difficulty = "easy" | "medium" | "hard";
export type Confidence = "low" | "medium" | "high";
export type SprintLength = 15 | 25 | 45 | 60 | 90;

/** Assignment lifecycle status (Part 2 tracker). */
export type AssignmentStatus =
  | "not-started"
  | "in-progress"
  | "almost-done"
  | "completed"
  | "needs-review";

export type AssignmentType =
  | "homework"
  | "essay"
  | "project"
  | "quiz"
  | "exam"
  | "reading"
  | "lab"
  | "presentation";

export type StudyType =
  | "reading"
  | "practice"
  | "memorization"
  | "essay"
  | "exam-review"
  | "flashcards"
  | "quiz-practice"
  | "project";

export type PlannerStyle = "relaxed" | "balanced" | "aggressive" | "exam-cram";

export type TaskStatus = "todo" | "in-progress" | "completed";

/* -------------------------------- Subjects -------------------------------- */
export interface Subject {
  id: string;
  name: string;
  color: string;
  confidence: Confidence;
}

/* ------------------------------ Assignments ------------------------------- */
export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  type: AssignmentType;
  dueDate: string; // ISO string
  estimatedMinutes: number;
  difficulty: Difficulty;
  status: AssignmentStatus;
  gradeWeight?: number; // % of overall grade
  notes?: string;
  createdAt: string;
}

/* ------------------------------- Study tasks ------------------------------ */
export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string;
  priority: Priority;
  estimatedMinutes: number;
  recommendedSprint: SprintLength;
  status: TaskStatus;
}

/* --------------------------- Scheduled sprints ---------------------------- */
export interface Sprint {
  id: string;
  title: string;
  subjectId: string;
  length: SprintLength;
  status: "active" | "scheduled" | "completed";
  scheduledFor?: string;
  completedAt?: string;
  focusScore?: number;
}

/* ---------------------- Generated (created) sprint ------------------------ */
export interface SprintStep {
  label: string;
  minutes: number;
  detail: string;
}

export interface StudySprint {
  id: string;
  subject: string; // subject name (supports custom)
  subjectId?: string;
  goal: string;
  length: SprintLength;
  difficulty: Difficulty;
  studyType: StudyType;
  confidence: Confidence;
  deadline?: string;
  sprintGoal: string;
  breakdown: SprintStep[];
  materials: string[];
  reflectionPrompts: string[];
  createdAt: string;
  completed?: boolean;
}

/* ------------------------------- Study plan ------------------------------- */
export interface PlanBlock {
  start: string;
  end: string;
  subject: string;
  activity: string;
  minutes: number;
}

export interface PlanDay {
  day: string;
  blocks: PlanBlock[];
}

export interface CatchUpPlan {
  mustDo: string[];
  canDelay: string[];
  quickReview: string[];
  deepStudy: string[];
}

export interface StudyPlan {
  id: string;
  style: PlannerStyle;
  goal: string;
  days: PlanDay[];
  priorityExplanation: string;
  catchUp: CatchUpPlan;
  balance: {
    status: "light" | "balanced" | "overloaded";
    message: string;
    totalMinutes: number;
    dailyAverage: number;
  };
  createdAt: string;
}

/* -------------------------------- Sessions -------------------------------- */
export interface StudySession {
  id: string;
  subjectId: string;
  title: string;
  durationMinutes: number;
  date: string;
  type: "sprint" | "review" | "practice" | "planning";
  focusScore?: number;
}

/* ------------------------------- Flashcards ------------------------------- */
export type FlashcardStatus = "new" | "know" | "review";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subjectId?: string;
  status?: FlashcardStatus;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  cards: Flashcard[];
  createdAt: string;
}

/* --------------------------------- Quizzes -------------------------------- */
export type QuizQuestionType =
  | "multiple-choice"
  | "true-false"
  | "short-answer"
  | "fill-blank";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string; // canonical text answer for non-MC
  explanation?: string;
  topic?: string;
}

export interface Quiz {
  id: string;
  topic: string;
  subject: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAnswerRecord {
  questionId: string;
  correct: boolean;
  given: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  topic: string;
  subject: string;
  score: number; // percentage 0-100
  correct: number;
  total: number;
  weakTopics: string[];
  answers: QuizAnswerRecord[];
  recommendation: string;
  createdAt: string;
}

/** Legacy simple quiz score, used by dashboard/progress demo charts. */
export interface QuizScore {
  id: string;
  subjectId: string;
  score: number;
  date: string;
  totalQuestions: number;
}

/* ------------------------------ Notes summary ----------------------------- */
export type NoteStyle =
  | "simple"
  | "key-points"
  | "study-guide"
  | "exam-review"
  | "confusing-terms"
  | "practice-questions";

export interface TermDefinition {
  term: string;
  definition: string;
}

export interface NoteSummary {
  id: string;
  title: string;
  style: NoteStyle;
  summary: string;
  keyPoints: string[];
  terms: TermDefinition[];
  examTopics: string[];
  practiceQuestions: string[];
  suggestedSprint: string;
  createdAt: string;
}

/* --------------------------- AI recommendations --------------------------- */
export interface AIRecommendation {
  id: string;
  title: string;
  reason: string;
  subjectId?: string;
  action: "study" | "review" | "prioritize" | "balance";
  intensity: "high" | "medium" | "low";
}

/* --------------------------------- Charts --------------------------------- */
export interface WeeklyStudyPoint {
  day: string;
  minutes: number;
}

/* ------------------------------- User profile ----------------------------- */
export interface UserProfile {
  name: string;
  email: string;
  role: "high-school" | "college" | "self-learner";
  weeklyGoalMinutes: number;
  streakDays: number;
}
