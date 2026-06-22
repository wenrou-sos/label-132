import { useMemo } from "react";
import ChartCard from "@/components/ChartCard";
import PlotlyChart from "@/components/PlotlyChart";
import type { Data } from "plotly.js-dist-min";
import { HOUSE_TYPE_COLORS } from "@/lib/theme";
import type { SizePreferenceData } from "@/types/api";

export default function SizePreference({ data }: { data: SizePreferenceData | null }) {
  const traces = useMemo<Data[]>(() => {
    if (!data) return [];
    const allItems: { label: string; popularity: number; color: string; highlight: boolean }[] = [];
    for (const ht of data.houseTypes) {
      for (const item of ht.items) {
        allItems.push({
          label: `${ht.name} · ${item.furniture}`,
          popularity: item.popularity,
          color: HOUSE_TYPE_COLORS[ht.name] ?? "#999",
          highlight: item.highlight,
        });
      }
    }
    // 按热度排序，高的在上
    allItems.sort((a, b) => a.popularity - b.popularity);

    return [
      {
        type: "bar",
        orientation: "h",
        x: allItems.map((i) => i.popularity),
        y: allItems.map((i) => i.label),
        marker: {
          color: allItems.map((i) => (i.highlight ? "#B85C38" : i.color)),
          line: {
            color: allItems.map((i) => (i.highlight ? "#D4A24C" : "transparent")),
            width: allItems.map((i) => (i.highlight ? 2 : 0)),
          },
        },
        text: allItems.map((i) => (i.highlight ? "★ 畅销" : `${i.popularity}`)),
        textposition: "outside",
        textfont: { size: 10, color: "#9C8E80" },
        hovertemplate: "<b>%{y}</b><br>流行度 %{x}<extra></extra>",
      },
    ];
  }, [data]);

  if (!data) {
    return (
      <ChartCard title="尺寸偏好分析" subtitle="加载中…" chartHeight={300}>
        <div className="h-full animate-pulse bg-line/30 rounded-lg" />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="尺寸偏好分析"
      subtitle="按户型分类的主流家具尺寸趋势"
      chartHeight={300}
      badge={
        <span className="dash-chip" style={{ background: "#B85C3815", color: "#B85C38" }}>
          ★ 畅销单品
        </span>
      }
      footer="小户型畅销：伸缩餐桌（0.9-1.4m）与多功能沙发床（1.5m 折叠）需求最高"
    >
      <PlotlyChart
        data={traces}
        layout={{
          margin: { l: 150, r: 60, t: 8, b: 32 },
          xaxis: { title: { text: "流行度指数", font: { size: 10 } }, range: [0, 105] },
          yaxis: { tickfont: { size: 9.5, color: "#5C4A3A" }, automargin: true },
          showlegend: false,
        }}
      />
    </ChartCard>
  );
}
