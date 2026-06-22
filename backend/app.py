"""
家具行业市场数据分析看板 - 后端 API

Flask REST API，提供 8 个端点：
- /api/summary              摘要指标
- /api/category-trends      品类销售趋势
- /api/market-structure      市场结构
- /api/style-heat            风格热度
- /api/decision-factors      消费决策因素
- /api/size-preference       尺寸偏好
- /api/realestate-correlation 地产关联分析
- /api/export                数据导出(CSV)

启动：python app.py  (默认 http://localhost:5000)
"""

from flask import Flask, jsonify, request, Response
from flask_cors import CORS

import analysis

app = Flask(__name__)
CORS(app)


@app.route("/api/summary")
def summary():
    start = request.args.get("start")
    end = request.args.get("end")
    return jsonify(analysis.get_summary(start, end))


@app.route("/api/category-trends")
def category_trends():
    start = request.args.get("start")
    end = request.args.get("end")
    return jsonify(analysis.get_category_trends(start, end))


@app.route("/api/market-structure")
def market_structure():
    return jsonify(analysis.get_market_structure())


@app.route("/api/style-heat")
def style_heat():
    return jsonify(analysis.get_style_heat())


@app.route("/api/decision-factors")
def decision_factors():
    return jsonify(analysis.get_decision_factors())


@app.route("/api/size-preference")
def size_preference():
    return jsonify(analysis.get_size_preference())


@app.route("/api/realestate-correlation")
def realestate_correlation():
    lag = int(request.args.get("lag", 9))
    return jsonify(analysis.get_realestate_correlation(lag))


@app.route("/api/export")
def export():
    module = request.args.get("module", "")
    start = request.args.get("start")
    end = request.args.get("end")
    csv_text = analysis.get_export(module, start, end)
    if not csv_text:
        return jsonify({"error": "未知模块"}), 400
    return Response(
        csv_text,
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={module}.csv"},
    )


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
