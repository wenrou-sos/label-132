# 匠造数据 · 家具行业市场数据分析看板

面向家具行业决策者的专业级市场数据分析看板，通过六大可视化模块提供从品类销售、市场结构、风格热度、消费决策、尺寸偏好到地产关联的全景洞察，辅助企业制定产品、渠道与库存策略。

## ✨ 核心功能

### 1. 品类销售趋势分析
- 六大品类（沙发、床、餐桌椅、书桌、柜类、床垫）月度销售额占比环形图
- 各品类同比增速折线图，支持多品类对比勾选
- 时间范围筛选联动刷新

### 2. 市场结构分析
- 全屋定制 vs 成品家具市场份额变化趋势
- 历史数据展示 + 未来12个月线性预测曲线
- 预测趋势可视化标注

### 3. 风格热度追踪
- 七大风格（现代简约、新中式、轻奢、北欧、日式、美式、工业风）搜索热度指数趋势
- 现代简约高亮显示领先地位
- 新中式增长态势特别标注（同比增速）

### 4. 消费决策因素权重分析
- 雷达图呈现四大维度对购买决策的影响权重
  - 材质：实木/板式/布艺/皮质
  - 价格段：5千以下 / 5千-1万 / 1万-2万 / 2万以上
  - 品牌：一线/二线/设计师/白牌
  - 环保等级：ENF/E0/E1级板材
- 各维度主导因素汇总展示

### 5. 尺寸偏好分析
- 按户型（小/中/大）分类展示主流家具尺寸趋势
- 横向条形图对比流行度指数
- 重点标注小户型畅销单品：伸缩餐桌（0.9-1.4m）与多功能沙发床（1.5m折叠）

### 6. 地产关联分析
- 新房交付量与家具销售量双轴对比图
- 滞后相关性模型（默认6-12个月滞后期，可滑动调节）
- 自动计算最优滞后期与相关系数
- 基于滞后模型预测未来12个月市场走势

## 🏗️ 技术架构

```
┌───────────────────────────────────────────────────────────┐
│                     前端层 (React + Vite)                   │
│  ┌────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │ Ant Design │  │ react-plotly.js│  │ Zustand (状态/缓存)│   │
│  └────────────┘  └────────────────┘  └─────────────────┘   │
└──────────────────────────────┬────────────────────────────┘
                               │ HTTP /api
┌──────────────────────────────▼────────────────────────────┐
│                   后端层 (Python Flask)                    │
│  ┌────────────┐  ┌─────────────────────────────────────┐ │
│  │ REST API   │  │ 数据分析服务 (Pandas + NumPy)         │ │
│  └────────────┘  └─────────────────────────────────────┘ │
└──────────────────────────────┬────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────┐
│                      数据层 (CSV)                          │
│  6个模拟数据集  +  Python 数据生成脚本                     │
└───────────────────────────────────────────────────────────┘
```

### 技术栈

**前端**
- React 18 + TypeScript
- Vite 6（构建工具）
- Ant Design 5（UI组件库）
- Plotly.js + react-plotly.js（数据可视化）
- Tailwind CSS 3（样式）
- Zustand 5（状态管理 + 数据缓存）
- lucide-react（图标）

**后端**
- Python 3.10+
- Flask 3（Web框架）
- Flask-CORS（跨域支持）
- Pandas 2（数据处理）
- NumPy 2（数值计算）

## 📁 项目结构

```
label-132/
├── backend/                      # 后端服务
│   ├── data/                     # 模拟CSV数据集
│   │   ├── category_sales.csv    # 品类销售数据
│   │   ├── market_structure.csv  # 市场结构数据
│   │   ├── style_heat.csv        # 风格热度数据
│   │   ├── decision_factors.csv  # 消费决策因素
│   │   ├── size_preference.csv   # 尺寸偏好数据
│   │   └── realestate_sales.csv  # 地产关联数据
│   ├── app.py                    # Flask API 入口
│   ├── analysis.py               # 数据分析服务
│   ├── generate_data.py          # 数据生成脚本
│   └── requirements.txt          # Python 依赖
├── src/                          # 前端源码
│   ├── components/
│   │   ├── modules/              # 六大可视化模块
│   │   │   ├── CategoryTrends.tsx
│   │   │   ├── MarketStructure.tsx
│   │   │   ├── StyleHeat.tsx
│   │   │   ├── DecisionFactors.tsx
│   │   │   ├── SizePreference.tsx
│   │   │   └── RealEstateCorrelation.tsx
│   │   ├── ChartCard.tsx         # 图表卡片容器
│   │   ├── DashboardHeader.tsx   # 顶部控制栏
│   │   ├── KpiCard.tsx           # KPI指标卡
│   │   └── PlotlyChart.tsx       # Plotly 图表封装
│   ├── lib/
│   │   ├── api.ts                # API 调用封装
│   │   ├── theme.ts              # 主题配色定义
│   │   └── utils.ts              # 工具函数
│   ├── store/
│   │   ├── useDataStore.ts       # 数据状态管理
│   │   └── useFilterStore.ts     # 筛选器状态
│   ├── types/
│   │   └── api.ts                # TypeScript 类型定义
│   ├── pages/
│   │   └── Home.tsx              # 看板主页面
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                 # 全局样式
├── .trae/documents/
│   ├── PRD.md                    # 产品需求文档
│   └── TechnicalArchitecture.md  # 技术架构文档
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- Python >= 3.10
- pip（Python包管理器）

### 1. 生成模拟数据

```bash
cd backend
python generate_data.py
```

执行成功后将在 `backend/data/` 目录下生成6个CSV数据文件，包含2021-01至2025-06共54个月的模拟数据。

### 2. 启动后端API服务

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端服务将在 `http://localhost:5001` 启动。

