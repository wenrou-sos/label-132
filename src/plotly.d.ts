declare module "plotly.js-dist-min" {
  export * from "plotly.js";
  const Plotly: typeof import("plotly.js");
  export default Plotly;
}
declare module "react-plotly.js/factory" {
  import type * as Plotly from "plotly.js";
  interface FactoryPlotProps {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    style?: React.CSSProperties;
    className?: string;
    onRelayout?: (e: Plotly.PlotRelayoutEvent) => void;
    onHover?: (e: Plotly.PlotHoverEvent) => void;
    onClick?: (e: Plotly.PlotMouseEvent) => void;
    [key: string]: unknown;
  }
  export default function createPlotlyComponent(
    plotly: typeof Plotly
  ): (props: FactoryPlotProps) => JSX.Element;
}
