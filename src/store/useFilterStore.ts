import { create } from "zustand";

export interface FilterState {
  start: string;
  end: string;
  lag: number;
  activeCategories: string[];
  activeStyles: string[];
  compareMode: boolean;
  compareStart: string;
  compareEnd: string;
  setRange: (start: string, end: string) => void;
  setLag: (lag: number) => void;
  toggleCategory: (key: string) => void;
  toggleStyle: (key: string) => void;
  setCategories: (keys: string[]) => void;
  setStyles: (keys: string[]) => void;
  setCompareMode: (on: boolean) => void;
  setCompareRange: (start: string, end: string) => void;
}

function monthOffset(base: string, months: number): string {
  const [y, m] = base.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

const NOW = "2025-06";
const DEFAULT_START = "2023-07";
const DEFAULT_COMPARE_START = "2022-01";
const DEFAULT_COMPARE_END = "2022-12";

export const useFilterStore = create<FilterState>((set) => ({
  start: DEFAULT_START,
  end: NOW,
  lag: 9,
  activeCategories: ["sofa", "bed", "dining", "desk", "cabinet", "mattress"],
  activeStyles: ["modern", "neo_chinese", "luxury", "nordic", "japanese", "american", "industrial"],
  compareMode: false,
  compareStart: DEFAULT_COMPARE_START,
  compareEnd: DEFAULT_COMPARE_END,
  setRange: (start, end) => set({ start, end }),
  setLag: (lag) => set({ lag }),
  toggleCategory: (key) =>
    set((s) => {
      const exists = s.activeCategories.includes(key);
      const next = exists
        ? s.activeCategories.filter((c) => c !== key)
        : [...s.activeCategories, key];
      return { activeCategories: next.length ? next : s.activeCategories };
    }),
  toggleStyle: (key) =>
    set((s) => {
      const exists = s.activeStyles.includes(key);
      const next = exists
        ? s.activeStyles.filter((c) => c !== key)
        : [...s.activeStyles, key];
      return { activeStyles: next.length ? next : s.activeStyles };
    }),
  setCategories: (keys) => set({ activeCategories: keys.length ? keys : ["sofa"] }),
  setStyles: (keys) => set({ activeStyles: keys.length ? keys : ["modern"] }),
  setCompareMode: (on) => set({ compareMode: on }),
  setCompareRange: (start, end) => set({ compareStart: start, compareEnd: end }),
}));

export { monthOffset };
