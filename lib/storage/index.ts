"use client";

/**
 * Thin, typed wrapper around localStorage with SSR safety.
 * All app persistence flows through here so a real backend can be
 * swapped in later without touching feature code.
 */

const PREFIX = "studysprint:";

export function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently in the demo
  }
}

export function clearState(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFIX + key);
}

export const STORAGE_KEYS = {
  assignments: "assignments",
  sprints: "sprints",
  savedSprints: "saved-sprints",
  sessions: "sessions",
  profile: "profile",
  flashcards: "flashcards",
  decks: "flashcard-decks",
  quizResults: "quiz-results",
  plans: "study-plans",
  noteSummaries: "note-summaries",
  focusActive: "focus-active",
  theme: "theme",
  onboarded: "onboarded",
} as const;

/** Every persisted key, used by the reset helper. */
export const ALL_KEYS = Object.values(STORAGE_KEYS);

/**
 * Wipe all StudySprint AI data from localStorage. The app re-seeds demo data
 * on next load because collections fall back to their seed when empty.
 */
export function resetAllData(): void {
  if (typeof window === "undefined") return;
  ALL_KEYS.forEach((k) => {
    if (k !== "theme") clearState(k);
  });
}
