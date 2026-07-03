/**
 * Non-hook data helpers for one-off reads/writes outside React state.
 * Use `useCollection` / `useLocalStorage` inside components; use these for
 * cross-page hand-offs (e.g. launching Focus Mode with a chosen sprint).
 */

import { loadState, saveState, clearState, STORAGE_KEYS } from "./index";
import type { StudySprint } from "@/types";

/* Generic CRUD ------------------------------------------------------------- */
export function getData<T>(key: string, fallback: T): T {
  return loadState<T>(key, fallback);
}

export function saveData<T>(key: string, value: T): void {
  saveState(key, value);
}

export function updateData<T>(key: string, updater: (prev: T) => T, fallback: T): T {
  const next = updater(loadState<T>(key, fallback));
  saveState(key, next);
  return next;
}

export function deleteData(key: string): void {
  clearState(key);
}

/* List helpers ------------------------------------------------------------- */
interface Entity {
  id: string;
}

export function appendToList<T extends Entity>(key: string, item: T): void {
  updateData<T[]>(key, (prev) => [item, ...prev], []);
}

export function removeFromList(key: string, id: string): void {
  updateData<Entity[]>(key, (prev) => prev.filter((x) => x.id !== id), []);
}

/* Focus Mode hand-off ------------------------------------------------------ */
/** Stash a sprint so Focus Mode preloads it when the user clicks "Start". */
export function setActiveSprint(sprint: StudySprint): void {
  saveData(STORAGE_KEYS.focusActive, sprint);
}

export function getActiveSprint(): StudySprint | null {
  return getData<StudySprint | null>(STORAGE_KEYS.focusActive, null);
}

export function clearActiveSprint(): void {
  deleteData(STORAGE_KEYS.focusActive);
}
