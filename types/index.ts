// Core domain types for StudySprint AI

export type Priority = "high" | "medium" | "low";

export type TaskStatus = "todo" | "in-progress" | "completed";

export type AssignmentType = "assignment" | "exam" | "quiz" | "project" | "reading" | "lab";

export type Confidence = "low" | "medium" | "high";

export type SprintLength = 15 | 25 | 45 | 60 | 90;

export interface Subject {
  id: string;
  name: string;
  color: string; // tailwind-friendly hex
  confidence: Confidence;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  type: AssignmentType;
  dueDate: string; // ISO string
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes: number;
  notes?: string;
}

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

export interface Sprint {
  id: string;
  title: string;
  subjectId: string;
  length: SprintLength;
  status: "active" | "scheduled" | "completed";
  scheduledFor?: string;
  completedAt?: string;
  focusScore?: number; // 0-100
}

export interface StudySession {
  id: string;
  subjectId: string;
  title: string;
  durationMinutes: number;
  date: string; // ISO
  type: "sprint" | "review" | "practice" | "planning";
  focusScore?: number;
}

export interface QuizScore {
  id: string;
  subjectId: string;
  score: number; // percentage 0-100
  date: string;
  totalQuestions: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  reason: string;
  subjectId?: string;
  action: "study" | "review" | "prioritize" | "balance";
  intensity: "high" | "medium" | "low";
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subjectId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface WeeklyStudyPoint {
  day: string; // Mon, Tue...
  minutes: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: "high-school" | "college" | "self-learner";
  weeklyGoalMinutes: number;
  streakDays: number;
}
