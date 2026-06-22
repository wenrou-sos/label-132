import { useMemo, useState } from "react";
import ChartCard from "@/components/ChartCard";
import PlotlyChart from "@/components/PlotlyChart";
import type { Data } from "plotly.js-dist-min";
import { DECISION_COLORS } from "@/lib/theme";
import type { DecisionFactorsData } from "@/types/api";

interface DecisionFactorsProps {
  data: DecisionFactorsData | null;
  compareData: DecisionFactorsData | null;
  compareMode?: boolean;
}

export default function DecisionFactors({ data, compareData, compareMode }: DecisionFactorsProps) {
  const [view, setView] = useState<"base" | "compare">("base");
  const activeData = compareMode && view === "compare" ? compareData : data;

  const { traces, insights } = useMemo(() => {
    if (!activeData) return { traces: [] as Data[], insights: [] as string[] };

    const topByDim: Record<string, { name: string; values: number[] }> = {};
    for (const s of activeData.series) {
      const ownIdx = activeData.axes.indexOf(s.dimension);
      const ownVal = s.values[ownIdx];
      if (!topByDim[s.dimension] || ownVal > topByDim[s.dimension].values[ownIdx]) {
        topByDim[s.dimension] = { name: s.name, values: s.values };
      }
    }

    const traces: Data[] = Object.entries(topByDim).map(([dim, info]) => ({
      type: "scatterpolar",
      r: [...info.values, info.values[0]],
      theta: [...activeData.axes, activeData.axes[0]],
      name: info.name,
      fill: "toself",
      fillcolor: (DECISION_COLORS[dim] ?? "#999") + "20",
      line: { color: DECISION_COLORS[dim] ?? "#999", width: 2 },
      hovertemplate: "<b>%{fullData.name}</b><br>%{theta}: %{r:.0f}<extra></extra>",
    }));

    const insights = Object.entries(topByDim).map(([dim, info]) => {
      const ownIdx = activeData.axes.indexOf(dim);
      return `${dim}·${info.name.split("-")[1] ?? ""} (${info.values[ownIdx]}%)`;
    });

    return { traces, insights };
  }, [activeData]);

  if (!data) {
    return (
      <ChartCard title="消费决策因素权重" subtitle="加载中…" chartHeight={300}>
        <div className="h-full animate-pulse bg-line/30 rounded-lg" />
      </ChartCard>
    );
  }

  const toggleView = () => setView((v) => (v === "base" ? "compare" : "base"));

  return (
    <ChartCard
      title="消费决策因素权重"
      subtitle="材质 / 价格段 / 品牌 / 环保等级对购买决策的影响"
      chartHeight={300}
      badge={
        <span className="dash-chip" style={{ background: "#3D5A8015", color: "#3D5A80" }}>
          ENF级
        </span>
      }
      footer={
        compareMode ? (
          <button
            onClick={toggleView}
            className="text-xs text-muted hover:text-clay transition-colors underline underline-offset-2 decoration-dashed"
          >
            当前展示：{view === "base" ? "基准期" : "对比期"} · 点击切换
          </button>
        ) : (
          `主导因素：${insights.join("  ·  ")}`
        )
      }
    >
      <PlotlyChart
        data={traces}
        layout={{
          margin: { l: 40, r: 40, t: 24, b: 24 },
          polar: {
            radialaxis: {
              visible: true,
              range: [0, 45],
              tickfont: { size: 9, color: "#9C8E80" },
              gridcolor: "#E8E0D5",
            },
            angularaxis: {
              tickfont: { size: 11, color: "#5C4A3A" },
              gridcolor: "#E8E0D5",
              linecolor: "#E8E0D5",
            },
            bgcolor: "rgba(0,0,0,0)",
          },
          legend: { orientation: "h", y: -0.08, font: { size: 9 } },
        }}
      />
    </ChartCard>
  );
}
