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
  sessions: "sessions",
  profile: "profile",
  flashcards: "flashcards",
  onboarded: "onboarded",
} as const;
