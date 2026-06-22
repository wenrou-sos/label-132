import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  controls?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  chartHeight?: number;
}

export default function ChartCard({
  title,
  subtitle,
  badge,
  controls,
  children,
  footer,
  className = "",
  chartHeight = 300,
}: ChartCardProps) {
  return (
    <section className={`dash-card fade-up flex flex-col p-5 ${className}`}>
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-espresso leading-tight">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {controls && <div className="flex-shrink-0">{controls}</div>}
      </header>
      <div className="flex-1 min-h-0" style={{ minHeight: chartHeight }}>
        {children}
      </div>
      {footer && (
        <footer className="mt-3 pt-3 border-t border-line/60 text-xs text-muted">
          {footer}
        </footer>
      )}
    </section>
  );
}
