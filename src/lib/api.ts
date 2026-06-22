import type {
  CategoryTrendsData,
  DecisionFactorsData,
  MarketStructureData,
  ModuleKey,
  RealEstateData,
  SizePreferenceData,
  StyleHeatData,
  SummaryData,
} from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE || "";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} 返回 ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  summary: (start?: string, end?: string) => {
    const q = new URLSearchParams();
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    const qs = q.toString();
    return fetchJson<SummaryData>(`/api/summary${qs ? `?${qs}` : ""}`);
  },
  categoryTrends: (start?: string, end?: string) => {
    const q = new URLSearchParams();
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    const qs = q.toString();
    return fetchJson<CategoryTrendsData>(`/api/category-trends${qs ? `?${qs}` : ""}`);
  },
  marketStructure: (start?: string, end?: string) => {
    const q = new URLSearchParams();
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    const qs = q.toString();
    return fetchJson<MarketStructureData>(`/api/market-structure${qs ? `?${qs}` : ""}`);
  },
  styleHeat: (start?: string, end?: string) => {
    const q = new URLSearchParams();
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    const qs = q.toString();
    return fetchJson<StyleHeatData>(`/api/style-heat${qs ? `?${qs}` : ""}`);
  },
  decisionFactors: (start?: string, end?: string) => {
    const q = new URLSearchParams();
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    const qs = q.toString();
    return fetchJson<DecisionFactorsData>(`/api/decision-factors${qs ? `?${qs}` : ""}`);
  },
  sizePreference: (start?: string, end?: string) => {
    const q = new URLSearchParams();
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    const qs = q.toString();
    return fetchJson<SizePreferenceData>(`/api/size-preference${qs ? `?${qs}` : ""}`);
  },
  realestateCorrelation: (lag = 9, start?: string, end?: string) => {
    const q = new URLSearchParams({ lag: String(lag) });
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    return fetchJson<RealEstateData>(`/api/realestate-correlation?${q.toString()}`);
  },
  exportCsv: (module: ModuleKey, start?: string, end?: string) => {
    const q = new URLSearchParams({ module });
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    return `${API_BASE}/api/export?${q.toString()}`;
  },
};