**API 端点列表：**

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/summary` | GET | 顶部摘要指标 |
| `/api/category-trends?start=&end=` | GET | 品类销售趋势 |
| `/api/market-structure` | GET | 市场结构（含预测） |
| `/api/style-heat` | GET | 风格热度指数 |
| `/api/decision-factors` | GET | 消费决策因素权重 |
| `/api/size-preference` | GET | 尺寸偏好分析 |
| `/api/realestate-correlation?lag=9` | GET | 地产关联分析 |
| `/api/export?module=&start=&end=` | GET | 导出CSV数据 |

### 3. 启动前端开发服务器

```bash
# 在项目根目录
npm install
npm run dev
```

前端开发服务器将在 `http://localhost:5173` 启动。

**环境变量配置（可选）：**

创建 `.env.local` 文件配置API地址：

```
VITE_API_BASE=http://localhost:5001
```

### 4. 生产构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 🎨 设计系统

### 色彩系统

| 色名 | 色值 | 用途 |
|------|------|------|
| 暖奶油底 | `#F7F3ED` | 页面背景 |
| 纸张白 | `#FDFBF7` | 卡片背景 |
| 深咖啡 | `#2B2118` | 主文字 |
| 可可棕 | `#5C4A3A` | 次要文字 |
| 赤陶主色 | `#B85C38` | 品牌主色、强调、热销标注 |
| 鼠尾草绿 | `#6B7F5C` | 辅助色、正增长 |
| 琥珀金 | `#D4A24C` | 高亮、畅销星标 |
| 靛蓝 | `#3D5A80` | 地产关联、中性强调 |
| 灰玫 | `#A85B6B` | 柜类品类色 |
| 暖灰 | `#8B7E72` | 床垫品类色 |

### 字体系统

- **标题字体**：Fraunces（衬线，杂志质感）
- **正文字体**：DM Sans（无衬线，清晰现代）
- **数字字体**：JetBrains Mono（等宽，数据展示）

### 布局规范

- **桌面端（≥1280px）**：三列12栅格布局
- **平板端（768-1279px）**：双列布局
- **移动端（<768px）**：单列布局
- 卡片圆角：14px
- 间距基准：8px

## 📊 数据说明

### 数据生成逻辑

数据生成脚本 (`backend/generate_data.py`) 基于真实家具行业规律构建模拟数据：

1. **品类销售**：基线销量 + 季节性（Q4旺季）+ 增长趋势 + 随机扰动
2. **市场结构**：全屋定制份额从36%线性增长至53%
3. **风格热度**：
   - 现代简约：高位稳定（88→92）
   - 新中式：快速增长（42→78）
   - 美式/工业风：逐年下行
4. **消费决策**：ENF级环保、实木材质、5千-1万价格段权重最高
5. **尺寸偏好**：小户型侧重多功能伸缩家具，大户型侧重大气尺寸
6. **地产关联**：家具销售滞后新房交付约9个月，6月/12月为交付高峰

### 数据字段说明

详见 [TechnicalArchitecture.md](.trae/documents/TechnicalArchitecture.md#6-数据模型)

## 🔧 功能特性

### 交互体验

- **时间范围筛选**：顶部月份范围选择器，支持自定义区间
- **品类对比勾选**：品类销售模块支持多品类同时对比
- **滞后期调节**：地产关联模块支持6-12个月滑动调节
- **钻取悬停**：所有图表支持悬停显示明细数据
- **数据导出**：支持导出各模块CSV数据

### 性能优化

- **前端缓存**：Zustand Store 按时间范围键缓存API结果
- **后端聚合**：Python端完成数据清洗与聚合，前端仅接收渲染数据
- **响应式图表**：Plotly.js 自适应容器尺寸
- **懒加载优化**：组件按需渲染

## 📱 响应式设计

看板支持以下设备访问：

- **桌面端**（≥1280px）：完整三列布局，最佳浏览体验
- **平板端**（768-1279px）：双列布局，交互元素适当放大
- **移动端**（<768px）：单列布局，筛选器折叠为下拉菜单

## 🧪 验证清单

- [x] 后端API所有端点返回正确数据
- [x] 前端成功连接后端并渲染六大模块图表
- [x] 时间范围筛选联动刷新所有模块
- [x] 品类勾选对比功能正常
- [x] 滞后期滑动调节功能正常
- [x] 数据导出功能正常
- [x] TypeScript 类型检查通过
- [x] 生产构建成功
- [x] 响应式布局在各断点正常显示

## 📚 相关文档

- [产品需求文档 (PRD)](.trae/documents/PRD.md)
- [技术架构文档](.trae/documents/TechnicalArchitecture.md)

## 🤝 部署建议

### 生产部署

**后端（Flask）：**
- 使用 Gunicorn 或 uWSGI 作为WSGI服务器
- 配置 Nginx 反向代理
- 设置适当的工作进程数

**前端（Vite）：**
- 执行 `npm run build` 构建静态资源
- 将 `dist/` 目录部署到静态文件服务器（Nginx、CDN等）
- 配置 API 代理或设置 `VITE_API_BASE` 环境变量

### Docker 部署示例

```dockerfile
# 后端 Dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
RUN python generate_data.py
EXPOSE 5001
CMD ["python", "app.py"]
```

## 📄 许可证

本项目基于模拟数据构建，仅供学习与决策参考。

---

**匠造数据** · 为家具行业决策者提供数据驱动的市场洞察
