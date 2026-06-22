import { create } from "zustand";
import { api } from "@/lib/api";
import type {
  CategoryTrendsData,
  DecisionFactorsData,
  MarketStructureData,
  RealEstateData,
  SizePreferenceData,
  StyleHeatData,
  SummaryData,
} from "@/types/api";

interface CacheEntry<T> {
  data: T;
  key: string;
}

interface DataState {
  summary: SummaryData | null;
  categoryTrends: CategoryTrendsData | null;
  marketStructure: MarketStructureData | null;
  styleHeat: StyleHeatData | null;
  decisionFactors: DecisionFactorsData | null;
  sizePreference: SizePreferenceData | null;
  realestate: RealEstateData | null;
  loading: boolean;
  error: string | null;
  cache: Map<string, CacheEntry<unknown>>;
  fetchSummary: (start?: string, end?: string) => Promise<void>;
  fetchCategoryTrends: (start?: string, end?: string) => Promise<void>;
  fetchMarketStructure: () => Promise<void>;
  fetchStyleHeat: () => Promise<void>;
  fetchDecisionFactors: () => Promise<void>;
  fetchSizePreference: () => Promise<void>;
  fetchRealestate: (lag: number) => Promise<void>;
  fetchAll: (start: string, end: string, lag: number) => Promise<void>;
  clearCache: () => void;
}

async function cached<T>(
  cache: Map<string, CacheEntry<unknown>>,
  key: string,
  loader: () => Promise<T>
): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.key === key) {
    return hit.data;
  }
  const data = await loader();
  cache.set(key, { data, key });
  return data;
}

export const useDataStore = create<DataState>((set, get) => ({
  summary: null,
  categoryTrends: null,
  marketStructure: null,
  styleHeat: null,
  decisionFactors: null,
  sizePreference: null,
  realestate: null,
  loading: false,
  error: null,
  cache: new Map(),

  fetchSummary: async (start, end) => {
    try {
      const key = `summary-${start}-${end}`;
      const data = await cached(get().cache, key, () => api.summary(start, end));
      set({ summary: data });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  fetchCategoryTrends: async (start, end) => {
    try {
      const key = `cat-${start}-${end}`;
      const data = await cached(get().cache, key, () => api.categoryTrends(start, end));
      set({ categoryTrends: data });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  fetchMarketStructure: async () => {
    try {
      const key = "market";
      const data = await cached(get().cache, key, () => api.marketStructure());
      set({ marketStructure: data });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  fetchStyleHeat: async () => {
    try {
      const key = "style";
      const data = await cached(get().cache, key, () => api.styleHeat());
      set({ styleHeat: data });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  fetchDecisionFactors: async () => {
    try {
      const key = "decision";
      const data = await cached(get().cache, key, () => api.decisionFactors());
      set({ decisionFactors: data });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  fetchSizePreference: async () => {
    try {
      const key = "size";
      const data = await cached(get().cache, key, () => api.sizePreference());
      set({ sizePreference: data });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  fetchRealestate: async (lag) => {
    try {
      const key = `realestate-${lag}`;
      const data = await cached(get().cache, key, () => api.realestateCorrelation(lag));
      set({ realestate: data });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  fetchAll: async (start, end, lag) => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchSummary(start, end),
        get().fetchCategoryTrends(start, end),
        get().fetchMarketStructure(),
        get().fetchStyleHeat(),
        get().fetchDecisionFactors(),
        get().fetchSizePreference(),
        get().fetchRealestate(lag),
      ]);
    } finally {
      set({ loading: false });
    }
  },

  clearCache: () => {
    get().cache.clear();
  },
}));
