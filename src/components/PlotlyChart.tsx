import { useMemo } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, Config } from "plotly.js-dist-min";
import { PLOTLY_LAYOUT } from "@/lib/theme";

const Plot = createPlotlyComponent(Plotly);

interface PlotlyChartProps {
  data: Data[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
  className?: string;
  style?: React.CSSProperties;
}

export default function PlotlyChart({
  data,
  layout,
  config,
  className,
  style,
}: PlotlyChartProps) {
  const mergedLayout = useMemo(
    () => ({
      ...PLOTLY_LAYOUT,
      ...layout,
      xaxis: { ...PLOTLY_LAYOUT.xaxis, ...layout?.xaxis },
      yaxis: { ...PLOTLY_LAYOUT.yaxis, ...layout?.yaxis },
      legend: { ...PLOTLY_LAYOUT.legend, ...layout?.legend },
    }),
    [layout]
  );

  const mergedConfig: Partial<Config> = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
    ...config,
  };

  return (
    <Plot
      data={data}
      layout={mergedLayout as Layout}
      config={mergedConfig as Config}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}
