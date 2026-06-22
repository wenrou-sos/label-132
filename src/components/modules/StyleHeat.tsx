import { useMemo } from "react";
import ChartCard from "@/components/ChartCard";
import PlotlyChart from "@/components/PlotlyChart";
import type { Data } from "plotly.js-dist-min";
import { STYLE_COLORS, STYLE_LABELS } from "@/lib/theme";
import type { StyleHeatData } from "@/types/api";

export default function StyleHeat({ data }: { data: StyleHeatData | null }) {
  const { traces, neoYoy } = useMemo(() => {
    if (!data) return { traces: [] as Data[], neoYoy: 0 };
    const traces: Data[] = data.styles.map((s) => {
      const isModern = s.name === "modern";
      const isNeo = s.name === "neo_chinese";
      return {
        type: "scatter",
        mode: "lines",
        name: s.label,
        x: data.months,
        y: s.values,
        line: {
          color: STYLE_COLORS[s.name],
          width: isModern ? 3.5 : isNeo ? 3 : 1.5,
          shape: "spline",
        },
        opacity: isModern || isNeo ? 1 : 0.5,
        hovertemplate: `<b>${s.label}</b><br>%{x}<br>热度 %{y:.1f}<extra></extra>`,
      };
    });
    const neo = data.styles.find((s) => s.name === "neo_chinese");
    return { traces, neoYoy: neo?.yoy ?? 0 };
  }, [data]);

  if (!data) {
    return (
      <ChartCard title="风格热度追踪" subtitle="加载中…" chartHeight={300}>
        <div className="h-full animate-pulse bg-line/30 rounded-lg" />
      </ChartCard>
    );
  }

  const modern = data.styles.find((s) => s.name === "modern");
  const lastIdx = data.months.length - 1;

  return (
    <ChartCard
      title="风格热度追踪"
      subtitle="七大风格搜索热度指数趋势"
      chartHeight={300}
      badge={
        <span className="dash-chip" style={{ background: "#C8102E15", color: "#C8102E" }}>
          新中式 +{neoYoy.toFixed(1)}%
        </span>
      }
      footer="现代简约持续领跑，新中式增速最快；美式与工业风热度走低"
    >
      <PlotlyChart
        data={[
          ...traces,
          {
            type: "scatter",
            mode: "text+markers",
            name: "",
            x: [data.months[lastIdx], data.months[lastIdx]],
            y: [modern?.values[lastIdx] ?? 0, data.styles.find((s) => s.name === "neo_chinese")?.values[lastIdx] ?? 0],
            text: ["领先", `↑${neoYoy.toFixed(0)}%`],
            textposition: "top right",
            textfont: { size: 10, color: "#B85C38" },
            marker: { size: 8, color: "#B85C38" },
            showlegend: false,
            hoverinfo: "none",
          } as Data,
        ]}
        layout={{
          margin: { l: 40, r: 16, t: 8, b: 36 },
          xaxis: { tickangle: -35, nticks: 8 },
          yaxis: { title: { text: "热度指数", font: { size: 10 } }, range: [0, 105] },
          legend: { orientation: "h", y: -0.28, font: { size: 9.5 } },
        }}
      />
    </ChartCard>
  );
}
