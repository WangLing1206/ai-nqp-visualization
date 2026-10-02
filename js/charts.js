/* ═══════════════════════════════════════════════
   图表配置 · ECharts 5
═══════════════════════════════════════════════ */
(function () {
  "use strict";

  var NAVY = "#0B2C5F", RED = "#C8102E", GOLD = "#D4A94B", INKSOFT = "#4A5A6E";
  var fontFamily = '"Noto Sans SC","Microsoft YaHei",sans-serif';

  // 通用配置
  function baseTooltip() {
    return {
      trigger: "axis",
      backgroundColor: "rgba(8,31,68,.94)",
      borderWidth: 1,
      borderColor: "rgba(212,169,75,.4)",
      textStyle: { color: "#fff", fontSize: 13, fontFamily: fontFamily },
      axisPointer: { type: "shadow", shadowStyle: { color: "rgba(11,44,95,.06)" } }
    };
  }
  function axisStyle() {
    return {
      axisLine: { lineStyle: { color: "#C9D2E0" } },
      axisTick: { show: false },
      axisLabel: { color: INKSOFT, fontSize: 12, fontFamily: fontFamily },
      splitLine: { lineStyle: { color: "#EDF0F5", type: "dashed" } }
    };
  }

  var charts = {};

  /* ───────── 1. 产业规模 ───────── */
  var scaleYears = ["2020", "2021", "2022", "2023", "2024", "2025E", "2026E", "2027E", "2028E", "2029E", "2030E"];
  var scaleValues = [0.23, 0.38, 0.57, 0.73, 0.92, 1.50, 2.40, 3.84, 6.10, 9.79, 15.70];
  var scaleShare = [7.7, 10.4, 13.1, 13.9, 13.5, 17.9, 23.4, 30.3, 36.8, 41.0, 43.9]; // 占数智产业比重%
  var scaleGrowth = [null, 65.2, 50.0, 28.1, 26.0, 63.0, 60.0, 60.0, 58.9, 60.5, 60.4];

  function chartScale(mode) {
    var el = document.getElementById("chartScale");
    if (!el) return;
    if (!charts.scale) charts.scale = echarts.init(el);
    var isShare = mode === "share";
    var option = {
      backgroundColor: "transparent",
      tooltip: baseTooltip(),
      legend: {
        top: 4, textStyle: { color: INKSOFT, fontSize: 12.5, fontFamily: fontFamily },
        itemWidth: 16, itemHeight: 9
      },
      grid: { left: 46, right: 52, top: 52, bottom: 34 },
      xAxis: Object.assign({ type: "category", data: scaleYears }, axisStyle()),
      yAxis: [
        Object.assign({ type: "value", name: isShare ? "比重（%）" : "规模（万亿元）", nameTextStyle: { color: INKSOFT, fontSize: 11.5 } }, axisStyle()),
        Object.assign({ type: "value", name: "增速（%）", nameTextStyle: { color: INKSOFT, fontSize: 11.5 }, axisLabel: { formatter: "{value}%", color: INKSOFT, fontSize: 12 }, splitLine: { show: false }, axisLine: { lineStyle: { color: "#C9D2E0" } }, axisTick: { show: false } })
      ],
      series: [
        {
          name: isShare ? "占数智产业比重（%）" : "产业规模（万亿元）",
          type: "bar",
          barWidth: "46%",
          data: isShare ? scaleShare : scaleValues,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#1E5BB8" }, { offset: 1, color: "#0B2C5F" }
            ])
          },
          emphasis: { itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "#E0425A" }, { offset: 1, color: "#A00D25" }]) } },
          markPoint: {
            data: [
              { coord: [isShare ? 5 : 5, isShare ? scaleShare[5] : scaleValues[5]], value: "万亿时代", itemStyle: { color: RED }, label: { color: "#fff", fontSize: 11 } }
            ],
            symbolSize: 58
          }
        },
        {
          name: "同比增速（%）",
          type: "line",
          yAxisIndex: 1,
          data: scaleGrowth,
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          lineStyle: { width: 2.6, color: GOLD },
          itemStyle: { color: GOLD, borderColor: "#fff", borderWidth: 1.5 },
          label: { show: false }
        }
      ]
    };
    charts.scale.setOption(option, true);
  }

  /* ───────── 2. 区域分布 ───────── */
  function chartRegion() {
    var el = document.getElementById("chartRegion");
    if (!el) return;
    var c = echarts.init(el);
    var provinces = ["浙江", "北京", "上海", "广东", "江苏", "山东", "四川", "其他"];
    var values = [1457, 1321, 1168, 1102, 985, 420, 275, 0];
    // 其他 = 6728 - 已列
    values[7] = 6728 - values.slice(0, 7).reduce(function (a, b) { return a + b; }, 0);
    c.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, backgroundColor: "rgba(8,31,68,.94)", borderWidth: 1, borderColor: "rgba(212,169,75,.4)", textStyle: { color: "#fff", fontSize: 13, fontFamily: fontFamily } },
      grid: { left: 52, right: 30, top: 18, bottom: 30 },
      xAxis: Object.assign({ type: "value" }, axisStyle()),
      yAxis: Object.assign({ type: "category", data: provinces.reverse(), inverse: false, axisLabel: { color: INKSOFT, fontSize: 12.5, fontFamily: fontFamily }, axisLine: { lineStyle: { color: "#C9D2E0" } }, axisTick: { show: false } }, {}),
      series: [{
        type: "bar",
        barWidth: "55%",
        data: values.reverse(),
        label: { show: true, position: "right", color: NAVY, fontSize: 12, fontWeight: 600, fontFamily: fontFamily },
        itemStyle: {
          borderRadius: [0, 5, 5, 0],
          color: function (p) {
            var top = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#0B2C5F" }, { offset: 1, color: "#2E6BC4" }]);
            var hot = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#A00D25" }, { offset: 1, color: "#E0425A" }]);
            return p.dataIndex >= values.length - 3 ? hot : top;
          }
        }
      }]
    });
  }

  /* ───────── 3. 算力对比 ───────── */
  function chartCompute() {
    var el = document.getElementById("chartCompute");
    if (!el) return;
    var c = echarts.init(el);
    var years = ["2020", "2021", "2022", "2023", "2024", "2025E", "2026E", "2027E", "2028E"];
    var intel = [75.0, 155.2, 259.9, 416.7, 725.3, 1037.3, 1460.3, 2019.9, 2781.9];
    var gen = [39.6, 47.7, 54.5, 59.3, 71.5, 85.8, 101.7, 119.9, 140.1];
    var ratio = intel.map(function (v, i) { return +(v / gen[i]).toFixed(1); });
    c.setOption({
      backgroundColor: "transparent",
      tooltip: Object.assign(baseTooltip(), {
        formatter: function (ps) {
          var h = ps[0].axisValue + "年";
          ps.forEach(function (p) {
            h += "<br/>" + p.marker + p.seriesName + "：<b>" + p.value + "</b>";
          });
          return h;
        }
      }),
      legend: { top: 4, textStyle: { color: INKSOFT, fontSize: 12.5, fontFamily: fontFamily }, itemWidth: 16, itemHeight: 9 },
      grid: { left: 52, right: 56, top: 54, bottom: 34 },
      xAxis: Object.assign({ type: "category", data: years, boundaryGap: false }, axisStyle()),
      yAxis: [
        Object.assign({ type: "value", name: "算力规模（EFLOPS）", nameTextStyle: { color: INKSOFT, fontSize: 11.5 } }, axisStyle()),
        Object.assign({ type: "value", name: "倍数", nameTextStyle: { color: INKSOFT, fontSize: 11.5 }, axisLabel: { formatter: "{value}x", color: INKSOFT, fontSize: 12 }, splitLine: { show: false }, axisLine: { lineStyle: { color: "#C9D2E0" } }, axisTick: { show: false } })
      ],
      series: [
        {
          name: "智能算力（FP16）",
          type: "line",
          data: intel,
          smooth: true,
          symbol: "circle", symbolSize: 8,
          lineStyle: { width: 3.4, color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#0B2C5F" }, { offset: 1, color: RED }]) },
          itemStyle: { color: RED, borderColor: "#fff", borderWidth: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(200,16,46,.20)" }, { offset: 1, color: "rgba(200,16,46,.01)" }
            ])
          },
          label: { show: true, position: "top", color: RED, fontSize: 10.5, fontFamily: fontFamily, formatter: function (p) { return p.dataIndex === 8 || p.dataIndex === 5 ? p.value : ""; } }
        },
        {
          name: "通用算力（FP64）",
          type: "line",
          data: gen,
          smooth: true,
          symbol: "circle", symbolSize: 6,
          lineStyle: { width: 2.2, color: "#8CA3C4", type: "dashed" },
          itemStyle: { color: "#8CA3C4" }
        },
        {
          name: "智能/通用倍数",
          type: "line",
          yAxisIndex: 1,
          data: ratio,
          smooth: true,
          symbol: "diamond", symbolSize: 7,
          lineStyle: { width: 2, color: GOLD, opacity: .85 },
          itemStyle: { color: GOLD }
        }
      ]
    });
  }

  /* ───────── 4. 渗透率 ───────── */
  function chartPenetration() {
    var el = document.getElementById("chartPenetration");
    if (!el) return;
    var c = echarts.init(el);
    var items = [
      ["生成式AI用户普及率（2026.6）", 50, "#C8102E"],
      ["重点行业AI整体渗透率", 80, "#C8102E"],
      ["领航级智能工厂业务场景渗透率", 70, "#A00D25"],
      ["规上制造业重点场景普及率（2026H1）", 34.2, "#0B2C5F"],
      ["规上制造业企业应用普及率（2025）", 30, "#17417E"],
      ["算力设施整体上架率", 71.4, "#2E6BC4"]
    ];
    c.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, backgroundColor: "rgba(8,31,68,.94)", borderWidth: 1, borderColor: "rgba(212,169,75,.4)", textStyle: { color: "#fff", fontSize: 13, fontFamily: fontFamily }, formatter: function (ps) { return ps[0].name + "：<b>" + ps[0].value + "%</b>"; } },
      grid: { left: 14, right: 56, top: 10, bottom: 8, containLabel: true },
      yAxis: { type: "category", inverse: true, data: items.map(function (d) { return d[0]; }), axisLine: { lineStyle: { color: "#C9D2E0" } }, axisTick: { show: false }, axisLabel: { color: INKSOFT, fontSize: 12, fontFamily: fontFamily, width: 210, overflow: "truncate" } },
      xAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%", color: INKSOFT, fontSize: 11.5 }, splitLine: { lineStyle: { color: "#EDF0F5", type: "dashed" } } },
      series: [{
        type: "bar",
        barWidth: "52%",
        data: items.map(function (d) {
          return { value: d[1], itemStyle: { borderRadius: [0, 6, 6, 0], color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: d[2] + "CC" }, { offset: 1, color: d[2] }]) } };
        }),
        label: { show: true, position: "right", color: NAVY, fontSize: 12.5, fontWeight: 700, fontFamily: fontFamily, formatter: "{c}%" },
        backgroundStyle: { color: "rgba(11,44,95,.05)" },
        showBackground: true
      }]
    });
  }

  /* ───────── 5. 用户规模 ───────── */
  function chartUsers() {
    var el = document.getElementById("chartUsers");
    if (!el) return;
    var c = echarts.init(el);
    var points = [
      ["2023.12", 1.70],
      ["2024.12", 2.49],
      ["2025.12", 6.02],
      ["2026.06", 7.00]
    ];
    c.setOption({
      backgroundColor: "transparent",
      tooltip: Object.assign(baseTooltip(), { formatter: function (ps) { var p = ps[0]; return p.axisValue + "<br/>用户规模：<b>" + p.value + "亿人</b>"; }, axisPointer: { type: "line", lineStyle: { color: GOLD, type: "dashed" } } }),
      grid: { left: 46, right: 34, top: 44, bottom: 32 },
      xAxis: Object.assign({ type: "category", data: points.map(function (d) { return d[0]; }), boundaryGap: true }, axisStyle()),
      yAxis: Object.assign({ type: "value", name: "亿人", max: 8, nameTextStyle: { color: INKSOFT, fontSize: 11.5 } }, axisStyle()),
      series: [{
        name: "生成式AI用户规模",
        type: "line",
        data: points.map(function (d) { return d[1]; }),
        smooth: .4,
        symbol: "circle",
        symbolSize: 11,
        lineStyle: { width: 3.6, color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#0B2C5F" }, { offset: 1, color: "#C8102E" }]), shadowColor: "rgba(200,16,46,.3)", shadowBlur: 12, shadowOffsetY: 6 },
        itemStyle: { color: "#fff", borderColor: RED, borderWidth: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(30,91,184,.28)" }, { offset: 1, color: "rgba(30,91,184,.02)" }]) },
        label: { show: true, position: "top", color: NAVY, fontWeight: 700, fontSize: 13, fontFamily: fontFamily, formatter: "{c} 亿" },
        markLine: {
          silent: true, symbol: "none",
          data: [{ yAxis: 7, lineStyle: { color: GOLD, type: "dashed", width: 1.5 }, label: { formatter: "7亿人 · 普及率超50%", color: "#B8912F", fontSize: 11.5, position: "insideEndTop", fontFamily: fontFamily } }]
        }
      }]
    });
  }

  /* ───────── 6. 全球对比 ───────── */
  function chartGlobal() {
    var el = document.getElementById("chartGlobal");
    if (!el) return;
    var c = echarts.init(el);
    var data = [
      { name: "中国", value: 26.1, gdp: "≈7.0万亿美元" },
      { name: "北美", value: 14.5, gdp: "≈3.7万亿美元" },
      { name: "南欧", value: 11.5, gdp: "≈0.7万亿美元" },
      { name: "发达亚洲", value: 10.4, gdp: "≈0.9万亿美元" },
      { name: "北欧", value: 9.9, gdp: "≈1.8万亿美元" },
      { name: "拉丁美洲", value: 5.4, gdp: "≈0.5万亿美元" }
    ];
    c.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, backgroundColor: "rgba(8,31,68,.94)", borderWidth: 1, borderColor: "rgba(212,169,75,.4)", textStyle: { color: "#fff", fontSize: 13, fontFamily: fontFamily }, formatter: function (ps) { var p = ps[0]; var d = data[p.dataIndex]; return d.name + "（2030E）<br/>GDP增益：<b>" + d.value + "%</b><br/>增量规模：<b>" + d.gdp + "</b>"; } },
      grid: { left: 46, right: 30, top: 30, bottom: 34 },
      xAxis: Object.assign({ type: "value", max: 30, axisLabel: { formatter: "+{value}%", color: INKSOFT, fontSize: 12 } }, axisStyle()),
      yAxis: Object.assign({ type: "category", inverse: true, data: data.map(function (d) { return d.name; }) }, axisStyle()),
      series: [{
        type: "bar",
        barWidth: "56%",
        data: data.map(function (d) {
          return {
            value: d.value,
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: d.name === "中国"
                ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#A00D25" }, { offset: 1, color: "#E0425A" }])
                : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#0B2C5F" }, { offset: 1, color: "#3D74C9" }])
            }
          };
        }),
        label: { show: true, position: "right", fontFamily: fontFamily, fontSize: 13, fontWeight: 700, color: NAVY, formatter: "+{c}%" },
        showBackground: true, backgroundStyle: { color: "rgba(11,44,95,.05)" }
      }]
    });
  }

  /* ───────── 7. 行业增益 ───────── */
  function chartSector() {
    var el = document.getElementById("chartSector");
    if (!el) return;
    var c = echarts.init(el);
    var data = [
      ["医疗健康", 5.1, 20.7],
      ["制造业", 4.0, 11.9],
      ["金融服务", 2.1, 10.0],
      ["零售与消费", 2.0, 14.8],
      ["能源", 1.7, 12.0],
      ["交通物流", 0.57, 10.3],
      ["科技/通信/娱乐", 0.31, 12.4]
    ];
    c.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, backgroundColor: "rgba(8,31,68,.94)", borderWidth: 1, borderColor: "rgba(212,169,75,.4)", textStyle: { color: "#fff", fontSize: 13, fontFamily: fontFamily }, formatter: function (ps) { var d = data[ps[0].dataIndex]; return d[0] + "（至2030年）<br/>GDP增量：<b>" + d[1] + "万亿美元</b><br/>增幅：<b>+" + d[2] + "%</b>"; } },
      grid: { left: 14, right: 66, top: 14, bottom: 8, containLabel: true },
      yAxis: { type: "category", inverse: true, data: data.map(function (d) { return d[0]; }), axisLine: { lineStyle: { color: "#C9D2E0" } }, axisTick: { show: false }, axisLabel: { color: INKSOFT, fontSize: 12.5, fontFamily: fontFamily } },
      xAxis: { type: "value", name: "万亿美元", nameTextStyle: { color: INKSOFT, fontSize: 11 }, axisLabel: { color: INKSOFT, fontSize: 11.5 }, splitLine: { lineStyle: { color: "#EDF0F5", type: "dashed" } } },
      series: [{
        type: "bar",
        barWidth: "54%",
        data: data.map(function (d) {
          return {
            value: d[1],
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#B8912F" }, { offset: 1, color: "#E8CB8A" }])
            }
          };
        }),
        label: { show: true, position: "right", color: "#8A6D23", fontSize: 12, fontWeight: 600, fontFamily: fontFamily, formatter: function (p) { return p.value + "万亿$"; } },
        showBackground: true, backgroundStyle: { color: "rgba(212,169,75,.06)" }
      }]
    });
  }

  /* ───────── 对外接口 ───────── */
  window.__charts = {
    initAll: function () {
      chartScale("scale");
      chartRegion();
      chartCompute();
      chartPenetration();
      chartUsers();
      chartGlobal();
      chartSector();
    },
    scale: chartScale
  };
})();
