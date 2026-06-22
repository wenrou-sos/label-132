import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  icon: LucideIcon;
  accent: string;
  hint?: string;
}

export default function KpiCard({
  label,
  value,
  unit,
  delta,
  icon: Icon,
  accent,
  hint,
}: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
        style={{ background: `${accent}1a`, color: accent }}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted leading-none mb-1">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono font-semibold text-espresso text-lg leading-none truncate">
            {value}
          </span>
          {unit && <span className="text-[10px] text-muted">{unit}</span>}
          {delta !== undefined && (
            <span
              className="font-mono text-[11px] font-medium ml-1"
              style={{ color: positive ? "#6B7F5C" : "#B85C38" }}
            >
              {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
        {hint && <p className="text-[10px] text-muted/70 mt-0.5 truncate">{hint}</p>}
      </div>
    </div>
  );
}
