/**
 * Public entrypoint for the StudySprint AI engine.
 * All logic lives in `mock-ai.ts`; this barrel keeps imports stable so a real
 * provider can be swapped behind the same surface later.
 */
export * from "./mock-ai";

import type { SprintLength } from "@/types";

/** Recommend a sprint length that fits an estimated task duration. */
export function recommendSprintLength(minutes: number): SprintLength {
  if (minutes <= 20) return 15;
  if (minutes <= 30) return 25;
  if (minutes <= 50) return 45;
  if (minutes <= 75) return 60;
  return 90;
}
