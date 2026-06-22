"""
数据分析服务层

使用 Pandas 读取 CSV，完成数据清洗、转换与分析：
- 品类销售：占比、同比增速
- 市场结构：历史份额 + 线性预测
- 风格热度：趋势 + 同比
- 消费决策：权重归一化
- 尺寸偏好：分组聚合
- 地产关联：滞后相关性 + 预测
"""

import os
import numpy as np
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

CATEGORY_LABELS = {
    "sofa": "沙发",
    "bed": "床",
    "dining": "餐桌椅",
    "desk": "书桌",
    "cabinet": "柜类",
    "mattress": "床垫",
}
CATEGORY_ORDER = ["sofa", "bed", "dining", "desk", "cabinet", "mattress"]

STYLE_LABELS = {
    "modern": "现代简约",
    "neo_chinese": "新中式",
    "luxury": "轻奢",
    "nordic": "北欧",
    "japanese": "日式",
    "american": "美式",
    "industrial": "工业风",
}


def _load(name: str) -> pd.DataFrame:
    return pd.read_csv(os.path.join(DATA_DIR, name))


def _filter_months(df: pd.DataFrame, start: str | None, end: str | None) -> pd.DataFrame:
    mask = pd.Series([True] * len(df), index=df.index)
    if start:
        mask &= df["month"] >= start
    if end:
        mask &= df["month"] <= end
    return df[mask].reset_index(drop=True)


# ---------------------------------------------------------------------------
# 1. 摘要指标
# ---------------------------------------------------------------------------
def get_summary(start: str | None = None, end: str | None = None) -> dict:
    full_df = _load("category_sales.csv")
    df = _filter_months(full_df, start, end)
    df = df[df["month"] >= "2022-01"].reset_index(drop=True)
    if df.empty:
        df = full_df.copy()

    cat_cols = CATEGORY_ORDER
    df["total"] = df[cat_cols].sum(axis=1)

    last = df.iloc[-1]
    total_sales = round(float(last["total"]), 1)

    # 同比增速 - 从完整数据集中查找去年同期
    last_month = last["month"]
    prev_year_month = _shift_month(last_month, -12)
    prev_row = full_df[full_df["month"] == prev_year_month]
    if not prev_row.empty:
        prev_total = float(prev_row.iloc[0][cat_cols].sum())
        yoy = round((total_sales - prev_total) / prev_total * 100, 1)
    else:
        yoy = 0.0

    # 定制占比
    market = _load("market_structure.csv")
    market_recent = market[market["month"] <= last_month]
    custom_share = round(float(market_recent.iloc[-1]["custom_share"]), 1) if not market_recent.empty else 0.0

    # 热门风格
    style = _load("style_heat.csv")
    style_recent = style[style["month"] <= last_month]
    if not style_recent.empty:
        style_vals = style_recent.iloc[-1][[s for s in STYLE_LABELS]]
        top_style = STYLE_LABELS[str(style_vals.idxmax())]
    else:
        top_style = "现代简约"

    return {
        "totalSales": total_sales,
        "yoyGrowth": yoy,
        "customShare": custom_share,
        "topStyle": top_style,
    }


# ---------------------------------------------------------------------------
# 2. 品类销售趋势
# ---------------------------------------------------------------------------
def get_category_trends(start: str | None = None, end: str | None = None) -> dict:
    full_df = _load("category_sales.csv")
    df = _filter_months(full_df, start, end)
    df = df[df["month"] >= "2022-01"].reset_index(drop=True)

    months = []
    for _, row in df.iterrows():
        total = sum(float(row[c]) for c in CATEGORY_ORDER)
        cats = []
        for c in CATEGORY_ORDER:
            sales = float(row[c])
            share = round(sales / total * 100, 1) if total else 0.0
            # 同比 - 从完整数据集中查找去年同期
            prev_month = _shift_month(row["month"], -12)
            prev_row = full_df[full_df["month"] == prev_month]
            if not prev_row.empty:
                prev_sales = float(prev_row.iloc[0][c])
                yoy = round((sales - prev_sales) / prev_sales * 100, 1) if prev_sales else 0.0
            else:
                yoy = 0.0
            cats.append(
                {"name": c, "label": CATEGORY_LABELS[c], "sales": round(sales, 1), "share": share, "yoy": yoy}
            )
        months.append({"month": row["month"], "total": round(total, 1), "categories": cats})
    return {"months": months}


