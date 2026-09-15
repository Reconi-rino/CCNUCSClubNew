(function () {
  "use strict";

  var canvas = document.getElementById("ambient-canvas");
  var ctx = canvas.getContext("2d", { alpha: true });
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var points = [];
  var raf = 0;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function seed() {
    points.length = 0;
    for (var i = 0; i < 34; i += 1) {
      points.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        vx: (Math.random() - 0.5) * 0.075,
        vy: (Math.random() - 0.5) * 0.055,
        r: Math.random() * 1.1 + 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, 1920, 1080);
    pointer.x += (pointer.tx - pointer.x) * 0.025;
    pointer.y += (pointer.ty - pointer.y) * 0.025;

    var glow = ctx.createRadialGradient(960 + pointer.x * 28, 500 + pointer.y * 20, 0, 960, 520, 650);
    glow.addColorStop(0, "rgba(20,105,70,0.065)");
    glow.addColorStop(0.55, "rgba(7,33,24,0.025)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1920, 1080);

    for (var i = 0; i < points.length; i += 1) {
      var p = points[i];
      if (!reduced) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = 1940;
        if (p.x > 1940) p.x = -20;
        if (p.y < -20) p.y = 1100;
        if (p.y > 1100) p.y = -20;
      }
      var pulse = 0.28 + Math.sin(time * 0.00035 + p.phase) * 0.12;
      ctx.fillStyle = "rgba(78,194,132," + pulse + ")";
      ctx.beginPath();
      ctx.arc(p.x + pointer.x * 8, p.y + pointer.y * 5, p.r, 0, Math.PI * 2);
      ctx.fill();
      for (var j = i + 1; j < points.length; j += 1) {
        var q = points[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 23500) {
          ctx.strokeStyle = "rgba(42,148,95," + (0.035 * (1 - d2 / 23500)) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("pointermove", function (event) {
    pointer.tx = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
    pointer.ty = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });

  seed();
  raf = requestAnimationFrame(draw);
}());
