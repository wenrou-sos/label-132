export const PALETTE = {
  cream: "#F7F3ED",
  paper: "#FDFBF7",
  surface: "#FFFFFF",
  espresso: "#2B2118",
  cocoa: "#5C4A3A",
  clay: "#B85C38",
  clayLight: "#D17852",
  sage: "#6B7F5C",
  sageLight: "#8FA67E",
  amber: "#D4A24C",
  indigo: "#3D5A80",
  rose: "#A85B6B",
  warmGray: "#8B7E72",
  line: "#E8E0D5",
  muted: "#9C8E80",
} as const;

export const CATEGORY_COLORS: Record<string, string> = {
  sofa: "#B85C38",
  bed: "#6B7F5C",
  dining: "#D4A24C",
  desk: "#3D5A80",
  cabinet: "#A85B6B",
  mattress: "#8B7E72",
};

export const CATEGORY_LABELS: Record<string, string> = {
  sofa: "沙发",
  bed: "床",
  dining: "餐桌椅",
  desk: "书桌",
  cabinet: "柜类",
  mattress: "床垫",
};

export const STYLE_COLORS: Record<string, string> = {
  modern: "#B85C38",
  neo_chinese: "#C8102E",
  luxury: "#D4A24C",
  nordic: "#6B7F5C",
  japanese: "#8FA67E",
  american: "#3D5A80",
  industrial: "#8B7E72",
};

export const STYLE_LABELS: Record<string, string> = {
  modern: "现代简约",
  neo_chinese: "新中式",
  luxury: "轻奢",
  nordic: "北欧",
  japanese: "日式",
  american: "美式",
  industrial: "工业风",
};

export const HOUSE_TYPE_COLORS: Record<string, string> = {
  小户型: "#B85C38",
  中户型: "#6B7F5C",
  大户型: "#3D5A80",
};

export const DECISION_COLORS: Record<string, string> = {
  材质: "#B85C38",
  价格段: "#D4A24C",
  品牌: "#6B7F5C",
  环保等级: "#3D5A80",
};

export const PLOTLY_LAYOUT = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: {
    family: "'DM Sans', 'Noto Sans SC', sans-serif",
    color: "#5C4A3A",
    size: 12,
  },
  margin: { l: 48, r: 24, t: 16, b: 40 },
  xaxis: {
    gridcolor: "#E8E0D5",
    linecolor: "#E8E0D5",
    zerolinecolor: "#E8E0D5",
    tickfont: { size: 11, color: "#9C8E80" },
  },
  yaxis: {
    gridcolor: "#E8E0D5",
    linecolor: "#E8E0D5",
    zerolinecolor: "#E8E0D5",
    tickfont: { size: 11, color: "#9C8E80" },
  },
  legend: {
    font: { size: 11, color: "#5C4A3A" },
    orientation: "h" as const,
    y: -0.22,
  },
  hoverlabel: {
    bgcolor: "#FDFBF7",
    bordercolor: "#E8E0D5",
    font: { color: "#2B2118", size: 12 },
  },
} as const;
