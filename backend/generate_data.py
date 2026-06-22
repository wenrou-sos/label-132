"""
家具行业市场数据分析看板 - 模拟数据生成脚本

生成 6 个 CSV 数据集：
1. category_sales.csv   - 六大品类月度销售额（万元）
2. market_structure.csv - 全屋定制 vs 成品家具市场份额
3. style_heat.csv       - 七大风格搜索热度指数
4. decision_factors.csv - 消费决策因素权重
5. size_preference.csv  - 按户型分类的家具尺寸偏好
6. realestate_sales.csv - 新房交付量与家具销售关联

时间范围：2021-01 至 2025-06（含去年同比基准）
"""

import os
import numpy as np
import pandas as pd

np.random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 时间范围：2021-01 ~ 2025-06（含去年同期用于同比计算）
MONTHS = pd.date_range("2021-01-01", "2025-06-01", freq="MS").strftime("%Y-%m").tolist()
N = len(MONTHS)


def seasonal(month_num: int, peak: int = 11, strength: float = 0.25) -> float:
    """生成季节性乘子，peak 为旺季月份"""
    return 1.0 + strength * np.sin(2 * np.pi * (month_num - peak) / 12.0)


def linear_trend(idx: int, total: int, start: float = 1.0, end: float = 1.0) -> float:
    """线性趋势"""
    if total <= 1:
        return start
    return start + (end - start) * (idx / (total - 1))


month_nums = np.array([int(m.split("-")[1]) for m in MONTHS])
trend_idx = np.arange(N)


# ---------------------------------------------------------------------------
# 1. 品类销售数据
# ---------------------------------------------------------------------------
CATEGORY_BASE = {
    "sofa": 8200,      # 沙发 - 最大品类
    "bed": 5400,        # 床
    "dining": 3100,     # 餐桌椅
    "desk": 2600,       # 书桌
    "cabinet": 4700,    # 柜类
    "mattress": 3600,   # 床垫
}
CATEGORY_GROWTH = {  # 整体趋势倍数（起止）
    "sofa": (1.0, 1.45),
    "bed": (1.0, 1.38),
    "dining": (1.0, 1.32),
    "desk": (1.0, 1.50),
    "cabinet": (1.0, 1.42),
    "mattress": (1.0, 1.35),
}

cat_records = {"month": MONTHS}
for cat, base in CATEGORY_BASE.items():
    s_start, s_end = CATEGORY_GROWTH[cat]
    vals = []
    for i, mnum in enumerate(month_nums):
        trend = linear_trend(i, N, s_start, s_end)
        seas = seasonal(mnum, peak=11, strength=0.22)
        noise = 1.0 + np.random.normal(0, 0.04)
        vals.append(round(base * trend * seas * noise, 1))
    cat_records[cat] = vals

pd.DataFrame(cat_records).to_csv(
    os.path.join(DATA_DIR, "category_sales.csv"), index=False
)

# ---------------------------------------------------------------------------
# 2. 市场结构（全屋定制 vs 成品家具份额）
# ---------------------------------------------------------------------------
# 定制份额从 36% 上升至 53%
custom_share = []
for i in range(N):
    base = linear_trend(i, N, 36.0, 53.0)
    noise = np.random.normal(0, 0.8)
    custom_share.append(round(base + noise, 2))

market_df = pd.DataFrame(
    {
        "month": MONTHS,
        "custom_share": custom_share,
        "ready_share": [round(100 - c, 2) for c in custom_share],
    }
)
market_df.to_csv(os.path.join(DATA_DIR, "market_structure.csv"), index=False)

# ---------------------------------------------------------------------------
# 3. 风格热度指数（0-100）
# ---------------------------------------------------------------------------
# 现代简约领先，新中式增速最高，美式/工业风走弱
STYLE_CONFIG = {
    "modern": (88, 92, 0.06),       # 现代简约 - 高位稳定
    "neo_chinese": (42, 78, 0.08),  # 新中式 - 快速增长
    "luxury": (58, 66, 0.05),       # 轻奢
    "nordic": (62, 58, 0.04),       # 北欧 - 微降
    "japanese": (46, 56, 0.05),     # 日式 - 缓升
    "american": (48, 34, 0.04),     # 美式 - 下行
    "industrial": (36, 30, 0.05),   # 工业风 - 下行
}

style_records = {"month": MONTHS}
for style, (start, end, noise_scale) in STYLE_CONFIG.items():
    vals = []
    for i, mnum in enumerate(month_nums):
        trend = linear_trend(i, N, start, end)
        seas = 1.0 + 0.03 * np.sin(2 * np.pi * (mnum - 3) / 12.0)
        noise = np.random.normal(0, noise_scale * 100)
        val = trend * seas + noise
        vals.append(round(max(5, min(100, val)), 2))
    style_records[style] = vals

pd.DataFrame(style_records).to_csv(
    os.path.join(DATA_DIR, "style_heat.csv"), index=False
)

# ---------------------------------------------------------------------------
# 4. 消费决策因素权重（按月变化）
# ---------------------------------------------------------------------------
# 四大维度细分权重基线（0-100），各月在基线上加上随时间变化的漂移
DECISION_DIMS = {
    "材质": {
        "实木": (34, 38),   # 实木热度递增
        "板式": (22, 20),
        "布艺": (18, 16),
        "皮质": (14, 16),
    },
    "价格段": {
        "5千以下": (28, 24),   # 低价段逐年下行，消费升级
        "5千-1万": (31, 34),
        "1万-2万": (24, 27),
        "2万以上": (17, 20),
    },
    "品牌": {
        "一线品牌": (33, 37),
        "二线品牌": (27, 25),
        "设计师品牌": (22, 25),
        "白牌": (18, 13),
    },
    "环保等级": {
        "ENF级": (38, 46),   # ENF 快速上升
        "E0级": (32, 31),
        "E1级": (18, 15),
        "未标注": (12, 7),
    },
}

