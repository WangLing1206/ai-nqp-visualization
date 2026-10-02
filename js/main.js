/* ═══════════════════════════════════════════════
   主交互脚本
═══════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ───────── 滚动进度条 / 导航阴影 / 返回顶部 ───────── */
  var progressBar = document.getElementById("progressBar");
  var navbar = document.getElementById("navbar");
  var backTop = document.getElementById("backTop");

  function onScroll() {
    var st = document.documentElement.scrollTop || document.body.scrollTop;
    var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    navbar.classList.toggle("scrolled", st > 10);
    backTop.classList.toggle("show", st > 600);
    highlightNav(st);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ───────── 导航高亮 ───────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function highlightNav(st) {
    var idx = -1;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop - 120 <= st) idx = i;
    });
    navLinks.forEach(function (a, i) { a.classList.toggle("active", i === idx); });
  }

  /* ───────── 移动端菜单 ───────── */
  var navToggle = document.getElementById("navToggle");
  var navLinksBox = document.getElementById("navLinks");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navLinksBox.classList.toggle("open");
    });
    navLinks.forEach(function (a) {
      a.addEventListener("click", function () { navLinksBox.classList.remove("open"); });
    });
  }

  /* ───────── 入场动画 ───────── */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ───────── 数字滚动 ───────── */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1900;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      var v = target * ease;
      el.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("zh-CN");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString("zh-CN");
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { animateCounter(el); });
  }

  /* ───────── 图表入场后再初始化（保证容器有尺寸） ───────── */
  var chartsInited = false;
  function initCharts() {
    if (chartsInited || !window.echarts || !window.__charts) return;
    chartsInited = true;
    window.__charts.initAll();
    window.addEventListener("resize", function () {
      echarts.getInstanceByDom && document.querySelectorAll(".chart-box").forEach(function (el) {
        var inst = echarts.getInstanceByDom(el);
        if (inst) inst.resize();
      });
    });
  }
  if (document.readyState === "complete") initCharts();
  else window.addEventListener("load", initCharts);
  // 兜底：3 秒后强制初始化
  setTimeout(initCharts, 3000);

  /* ───────── 新闻横向滚屏交互 ───────── */
  var track = document.getElementById("newsTrack");
  if (track) {
    var prevBtn = document.getElementById("newsPrev");
    var nextBtn = document.getElementById("newsNext");
    var cardStep = function () {
      var card = track.querySelector(".news-card");
      return card ? card.offsetWidth + 20 : 360;
    };
    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -cardStep(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: cardStep(), behavior: "smooth" });
    });
    // 滚轮纵向转横向
    track.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }, { passive: false });
    // 鼠标拖拽
    var isDown = false, startX = 0, startScroll = 0;
    track.addEventListener("mousedown", function (e) {
      isDown = true; startX = e.pageX; startScroll = track.scrollLeft;
      track.classList.add("dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      track.scrollLeft = startScroll - (e.pageX - startX);
    });
    window.addEventListener("mouseup", function () {
      isDown = false; track.classList.remove("dragging");
    });
    // 键盘左右键（聚焦在轮播内时）
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -cardStep(), behavior: "smooth" }); }
      if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: cardStep(), behavior: "smooth" }); }
    });
  }

  /* ───────── 图表 Tab 切换 ───────── */
  var tabs = document.querySelectorAll("#scaleTabs .chart-tab");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      if (window.__charts) window.__charts.scale(t.getAttribute("data-mode"));
    });
  });

  /* ───────── Hero 粒子网络 ───────── */
  var canvas = document.getElementById("particleCanvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var COUNT = 70;
    var raf = null;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", function () { resize(); });

    function initParticles() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.6
        });
      }
    }
    initParticles();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 连线
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = "rgba(212,169,75," + (0.16 * (1 - dist / 130)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // 粒子
      particles.forEach(function (p) {
        ctx.fillStyle = "rgba(232,203,138,.75)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      raf = requestAnimationFrame(draw);
    }
    // 仅在 hero 可见时绘制
    var heroEl = document.getElementById("hero");
    if ("IntersectionObserver" in window) {
      var hio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { if (!raf) draw(); }
          else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
        });
      }, { threshold: 0.05 });
      hio.observe(heroEl);
    } else { draw(); }
  }
})();
