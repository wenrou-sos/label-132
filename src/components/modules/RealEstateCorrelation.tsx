import { useMemo } from "react";
import { Slider } from "antd";
import ChartCard from "@/components/ChartCard";
import PlotlyChart from "@/components/PlotlyChart";
import type { Data } from "plotly.js-dist-min";
import type { RealEstateData } from "@/types/api";

interface RealEstateCorrelationProps {
  data: RealEstateData | null;
  compareData: RealEstateData | null;
  lag: number;
  onLagChange: (lag: number) => void;
}

export default function RealEstateCorrelation({
  data,
  compareData,
  lag,
  onLagChange,
}: RealEstateCorrelationProps) {
  const traces = useMemo<Data[]>(() => {
    if (!data) return [];
    const histMonths = data.history.map((d) => d.month);
    const delivery = data.history.map((d) => d.delivery);
    const sales = data.history.map((d) => d.sales);

    const linkMonth = histMonths[histMonths.length - 1];
    const fcMonths = data.forecast.map((d) => d.month);
    const fcSales = [sales[sales.length - 1], ...data.forecast.map((d) => d.predictedSales)];
    const fcX = [linkMonth, ...fcMonths];

    const result: Data[] = [
      {
        type: "bar",
        name: "新房交付量",
        x: histMonths,
        y: delivery,
        yaxis: "y2",
        marker: { color: "rgba(61,90,128,0.35)" },
        hovertemplate: "<b>新房交付</b><br>%{x}<br>%{y:.0f} 万套<extra></extra>",
      },
      {
        type: "scatter",
        mode: "lines",
        name: "家具销售额",
        x: histMonths,
        y: sales,
        line: { color: "#B85C38", width: 2.5 },
        hovertemplate: "<b>家具销售</b><br>%{x}<br>%{y:.0f} 万元<extra></extra>",
      },
      {
        type: "scatter",
        mode: "lines",
        name: "销售预测",
        x: fcX,
        y: fcSales,
        line: { color: "#B85C38", width: 2, dash: "dot" },
        hovertemplate: "<b>预测销售</b><br>%{x}<br>%{y:.0f} 万元<extra></extra>",
      },
    ];

    if (compareData && compareData.history.length) {
      const cmpHist = compareData.history.map((d) => d.month);
      const cmpDelivery = compareData.history.map((d) => d.delivery);
      const cmpSales = compareData.history.map((d) => d.sales);
      const cmpFc = [cmpSales[cmpSales.length - 1], ...compareData.forecast.map((d) => d.predictedSales)];
      const cmpLink = cmpHist[cmpHist.length - 1];
      const cmpFcX = [cmpLink, ...compareData.forecast.map((d) => d.month)];
      result.push(
        {
          type: "bar",
          name: "新房交付（对比期）",
          x: cmpHist,
          y: cmpDelivery,
          yaxis: "y2",
          marker: { color: "rgba(61,90,128,0.15)" },
          opacity: 0.45,
          showlegend: false,
          hovertemplate: "<b>新房交付 对比</b><br>%{x}<br>%{y:.0f} 万套<extra></extra>",
        },
        {
          type: "scatter",
          mode: "lines",
          name: "家具销售（对比期）",
          x: cmpHist,
          y: cmpSales,
          line: { color: "#B85C38", width: 2, dash: "dash" },
          opacity: 0.45,
          showlegend: false,
          hovertemplate: "<b>家具销售 对比</b><br>%{x}<br>%{y:.0f} 万元<extra></extra>",
        },
        {
          type: "scatter",
          mode: "lines",
          name: "销售预测（对比期）",
          x: cmpFcX,
          y: cmpFc,
          line: { color: "#B85C38", width: 1.5, dash: "dot" },
          opacity: 0.3,
          showlegend: false,
          hovertemplate: "<b>预测销售 对比</b><br>%{x}<br>%{y:.0f} 万元<extra></extra>",
        }
      );
    }

    return result;
  }, [data, compareData]);

  if (!data) {
    return (
      <ChartCard title="地产关联分析" subtitle="加载中…" chartHeight={300} className="lg:col-span-3">
        <div className="h-full animate-pulse bg-line/30 rounded-lg" />
      </ChartCard>
    );
  }

  const corrColor = data.correlation >= 0.6 ? "#6B7F5C" : data.correlation >= 0.3 ? "#D4A24C" : "#B85C38";

  return (
    <ChartCard
      title="地产关联分析"
      subtitle="新房交付量与家具销售滞后相关性模型 · 预测未来12个月"
      className="lg:col-span-3"
      chartHeight={340}
      badge={
        <span className="dash-chip" style={{ background: corrColor + "20", color: corrColor }}>
          相关系数 r = {data.correlation.toFixed(2)}
        </span>
      }
      controls={
        <div className="flex items-center gap-2 w-44">
          <span className="text-[11px] text-muted whitespace-nowrap">滞后期</span>
          <Slider
            min={6}
            max={12}
            value={lag}
            onChange={onLagChange}
            style={{ flex: 1, margin: 0 }}
            tooltip={{ formatter: (v) => `${v} 个月` }}
          />
          <span className="font-mono text-xs text-espresso w-12 text-right">{lag}月</span>
        </div>
      }
      footer={`最优滞后期 ${data.optimalLag} 个月 — 新房交付领先家具销售约 ${data.optimalLag} 个月，相关系数 ${data.correlation.toFixed(2)} 表明${data.correlation >= 0.6 ? "强正相关" : "中等相关"}；虚线为未来12个月销售预测`}
    >
      <PlotlyChart
        data={traces}
        layout={{
          margin: { l: 52, r: 56, t: 8, b: 40 },
          xaxis: { tickangle: -35, nticks: 12 },
          yaxis: {
            title: { text: "家具销售 (万元)", font: { size: 10, color: "#B85C38" } },
            tickfont: { size: 10, color: "#B85C38" },
            gridcolor: "#E8E0D5",
          },
          yaxis2: {
            title: { text: "新房交付 (万套)", font: { size: 10, color: "#3D5A80" } },
            tickfont: { size: 10, color: "#3D5A80" },
            overlaying: "y",
            side: "right",
            showgrid: false,
          },
          legend: { orientation: "h", y: -0.26, font: { size: 10 } },
          bargap: 0.15,
        }}
      />
    </ChartCard>
  );
}