# ---------------------------------------------------------------------------
# 3. 市场结构（历史 + 预测）
# ---------------------------------------------------------------------------
def get_market_structure(start: str | None = None, end: str | None = None) -> dict:
    df = _load("market_structure.csv")
    df = _filter_months(df, start, end)
    df = df[df["month"] >= "2022-01"].reset_index(drop=True)

    history = [
        {"month": r["month"], "custom": float(r["custom_share"]), "ready": float(r["ready_share"])}
        for _, r in df.iterrows()
    ]

    # 线性预测未来 12 个月
    y = df["custom_share"].values
    x = np.arange(len(y))
    coef = np.polyfit(x, y, 1)
    last_month = df.iloc[-1]["month"]
    forecast = []
    for i in range(1, 13):
        m = _shift_month(last_month, i)
        pred_custom = float(np.clip(coef[0] * (len(y) + i - 1) + coef[1], 0, 100))
        forecast.append({"month": m, "custom": round(pred_custom, 1), "ready": round(100 - pred_custom, 1)})
    return {"history": history, "forecast": forecast}


# ---------------------------------------------------------------------------
# 4. 风格热度
# ---------------------------------------------------------------------------
def get_style_heat(start: str | None = None, end: str | None = None) -> dict:
    full_df = _load("style_heat.csv")
    df = _filter_months(full_df, start, end)
    df = df[df["month"] >= "2022-01"].reset_index(drop=True)
    months = df["month"].tolist()
    last_month = df.iloc[-1]["month"] if not df.empty else None
    prev_month = _shift_month(last_month, -12) if last_month else None
    prev_row = full_df[full_df["month"] == prev_month] if prev_month else pd.DataFrame()
    styles = []
    for col, label in STYLE_LABELS.items():
        vals = df[col].tolist()
        last_val = vals[-1] if vals else 0.0
        if not prev_row.empty:
            prev_val = float(prev_row.iloc[0][col])
            yoy = round((last_val - prev_val) / prev_val * 100, 1) if prev_val else 0.0
        else:
            yoy = 0.0
        styles.append({"name": col, "label": label, "values": [round(v, 1) for v in vals], "yoy": yoy})
    return {"months": months, "styles": styles}


# ---------------------------------------------------------------------------
# 5. 消费决策因素
# ---------------------------------------------------------------------------
def get_decision_factors(start: str | None = None, end: str | None = None) -> dict:
    df = _load("decision_factors.csv")
    if "month" in df.columns:
        df = _filter_months(df, start, end)
    # 聚合：对同一维度内的同一segment取均值（处理多月数据）
    grouped = (
        df.groupby(["dimension", "segment"])["weight"].mean().reset_index()
    )

    axes = df["dimension"].unique().tolist()
    # 维度间的平均权重（用于雷达图的"其他维度"位置）
    dim_avg = grouped.groupby("dimension")["weight"].mean().to_dict()

    series = []
    for dim in axes:
        sub = grouped[grouped["dimension"] == dim].sort_values("weight", ascending=False)
        for _, row in sub.iterrows():
            values = []
            for a in axes:
                if a == dim:
                    values.append(float(row["weight"]))
                else:
                    values.append(round(float(dim_avg.get(a, 0)), 1))
            series.append(
                {"name": f"{dim}-{row['segment']}", "dimension": dim, "values": values}
            )
    return {"axes": axes, "series": series}


# ---------------------------------------------------------------------------
# 6. 尺寸偏好
# ---------------------------------------------------------------------------
def get_size_preference(start: str | None = None, end: str | None = None) -> dict:
    df = _load("size_preference.csv")
    if "month" in df.columns:
        df = _filter_months(df, start, end)
    # 聚合：对 house_type+furniture+size 组合取 popularity 均值，is_hot 取 max（只要有一个月是爆款就保留高亮）
    grouped = (
        df.groupby(["house_type", "furniture", "size"])
        .agg(popularity=("popularity", "mean"), is_hot=("is_hot", "max"))
        .reset_index()
    )

    house_types = []
    for ht in ["小户型", "中户型", "大户型"]:
        sub = grouped[grouped["house_type"] == ht].sort_values("popularity", ascending=False)
        items = [
            {
                "furniture": r["furniture"],
                "size": r["size"],
                "popularity": int(round(r["popularity"])),
                "highlight": bool(r["is_hot"]),
            }
            for _, r in sub.iterrows()
        ]
        house_types.append({"name": ht, "items": items})
    return {"houseTypes": house_types}


