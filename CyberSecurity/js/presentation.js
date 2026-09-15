(function () {
  "use strict";

  var BASE_W = 1920;
  var BASE_H = 1080;
  var stage = document.getElementById("stage");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var pageCurrent = document.getElementById("page-current");
  var progressBar = document.getElementById("progress-bar");
  var statusLabel = document.getElementById("system-status");
  var index = 0;
  var transitionTimer = 0;
  var terminalTimers = [];
  var wheelLock = false;

  function fitStage() {
    var scale = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
    stage.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
  }

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function clearTerminalTimers() {
    terminalTimers.forEach(function (timer) { clearTimeout(timer); });
    terminalTimers.length = 0;
  }

  function typeLines(slide) {
    clearTerminalTimers();
    var target = slide.querySelector("[data-terminal] .terminal-body");
    var kind = slide.querySelector("[data-terminal]");
    if (!target || !kind) return;
    target.innerHTML = "";
    var isFinal = kind.getAttribute("data-terminal") === "final";
    var lines = isFinal ? [
      { text: "> join security_club", delay: 650, cls: "" },
      { text: "[+] ACCESS GRANTED", delay: 1380, cls: "granted" }
    ] : [
      { text: "> initializing security_club...", delay: 840, cls: "" },
      { text: "> loading WEB / PWN / REVERSE / CRYPTO...", delay: 1230, cls: "" },
      { text: "> identity verified.", delay: 1660, cls: "" },
      { text: "> ACCESS GRANTED_", delay: 2050, cls: "granted cursor" }
    ];
    lines.forEach(function (line) {
      terminalTimers.push(setTimeout(function () {
        var el = document.createElement("div");
        el.className = "typed-line " + line.cls;
        el.textContent = line.text;
        target.appendChild(el);
      }, line.delay));
    });
  }

  function activate(next, direction) {
    if (next < 0 || next >= slides.length || next === index) return;
    clearTimeout(transitionTimer);
    var current = slides[index];
    var incoming = slides[next];
    slides.forEach(function (slide) {
      slide.classList.remove("leaving", "from-prev");
    });
    current.classList.remove("active");
    current.classList.add("leaving");
    current.setAttribute("aria-hidden", "true");
    incoming.classList.remove("leaving");
    if (direction < 0) incoming.classList.add("from-prev");
    void incoming.offsetWidth;
    incoming.classList.add("active");
    incoming.setAttribute("aria-hidden", "false");
    index = next;
    pageCurrent.textContent = pad(index + 1);
    progressBar.style.width = ((index + 1) / slides.length * 100) + "%";
    statusLabel.textContent = index === slides.length - 1 ? "ACCESS GRANTED" : "SYSTEM ONLINE";
    if (incoming.querySelector("[data-terminal]")) typeLines(incoming);
    else clearTerminalTimers();
    transitionTimer = setTimeout(function () {
      current.classList.remove("leaving");
      incoming.classList.remove("from-prev");
    }, 900);
  }

  function next() { activate(Math.min(index + 1, slides.length - 1), 1); }
  function previous() { activate(Math.max(index - 1, 0), -1); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      var request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
      if (request) request.call(document.documentElement).catch(function () {});
    }
  }

  function applyConfig() {
    var cfg = window.PRESENTATION_CONFIG || {};
    document.getElementById("recruit-group").textContent = cfg.recruitmentGroup || "待更新";
    document.getElementById("qq-group").textContent = cfg.qqGroup || "待更新";
    document.getElementById("location").textContent = cfg.location || "待更新";
    var frame = document.getElementById("qr-frame");
    var image = document.getElementById("qr-image");
    if (cfg.qrImage) {
      image.src = cfg.qrImage;
      frame.classList.add("has-image");
    }
  }

  document.addEventListener("keydown", function (event) {
    var key = event.key;
    if (key === "ArrowRight" || key === "PageDown" || key === " ") {
      event.preventDefault(); next();
    } else if (key === "ArrowLeft" || key === "PageUp") {
      event.preventDefault(); previous();
    } else if (key === "f" || key === "F") {
      event.preventDefault(); toggleFullscreen();
    } else if (key === "Home") {
      event.preventDefault(); activate(0, -1);
    } else if (key === "End") {
      event.preventDefault(); activate(slides.length - 1, 1);
    }
  });

  document.addEventListener("wheel", function (event) {
    event.preventDefault();
    if (wheelLock || Math.abs(event.deltaY) < 12) return;
    wheelLock = true;
    if (event.deltaY > 0) next(); else previous();
    setTimeout(function () { wheelLock = false; }, 620);
  }, { passive: false });

  document.addEventListener("pointerup", function (event) {
    if (event.button !== 0) return;
    if (event.clientX < window.innerWidth * 0.38) previous();
    else if (event.clientX > window.innerWidth * 0.62) next();
  });

  window.addEventListener("resize", fitStage, { passive: true });
  document.addEventListener("fullscreenchange", fitStage);
  fitStage();
  applyConfig();
  progressBar.style.width = (100 / slides.length) + "%";
  typeLines(slides[0]);
}());
