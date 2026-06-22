import { useMemo } from "react";
import { Checkbox } from "antd";
import ChartCard from "@/components/ChartCard";
import PlotlyChart from "@/components/PlotlyChart";
import type { Data } from "plotly.js-dist-min";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/theme";
import type { CategoryTrendsData } from "@/types/api";

interface CategoryTrendsProps {
  data: CategoryTrendsData | null;
  activeCategories: string[];
  onToggle: (key: string) => void;
}

export default function CategoryTrends({
  data,
  activeCategories,
  onToggle,
}: CategoryTrendsProps) {
  const { donutData, lineData, latestMonth } = useMemo(() => {
    if (!data || !data.months.length) {
      return { donutData: [] as Data[], lineData: [] as Data[], latestMonth: "" };
    }
    const last = data.months[data.months.length - 1];

    const donut: Data = {
      type: "pie",
      hole: 0.62,
      values: last.categories.map((c) => c.sales),
      labels: last.categories.map((c) => c.label),
      marker: {
        colors: last.categories.map((c) => CATEGORY_COLORS[c.name]),
        line: { color: "#FDFBF7", width: 2 },
      },
      textinfo: "percent",
      texttemplate: "%{label}<br>%{percent}",
      textposition: "inside",
      textfont: { size: 11, color: "#FDFBF7" },
      hovertemplate: "<b>%{label}</b><br>销售额 %{value:.0f} 万元<br>占比 %{percent}<extra></extra>",
      sort: false,
    };

    const line: Data[] = last.categories
      .filter((c) => activeCategories.includes(c.name))
      .map((c) => {
        const months = data.months.map((m) => m.month);
        const yoy = data.months.map((m) => {
          const cat = m.categories.find((x) => x.name === c.name);
          return cat ? cat.yoy : null;
        });
        return {
          type: "scatter",
          mode: "lines+markers",
          name: c.label,
          x: months,
          y: yoy,
          line: { color: CATEGORY_COLORS[c.name], width: 2, shape: "spline" },
          marker: { size: 4 },
          hovertemplate: `<b>${c.label}</b><br>%{x}<br>同比 %{y:.1f}%<extra></extra>`,
        } as Data;
      });

    return { donutData: [donut], lineData: line, latestMonth: last.month };
  }, [data, activeCategories]);

  if (!data) {
    return (
      <ChartCard title="品类销售趋势分析" subtitle="加载中…" chartHeight={300} className="lg:col-span-2">
        <div className="h-full animate-pulse bg-line/30 rounded-lg" />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="品类销售趋势分析"
      subtitle={`${latestMonth} · 六大品类月度销售额占比与同比增速`}
      className="lg:col-span-2"
      chartHeight={320}
      badge={
        <span className="dash-chip" style={{ background: "#B85C3815", color: "#B85C38" }}>
          6 品类
        </span>
      }
      controls={
        <div className="flex flex-wrap gap-1.5 max-w-[280px] justify-end">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Checkbox
              key={key}
              checked={activeCategories.includes(key)}
              onChange={() => onToggle(key)}
              style={{ fontSize: 11 }}
            >
              <span style={{ color: CATEGORY_COLORS[key] }}>●</span> {label}
            </Checkbox>
          ))}
        </div>
      }
      footer="环形图展示当期各品类销售占比，折线图反映各品类同比增速变化趋势"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 h-full" style={{ minHeight: 320 }}>
        <div className="md:col-span-2 h-full">
          <PlotlyChart
            data={donutData}
            layout={{
              margin: { l: 8, r: 8, t: 8, b: 8 },
              showlegend: false,
              annotations: [
                {
                  text: `<b>当期占比</b><br><span style="font-size:10px;color:#9C8E80">${latestMonth}</span>`,
                  showarrow: false,
                  font: { size: 12, color: "#2B2118", family: "'DM Sans', sans-serif" },
                },
              ],
            }}
            style={{ height: "100%" }}
          />
        </div>
        <div className="md:col-span-3 h-full">
          <PlotlyChart
            data={lineData}
            layout={{
              margin: { l: 44, r: 16, t: 8, b: 36 },
              xaxis: { tickangle: -35, nticks: 8 },
              yaxis: { title: { text: "同比增速 (%)", font: { size: 10 } }, zeroline: true, zerolinewidth: 1.5, zerolinecolor: "#C8B8A8" },
              legend: { orientation: "h", y: -0.28, font: { size: 10 } },
            }}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </ChartCard>
  );
}
