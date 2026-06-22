import { DatePicker, Button, Dropdown, message } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import {
  Armchair,
  TrendingUp,
  Layers,
  Sparkles,
  Download,
  CalendarRange,
} from "lucide-react";
import dayjs from "dayjs";
import KpiCard from "@/components/KpiCard";
import type { SummaryData } from "@/types/api";
import { api } from "@/lib/api";

const { RangePicker } = DatePicker;

interface DashboardHeaderProps {
  summary: SummaryData | null;
  start: string;
  end: string;
  onRangeChange: (start: string, end: string) => void;
}

export default function DashboardHeader({
  summary,
  start,
  end,
  onRangeChange,
}: DashboardHeaderProps) {
  const handleRangeChange: RangePickerProps["onChange"] = (dates, dateStrings) => {
    if (dates && dateStrings[0] && dateStrings[1]) {
      onRangeChange(dateStrings[0], dateStrings[1]);
    }
  };

  const exportItems = [
    { key: "category-trends", label: "品类销售趋势" },
    { key: "market-structure", label: "市场结构" },
    { key: "style-heat", label: "风格热度" },
    { key: "decision-factors", label: "消费决策因素" },
    { key: "size-preference", label: "尺寸偏好" },
    { key: "realestate-correlation", label: "地产关联" },
  ].map((it) => ({
    key: it.key,
    label: (
      <button
        onClick={() => {
          window.open(api.exportCsv(it.key as never, start, end), "_blank");
          message.success(`正在导出 ${it.label} 数据`);
        }}
        className="block w-full text-left text-sm text-cocoa hover:text-clay transition-colors py-1"
      >
        {it.label}
      </button>
    ),
  }));

  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md border-b border-line">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clay to-amber flex items-center justify-center shadow-soft">
            <Armchair size={22} className="text-paper" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-espresso leading-tight">
              匠造数据
            </h1>
            <p className="text-[10px] text-muted tracking-wider uppercase">
              Furniture Market Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <CalendarRange size={16} className="text-muted" />
            <RangePicker
              picker="month"
              size="middle"
              value={[dayjs(start), dayjs(end)]}
              onChange={handleRangeChange}
              allowClear={false}
              style={{ width: 220 }}
            />
          </div>

          <Dropdown menu={{ items: exportItems }} placement="bottomRight">
            <Button icon={<Download size={15} />} className="flex items-center">
              导出
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="px-4 md:px-6 pb-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="区间总销售额"
          value={summary ? summary.totalSales.toLocaleString() : "—"}
          unit="万元"
          delta={summary?.yoyGrowth}
          icon={TrendingUp}
          accent="#B85C38"
          hint="家具六大品类合计"
        />
        <KpiCard
          label="同比增速"
          value={summary ? `${summary.yoyGrowth.toFixed(1)}` : "—"}
          unit="%"
          delta={summary?.yoyGrowth}
          icon={TrendingUp}
          accent="#6B7F5C"
          hint="较去年同期"
        />
        <KpiCard
          label="全屋定制占比"
          value={summary ? `${summary.customShare.toFixed(1)}` : "—"}
          unit="%"
          icon={Layers}
          accent="#D4A24C"
          hint="成品家具占比递减"
        />
        <KpiCard
          label="热度第一风格"
          value={summary?.topStyle ?? "—"}
          icon={Sparkles}
          accent="#3D5A80"
          hint="搜索热度指数最高"
        />
      </div>
    </header>
  );
}
