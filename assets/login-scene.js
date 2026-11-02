// Login backdrop: the turning night Earth, a twinkling starfield and the Beijing clock.
// Runs only while the login screen is visible.
(() => {
  const screen = document.querySelector("#loginScreen");
  const film = document.querySelector("#loginEarth");
  const canvas = document.querySelector("#loginStars");
  if (!screen || !film || !canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = document.querySelector("#loginClock");
  const month = document.querySelector("#loginMonth");
  const term = document.querySelector("#loginTerm");
  let w = 0, h = 0, stars = [], shoot = null, t = 0, last = 0, frameId = 0, px = 0, py = 0, tx = 0, ty = 0;

  function layout() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round((w * h) / 2400) }, () => ({
      x: Math.random() * w, y: Math.random() * h, z: Math.random(), r: Math.random() * 1.1 + 0.2, tw: Math.random() * 6.28,
      hue: Math.random() < 0.15 ? "255,222,196" : Math.random() < 0.25 ? "190,215,255" : "236,238,250",
    }));
  }

  function draw(now) {
    const dt = last ? Math.min(50, now - last) : 16;
    last = now;
    if (!reduced) t += dt / 1000;
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    film.style.translate = `${px * -12}px ${py * -8}px`;
    ctx.clearRect(0, 0, w, h);
    const fade = reduced ? 1 : Math.min(1, t / 1.6);
    for (const s of stars) {
      const a = (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * (0.6 + s.z * 1.8) + s.tw))) * (0.35 + s.z * 0.65) * fade;
      ctx.fillStyle = `rgba(${s.hue},${a})`;
      ctx.beginPath();
      ctx.arc((s.x + px * 6 * s.z + w) % w, (s.y + py * 4 * s.z + h) % h, s.r, 0, 6.283);
      ctx.fill();
    }
    if (!reduced && !shoot && t > 3 && Math.random() < 0.002) shoot = { x: w * (0.05 + Math.random() * 0.3), y: h * (0.05 + Math.random() * 0.35), life: 0 };
    if (shoot) {
      shoot.life += dt / 1000;
      const q = shoot.life, len = 150, x = shoot.x + q * 420, y = shoot.y + q * 160;
      const g = ctx.createLinearGradient(x, y, x - len, y - len * 0.38);
      g.addColorStop(0, `rgba(255,245,230,${0.85 * (1 - q)})`);
      g.addColorStop(1, "rgba(255,245,230,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len, y - len * 0.38); ctx.stroke();
      if (q >= 1) shoot = null;
    }
    frameId = reduced ? 0 : requestAnimationFrame(draw);
  }

  function tick() {
    const now = new Date();
    clock.textContent = "北京时间 " + new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);
    month.textContent = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "long" }).format(now).replace("年", " 年 ").replace("月", " 月");
    if (term && typeof getAcademicPeriod === "function" && typeof getScheduleToday === "function") {
      try { term.textContent = getAcademicPeriod(getScheduleToday()); } catch { /* keep the static label */ }
    }
  }

  let clockTimer = 0, filmTimer = 0;
  function start() {
    if (screen.hidden || document.hidden) return;
    layout(); tick();
    if (!clockTimer) clockTimer = window.setInterval(tick, 15000);
    // A signed-in visitor sees this screen only for a moment; start the film once it is clearly staying.
    window.clearTimeout(filmTimer);
    if (!reduced) filmTimer = window.setTimeout(() => { if (!screen.hidden && !document.hidden) film.play().catch(() => {}); }, 700);
    if (!frameId) { last = 0; frameId = requestAnimationFrame(draw); }
  }
  function stop() {
    window.clearTimeout(filmTimer);
    film.pause();
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    window.clearInterval(clockTimer);
    clockTimer = 0;
  }

  // The film is not a seamless loop: dip it into the starfield for a moment at the seam.
  film.addEventListener("timeupdate", () => {
    if (!film.duration) return;
    film.classList.toggle("is-seam", film.currentTime > film.duration - 0.8 || film.currentTime < 0.15);
  });

  window.addEventListener("resize", () => { if (!screen.hidden) layout(); });
  window.addEventListener("pointermove", (event) => {
    if (reduced || screen.hidden) return;
    tx = event.clientX / w - 0.5; ty = event.clientY / h - 0.5;
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  new MutationObserver(() => (screen.hidden ? stop() : start())).observe(screen, { attributes: true, attributeFilter: ["hidden"] });
  start();
})();