dec_records = []
for month_idx, month in enumerate(MONTHS):
    t = month_idx / (N - 1)  # 0→1
    for dim, subs in DECISION_DIMS.items():
        dim_vals = {}
        for sub, (start_w, end_w) in subs.items():
            base = start_w + (end_w - start_w) * t
            season = 1.5 * np.sin(2 * np.pi * (month_idx + 1) / 12)
            noise = np.random.normal(0, 0.6)
            val = round(max(5, base + season + noise), 1)
            dim_vals[sub] = val
        # 维度内归一化：让同一维度的权重总和约为 100，保持相对比例
        total = sum(dim_vals.values())
        for sub, v in dim_vals.items():
            dec_records.append(
                {
                    "month": month,
                    "dimension": dim,
                    "segment": sub,
                    "weight": round(v / total * 100, 1),
                }
            )
pd.DataFrame(dec_records).to_csv(
    os.path.join(DATA_DIR, "decision_factors.csv"), index=False
)

# ---------------------------------------------------------------------------
# 5. 尺寸偏好（按户型，按月变化）
# ---------------------------------------------------------------------------
# 每条尺寸数据 baseline popularity，按月轻微漂移（小户型伸缩家具逐年更火）
SIZE_BASE = [
    # 小户型
    ("小户型", "沙发", "双人位 1.6-1.8m", 82, 84, False),
    ("小户型", "沙发床", "多功能折叠 1.5m", 87, 94, True),
    ("小户型", "餐桌", "伸缩款 0.9-1.4m", 85, 92, True),
    ("小户型", "床", "1.5m 矮床带储物", 73, 77, False),
    ("小户型", "衣柜", "入墙式定制 2.0m", 68, 75, False),
    ("小户型", "书桌", "折叠壁挂 0.8m", 64, 72, False),
    # 中户型
    ("中户型", "沙发", "三人位+贵妃 2.8m", 77, 81, False),
    ("中户型", "沙发床", "抽拉式 1.8m", 63, 66, False),
    ("中户型", "餐桌", "四人位 1.4m", 73, 76, False),
    ("中户型", "床", "1.8m 实木床", 79, 83, False),
    ("中户型", "衣柜", "平开门定制 2.4m", 74, 79, False),
    ("中户型", "书桌", "1.2m 带书架", 68, 73, False),
    # 大户型
    ("大户型", "沙发", "L型组合 3.5m+", 71, 76, False),
    ("大户型", "沙发床", "极少选购", 20, 23, False),
    ("大户型", "餐桌", "六人位 1.8m+", 67, 72, False),
    ("大户型", "床", "2.0m 真皮大床", 73, 78, False),
    ("大户型", "衣柜", "步入式衣帽间", 63, 69, False),
    ("大户型", "书桌", "1.6m 整木大桌", 60, 66, False),
]

size_records = []
for month_idx, month in enumerate(MONTHS):
    t = month_idx / (N - 1)
    seas_ = 1.2 * np.sin(2 * np.pi * (month_idx + 2) / 12)
    for ht, furn, sz, start_p, end_p, is_hot in SIZE_BASE:
        base = start_p + (end_p - start_p) * t
        # 小户型热销款（伸缩餐桌、沙发床）Q4有额外热度
        extra = 2.0 * seas_ if is_hot and ht == "小户型" else seas_
        noise = np.random.normal(0, 0.9)
        pop = int(round(max(10, min(100, base + extra + noise))))
        size_records.append(
            {
                "month": month,
                "house_type": ht,
                "furniture": furn,
                "size": sz,
                "popularity": pop,
                "is_hot": int(is_hot),
            }
        )
pd.DataFrame(size_records).to_csv(
    os.path.join(DATA_DIR, "size_preference.csv"), index=False
)

# ---------------------------------------------------------------------------
# 6. 地产关联（新房交付量 vs 家具销售）
# ---------------------------------------------------------------------------
# 新房交付：年内 6月、12月 为交付高峰（竣工交房节奏）
delivery = []
for i, mnum in enumerate(month_nums):
    trend = linear_trend(i, N, 1.0, 0.85)  # 地产下行周期
    seas = seasonal(mnum, peak=6, strength=0.30) + seasonal(mnum, peak=12, strength=0.25) - 1.0
    noise = 1.0 + np.random.normal(0, 0.06)
    delivery.append(round(95 * trend * (1 + seas) * noise, 1))

# 家具销售 = 品类销售合计（万元），并构造与交付的滞后关系
total_furniture = []
for i in range(N):
    total = sum(cat_records[cat][i] for cat in CATEGORY_BASE)
    total_furniture.append(round(total, 1))

re_df = pd.DataFrame(
    {
        "month": MONTHS,
        "new_house_delivery": delivery,
        "furniture_sales": total_furniture,
    }
)
re_df.to_csv(os.path.join(DATA_DIR, "realestate_sales.csv"), index=False)

print(f"✅ 数据生成完成，共 {N} 个月数据，输出至 {DATA_DIR}")
for f in sorted(os.listdir(DATA_DIR)):
    path = os.path.join(DATA_DIR, f)
    df = pd.read_csv(path)
    print(f"   - {f}: {len(df)} 行, 列={list(df.columns)}")
