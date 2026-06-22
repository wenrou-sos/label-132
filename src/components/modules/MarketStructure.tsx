import { useMemo } from "react";
import ChartCard from "@/components/ChartCard";
import PlotlyChart from "@/components/PlotlyChart";
import type { Data } from "plotly.js-dist-min";
import type { MarketStructureData } from "@/types/api";

export default function MarketStructure({ data }: { data: MarketStructureData | null }) {
  const traces = useMemo<Data[]>(() => {
    if (!data) return [];
    const histMonths = data.history.map((d) => d.month);
    const fcMonths = data.forecast.map((d) => d.month);
    const linkMonth = histMonths[histMonths.length - 1];

    const customHist = data.history.map((d) => d.custom);
    const readyHist = data.history.map((d) => d.ready);
    const customFc = [customHist[customHist.length - 1], ...data.forecast.map((d) => d.custom)];
    const readyFc = [readyHist[readyHist.length - 1], ...data.forecast.map((d) => d.ready)];
    const fcX = [linkMonth, ...fcMonths];

    return [
      {
        type: "scatter",
        mode: "lines",
        name: "全屋定制",
        x: histMonths,
        y: customHist,
        line: { color: "#B85C38", width: 2.5 },
        fill: "tozeroy",
        fillcolor: "rgba(184,92,56,0.08)",
        hovertemplate: "<b>全屋定制</b><br>%{x}<br>占比 %{y:.1f}%<extra></extra>",
      },
      {
        type: "scatter",
        mode: "lines",
        name: "成品家具",
        x: histMonths,
        y: readyHist,
        line: { color: "#6B7F5C", width: 2.5 },
        fill: "tozeroy",
        fillcolor: "rgba(107,127,92,0.08)",
        hovertemplate: "<b>成品家具</b><br>%{x}<br>占比 %{y:.1f}%<extra></extra>",
      },
      {
        type: "scatter",
        mode: "lines",
        name: "定制预测",
        x: fcX,
        y: customFc,
        line: { color: "#B85C38", width: 2, dash: "dash" },
        hovertemplate: "<b>定制预测</b><br>%{x}<br>占比 %{y:.1f}%<extra></extra>",
      },
      {
        type: "scatter",
        mode: "lines",
        name: "成品预测",
        x: fcX,
        y: readyFc,
        line: { color: "#6B7F5C", width: 2, dash: "dash" },
        hovertemplate: "<b>成品预测</b><br>%{x}<br>占比 %{y:.1f}%<extra></extra>",
      },
    ];
  }, [data]);

  if (!data) {
    return (
      <ChartCard title="市场结构分析" subtitle="加载中…" chartHeight={300}>
        <div className="h-full animate-pulse bg-line/30 rounded-lg" />
      </ChartCard>
    );
  }

  const latest = data.history[data.history.length - 1];
  const future = data.forecast[data.forecast.length - 1];

  return (
    <ChartCard
      title="市场结构分析"
      subtitle="全屋定制 vs 成品家具市场份额变化与预测"
      chartHeight={300}
      badge={
        <span className="dash-chip" style={{ background: "#B85C3815", color: "#B85C38" }}>
          定制 {latest.custom.toFixed(0)}%
        </span>
      }
      footer={`预计至 ${future.month} 定制占比将达 ${future.custom.toFixed(1)}%，成品降至 ${future.ready.toFixed(1)}%`}
    >
      <PlotlyChart
        data={traces}
        layout={{
          margin: { l: 40, r: 16, t: 8, b: 36 },
          xaxis: { tickangle: -35, nticks: 8 },
          yaxis: { title: { text: "市场份额 (%)", font: { size: 10 } }, range: [0, 100] },
          legend: { orientation: "h", y: -0.28, font: { size: 10 } },
        }}
      />
    </ChartCard>
  );
}