# ---------------------------------------------------------------------------
# 7. 地产关联分析
# ---------------------------------------------------------------------------
def _shift_month(month_str: str, delta: int) -> str:
    y, m = month_str.split("-")
    total = int(y) * 12 + int(m) - 1 + delta
    ny, nm = divmod(total, 12)
    nm += 1
    return f"{ny:04d}-{nm:02d}"


def get_realestate_correlation(lag: int = 9, start: str | None = None, end: str | None = None) -> dict:
    df = _load("realestate_sales.csv")
    df = _filter_months(df, start, end)
    df = df[df["month"] >= "2022-01"].reset_index(drop=True)
    if df.empty:
        return {"history": [], "correlation": 0.0, "optimalLag": lag, "forecast": []}

    delivery = df["new_house_delivery"].values
    sales = df["furniture_sales"].values
    n = len(sales)

    # 安全：滞后月数不能超过数据长度-1，否则没有足够的配对点
    safe_lag = max(1, min(lag, max(1, n - 1)))

    # 寻找最优滞后期（6-12 月，但不超过数据长度限制）— 仅用于参考展示
    optimal_lag = safe_lag
    optimal_corr = 0.0
    search_max = min(12, n - 2)
    if search_max >= 6:
        for l in range(6, search_max + 1):
            if n > l:
                d_shifted = delivery[:-l]
                s_aligned = sales[l:]
                if len(d_shifted) > 2 and len(s_aligned) == len(d_shifted):
                    corr = float(np.corrcoef(d_shifted, s_aligned)[0, 1])
                    if not np.isnan(corr) and abs(corr) > abs(optimal_corr):
                        optimal_corr = corr
                        optimal_lag = l

    # 使用安全滞后期计算相关系数
    l = safe_lag
    correlation = 0.0
    if n > l:
        d_shifted = delivery[:-l]
        s_aligned = sales[l:]
        if len(d_shifted) > 2 and len(s_aligned) == len(d_shifted):
            c = float(np.corrcoef(d_shifted, s_aligned)[0, 1])
            correlation = 0.0 if np.isnan(c) else c

    history = [
        {"month": r["month"], "delivery": float(r["new_house_delivery"]), "sales": float(r["furniture_sales"])}
        for _, r in df.iterrows()
    ]

    # 基于交付量预测未来 12 个月家具销售（用安全滞后期映射）
    last_month = df.iloc[-1]["month"]
    forecast = []
    # 计算比值：销售 / 滞后交付，长度足够时才按映射，否则用最近值外推
    if n > l and delivery[-l]:
        ratio = sales[-1] / delivery[-l]
    else:
        ratio = 1.0
    for i in range(1, 13):
        m = _shift_month(last_month, i)
        src_idx = n - l + i - 1
        if 0 <= src_idx < n:
            base = delivery[src_idx]
            pred = base * ratio
        else:
            # 数据不足时，用最近销售值做温和外推
            pred = sales[-1] if n > 0 else 0
        forecast.append({"month": m, "predictedSales": round(float(pred), 1)})

    return {
        "history": history,
        "correlation": round(correlation, 3),
        "optimalLag": optimal_lag,
        "forecast": forecast,
    }


# ---------------------------------------------------------------------------
# 导出 CSV
# ---------------------------------------------------------------------------
def get_export(module: str, start: str | None = None, end: str | None = None) -> str:
    mapping = {
        "category-trends": "category_sales.csv",
        "market-structure": "market_structure.csv",
        "style-heat": "style_heat.csv",
        "decision-factors": "decision_factors.csv",
        "size-preference": "size_preference.csv",
        "realestate-correlation": "realestate_sales.csv",
    }
    if module not in mapping:
        return ""
    df = _load(mapping[module])
    if (start or end) and "month" in df.columns:
        df = _filter_months(df, start, end)
    return df.to_csv(index=False)
