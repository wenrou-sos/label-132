export type CategoryKey =
  | "sofa"
  | "bed"
  | "dining"
  | "desk"
  | "cabinet"
  | "mattress";

export type StyleKey =
  | "modern"
  | "neo_chinese"
  | "luxury"
  | "nordic"
  | "japanese"
  | "american"
  | "industrial";

export interface SummaryData {
  totalSales: number;
  yoyGrowth: number;
  customShare: number;
  topStyle: string;
}

export interface CategoryPoint {
  name: CategoryKey;
  label: string;
  sales: number;
  share: number;
  yoy: number;
}

export interface CategoryMonth {
  month: string;
  total: number;
  categories: CategoryPoint[];
}

export interface CategoryTrendsData {
  months: CategoryMonth[];
}

export interface MarketPoint {
  month: string;
  custom: number;
  ready: number;
}

export interface MarketStructureData {
  history: MarketPoint[];
  forecast: MarketPoint[];
}

export interface StyleSeries {
  name: string;
  label: string;
  values: number[];
  yoy: number;
}

export interface StyleHeatData {
  months: string[];
  styles: StyleSeries[];
}

export interface DecisionSeries {
  name: string;
  dimension: string;
  values: number[];
}

export interface DecisionFactorsData {
  axes: string[];
  series: DecisionSeries[];
}

export interface SizeItem {
  furniture: string;
  size: string;
  popularity: number;
  highlight: boolean;
}

export interface SizeHouseType {
  name: string;
  items: SizeItem[];
}

export interface SizePreferenceData {
  houseTypes: SizeHouseType[];
}

export interface RealEstatePoint {
  month: string;
  delivery: number;
  sales: number;
}

export interface RealEstateForecast {
  month: string;
  predictedSales: number;
}

export interface RealEstateData {
  history: RealEstatePoint[];
  correlation: number;
  optimalLag: number;
  forecast: RealEstateForecast[];
}

export type ModuleKey =
  | "category-trends"
  | "market-structure"
  | "style-heat"
  | "decision-factors"
  | "size-preference"
  | "realestate-correlation";
