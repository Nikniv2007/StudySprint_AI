"use client";

import * as React from "react";
import { loadState, saveState } from "./index";

/**
 * SSR-safe localStorage state hook.
 * Returns [value, setValue, hydrated]. `hydrated` flips to true once the client
 * has read from storage, so pages can avoid flashing seed data over saved data.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T
): readonly [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = React.useState<T>(initial);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setValue(loadState<T>(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = React.useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        saveState(key, next);
        return next;
      });
    },
    [key]
  );

  return [value, set, hydrated] as const;
}

interface Entity {
  id: string;
}

/**
 * CRUD collection persisted to localStorage.
 * `seed` is used only the first time (when nothing is stored yet).
 */
export function useCollection<T extends Entity>(key: string, seed: T[] = []) {
  const [items, setItems, hydrated] = useLocalStorage<T[]>(key, seed);

  const add = React.useCallback(
    (item: T) => setItems((prev) => [item, ...prev]),
    [setItems]
  );

  const addMany = React.useCallback(
    (list: T[]) => setItems((prev) => [...list, ...prev]),
    [setItems]
  );

  const update = React.useCallback(
    (id: string, patch: Partial<T>) =>
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
      ),
    [setItems]
  );

  const remove = React.useCallback(
    (id: string) => setItems((prev) => prev.filter((x) => x.id !== id)),
    [setItems]
  );

  const replaceAll = React.useCallback(
    (list: T[]) => setItems(list),
    [setItems]
  );

  return { items, add, addMany, update, remove, replaceAll, hydrated };
}
