import { useEffect } from "react";
import { Alert, Spin } from "antd";
import DashboardHeader from "@/components/DashboardHeader";
import CategoryTrends from "@/components/modules/CategoryTrends";
import MarketStructure from "@/components/modules/MarketStructure";
import StyleHeat from "@/components/modules/StyleHeat";
import DecisionFactors from "@/components/modules/DecisionFactors";
import SizePreference from "@/components/modules/SizePreference";
import RealEstateCorrelation from "@/components/modules/RealEstateCorrelation";
import { useFilterStore } from "@/store/useFilterStore";
import { useDataStore } from "@/store/useDataStore";

export default function Home() {
  const {
    start,
    end,
    lag,
    activeCategories,
    compareMode,
    compareStart,
    compareEnd,
    setRange,
    setLag,
    setCompareMode,
    setCompareRange,
    toggleCategory,
  } = useFilterStore();
  const {
    summary,
    compareSummary,
    categoryTrends,
    compareCategoryTrends,
    marketStructure,
    compareMarketStructure,
    styleHeat,
    compareStyleHeat,
    decisionFactors,
    compareDecisionFactors,
    sizePreference,
    compareSizePreference,
    realestate,
    compareRealestate,
    loading,
    error,
    fetchAll,
  } = useDataStore();

  useEffect(() => {
    fetchAll(start, end, lag, compareMode, compareStart, compareEnd);
  }, [start, end, lag, compareMode, compareStart, compareEnd, fetchAll]);

  return (
    <div className="min-h-screen pb-8">
      <DashboardHeader
        summary={summary}
        compareSummary={compareSummary}
        start={start}
        end={end}
        compareMode={compareMode}
        compareStart={compareStart}
        compareEnd={compareEnd}
        onRangeChange={setRange}
        onCompareModeChange={setCompareMode}
        onCompareRangeChange={setCompareRange}
      />

      <main className="px-4 md:px-6 pt-4">
        {error && (
          <Alert
            type="error"
            message="数据加载失败"
            description={String(error)}
            showIcon
            className="mb-4"
          />
        )}

        {loading && !summary && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spin size="large" />
            <p className="text-sm text-muted">加载市场数据中…</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoryTrends
            data={categoryTrends}
            compareData={compareMode ? compareCategoryTrends : null}
            activeCategories={activeCategories}
            onToggle={toggleCategory}
          />
          <DecisionFactors
            data={decisionFactors}
            compareData={compareMode ? compareDecisionFactors : null}
            compareMode={compareMode}
          />
          <MarketStructure
            data={marketStructure}
            compareData={compareMode ? compareMarketStructure : null}
          />
          <StyleHeat
            data={styleHeat}
            compareData={compareMode ? compareStyleHeat : null}
          />
          <SizePreference
            data={sizePreference}
            compareData={compareMode ? compareSizePreference : null}
            compareMode={compareMode}
          />
          <RealEstateCorrelation
            data={realestate}
            compareData={compareMode ? compareRealestate : null}
            lag={lag}
            onLagChange={setLag}
          />
        </div>

        <footer className="mt-6 pt-4 border-t border-line/60 text-center">
          <p className="text-xs text-muted">
            匠造数据 · 家具行业市场数据分析看板 · 数据周期 {start} 至 {end}
            {compareMode && ` · 对比期 ${compareStart} 至 ${compareEnd}`} ·
            基于模拟数据构建，仅供决策参考
          </p>
        </footer>
      </main>
    </div>
  );
}
