// Cosmos layer: the starfield behind the app, the light that follows the pointer, and the
// small celebrations when attendance changes. Loaded after motion.js; wraps globals the same way.
(() => {
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reduceQuery.matches;
  const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const root = document.documentElement;
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  const isDark = () => root.dataset.theme !== "light";
  const animate = (element, keyframes, options) => {
    if (!element || reduced() || typeof element.animate !== "function") return null;
    try { return element.animate(keyframes, { easing: EASE, fill: "backwards", ...options }); } catch { return null; }
  };

  // ---------- Starfield: twinkles at rest, streaks toward you when you travel ----------
  const sky = document.createElement("canvas");
  sky.className = "cosmos-sky";
  sky.setAttribute("aria-hidden", "true");
  document.body.prepend(sky);
  const context = sky.getContext("2d");
  let stars = [];
  let warpStart = 0;
  let warpUntil = 0;
  let drawing = false;

  function layOutSky() {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    sky.width = window.innerWidth * ratio;
    sky.height = window.innerHeight * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(700, Math.round((window.innerWidth * window.innerHeight) / 3200));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 0.9 + 0.2,
      twinkle: Math.random() * 6.283,
      z: Math.random(),
    }));
  }

  function skyVisible() {
    const shell = document.querySelector("#appShell");
    return isDark() && shell && !shell.hidden && document.visibilityState === "visible";
  }

  function drawSky(now) {
    if (!skyVisible()) { drawing = false; return; }
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.45;
    const k = now < warpUntil ? Math.sin((Math.PI * (now - warpStart)) / (warpUntil - warpStart)) : 0;
    const still = reduced();
    for (const star of stars) {
      const shimmer = still ? 0.6 : 0.5 + 0.5 * Math.sin((now / 1000) * (0.5 + star.z) + star.twinkle);
      const alpha = Math.min(1, (0.2 + 0.45 * shimmer) * (0.3 + star.z * 0.7) + k * 0.5);
      if (k > 0.02) {
        const length = k * (0.08 + star.z * 0.32);
        context.strokeStyle = `rgba(210, 225, 255, ${alpha})`;
        context.lineWidth = star.r * (1 + k);
        context.beginPath();
        context.moveTo(star.x, star.y);
        context.lineTo(star.x + (star.x - cx) * length, star.y + (star.y - cy) * length);
        context.stroke();
      } else {
        context.fillStyle = `rgba(226, 232, 255, ${alpha})`;
        context.beginPath();
        context.arc(star.x, star.y, star.r, 0, 6.283);
        context.fill();
      }
    }
    // Reduced motion paints one still frame; otherwise keep the sky alive.
    if (still && now >= warpUntil) { drawing = false; return; }
    window.requestAnimationFrame(drawSky);
  }

  function wakeSky() {
    if (drawing || !skyVisible()) return;
    drawing = true;
    window.requestAnimationFrame(drawSky);
  }

  function warp(duration = 700) {
    if (reduced()) return;
    warpStart = performance.now();
    warpUntil = warpStart + duration;
    wakeSky();
  }

  layOutSky();
  window.addEventListener("resize", () => { layOutSky(); wakeSky(); });
  document.addEventListener("visibilitychange", wakeSky);
  new MutationObserver(wakeSky).observe(document.querySelector("#appShell") || document.body, { attributes: true, attributeFilter: ["hidden"] });

  // ---------- Travel: the week turns like a page while the stars streak ----------
  const originalShift = window.shiftSelectedSchedulePeriod;
  if (typeof originalShift === "function") {
    window.shiftSelectedSchedulePeriod = function shiftWithWarp(amount, ...rest) {
      warp(650);
      const grid = document.querySelector("#scheduleGrid");
      if (grid && typeof scheduleView !== "undefined" && scheduleView === "week") {
        const direction = amount < 0 ? -1 : 1;
        animate(grid, [
          { transform: `perspective(1400px) rotateY(${direction * -7}deg) translateX(${direction * -24}px)`, opacity: 0.55 },
          { transform: "none", opacity: 1 },
        ], { duration: 620, fill: "none" });
      }
      return originalShift.call(this, amount, ...rest);
    };
  }
  document.querySelector("#todayButton")?.addEventListener("click", () => warp(600));

  // ---------- After each render: the comet on the now-line, the planet, the little Earth ----------
  function decorate() {
    document.querySelectorAll(".now-line").forEach((line) => {
      if (!line.querySelector(".cosmos-comet")) line.append(Object.assign(document.createElement("span"), { className: "cosmos-comet" }));
    });
    const card = document.querySelector("#nextLessonCard");
    if (card && !card.hidden && !card.querySelector(".cosmos-globe")) {
      const globe = document.createElement("span");
      globe.className = "cosmos-globe";
      globe.setAttribute("aria-hidden", "true");
      const video = document.createElement("video");
      Object.assign(video, { muted: true, loop: true, playsInline: true, autoplay: !reduced() });
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.src = "assets/login/mini-earth.mp4";
      globe.append(video);
      card.append(globe);
      if (!reduced()) video.play().catch(() => {});
    }
  }

  const originalRender = window.renderSchedule;
  if (typeof originalRender === "function") {
    window.renderSchedule = function renderScheduleWithCosmos(...args) {
      const result = originalRender.apply(this, args);
      decorate();
      return result;
    };
  }
  new MutationObserver(decorate).observe(document.querySelector("#nextLessonCard") || document.body, { attributes: true, attributeFilter: ["hidden"], childList: true });

  // ---------- Pointer light: a soft beam across the grid; lesson edges catch it ----------
  if (FINE) {
    const grid = document.querySelector("#scheduleGrid");
    let frame = 0;
    let lastEvent = null;
    const paint = () => {
      frame = 0;
      if (!grid || !lastEvent) return;
      const box = grid.getBoundingClientRect();
      grid.style.setProperty("--mx", `${lastEvent.clientX - box.left}px`);
      grid.style.setProperty("--my", `${lastEvent.clientY - box.top}px`);
      const hovered = lastEvent.target.closest?.(".course-card");
      grid.querySelectorAll(".course-card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const near = Math.abs(lastEvent.clientX - (rect.left + rect.width / 2)) < 220 && Math.abs(lastEvent.clientY - (rect.top + rect.height / 2)) < 220;
        card.style.setProperty("--lx", near ? `${lastEvent.clientX - rect.left}px` : "-999px");
        card.style.setProperty("--ly", near ? `${lastEvent.clientY - rect.top}px` : "-999px");
        const tilting = card === hovered && !reduced();
        card.classList.toggle("is-tilting", tilting);
        if (tilting) {
          card.style.setProperty("--ry", `${((lastEvent.clientX - rect.left) / rect.width - 0.5) * 10}deg`);
          card.style.setProperty("--rx", `${-((lastEvent.clientY - rect.top) / rect.height - 0.5) * 10}deg`);
        }
      });
    };
    grid?.addEventListener("pointermove", (event) => {
      lastEvent = event;
      if (!frame) frame = window.requestAnimationFrame(paint);
    });
    grid?.addEventListener("pointerleave", () => {
      lastEvent = null;
      grid.style.setProperty("--mx", "-999px");
      grid.querySelectorAll(".course-card").forEach((card) => {
        card.style.setProperty("--lx", "-999px");
        card.classList.remove("is-tilting");
      });
    });

    // Admin tiles lean toward the pointer, a highlight under it.
    document.addEventListener("pointermove", (event) => {
      const tile = event.target.closest?.(".admin-feature-button");
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      tile.style.setProperty("--fx", `${x * 100}%`);
      tile.style.setProperty("--fy", `${y * 100}%`);
      tile.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
      tile.style.setProperty("--rx", `${-(y - 0.5) * 10}deg`);
    }, { passive: true });
  }

  // ---------- Attendance: a burst of stars from the chosen button, a sweep across its row ----------
  const statusColor = (button) => {
    const styles = getComputedStyle(root);
    if (button.classList.contains("is-present")) return styles.getPropertyValue("--success").trim();
    if (button.classList.contains("is-leave")) return styles.getPropertyValue("--warning").trim();
    if (button.classList.contains("is-makeup")) return "#8f7cf0";
    return styles.getPropertyValue("--limb").trim();
  };

  function burst(button, color) {
    if (reduced()) return;
    const rect = button.getBoundingClientRect();
    const host = button.closest("dialog[open]") || document.body;
    // A dialog's backdrop blur makes it the containing block, so place stars relative to it there.
    const origin = host === document.body ? { left: 0, top: 0 } : host.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - origin.left;
    const y = rect.top + rect.height / 2 - origin.top;
    for (let index = 0; index < 14; index += 1) {
      const star = document.createElement("span");
      star.className = "cosmos-burst";
      if (host !== document.body) star.style.position = "absolute";
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.background = color;
      star.style.boxShadow = `0 0 8px ${color}`;
      host.append(star);
      const angle = Math.random() * 6.283;
      const distance = 26 + Math.random() * 44;
      const flight = star.animate([
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0.2)`, opacity: 0 },
      ], { duration: 650 + Math.random() * 300, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
      flight.onfinish = () => star.remove();
      flight.oncancel = () => star.remove();
    }
  }

  function sweep(row, color) {
    if (!row || reduced()) return;
    row.style.setProperty("--sweep", color);
    row.classList.remove("cosmos-sweep");
    void row.offsetWidth;
    row.classList.add("cosmos-sweep");
    window.setTimeout(() => row.classList.remove("cosmos-sweep"), 950);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".dialog-attendance-choice, .attendance-status-button");
    if (!button || button.disabled || button.classList.contains("is-selected")) return;
    const color = statusColor(button);
    burst(button, color);
    // The row is rebuilt once the choice saves; sweep whichever row sits in the same place then.
    const row = button.closest(".dialog-attendance-row, .attendance-row, li, tr");
    const list = row?.parentElement;
    const index = list ? [...list.children].indexOf(row) : -1;
    sweep(row, color);
    window.setTimeout(() => {
      const fresh = list?.isConnected ? list.children[index] : null;
      if (fresh && fresh !== row && !fresh.classList.contains("cosmos-sweep")) sweep(fresh, color);
    }, 120);
  }, true);

  // ---------- Admin hub: tiles flip up, a night planet turns in the header ----------
  const hub = document.querySelector("#adminHub");
  let planetAlive = false;
  function startPlanet() {
    const header = hub?.querySelector(".admin-page-header");
    if (!header) return;
    let holder = header.querySelector(".cosmos-planet");
    if (!holder) {
      holder = document.createElement("div");
      holder.className = "cosmos-planet";
      holder.setAttribute("aria-hidden", "true");
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      holder.append(canvas);
      header.prepend(holder);
    }
    const canvas = holder.querySelector("canvas");
    const paint = canvas.getContext("2d");
    const lights = Array.from({ length: 240 }, () => ({ lat: (Math.random() - 0.5) * 2.4, lon: Math.random() * 6.283, r: Math.random() * 1.6 + 0.5, warm: Math.random() }));
    planetAlive = true;
    const spin = (now) => {
      if (!planetAlive) return;
      paint.clearRect(0, 0, 600, 600);
      const gradient = paint.createRadialGradient(190, 220, 50, 300, 300, 300);
      gradient.addColorStop(0, "#1b3f86");
      gradient.addColorStop(0.65, "#0a1838");
      gradient.addColorStop(1, "#050b1c");
      paint.fillStyle = gradient;
      paint.beginPath();
      paint.arc(300, 300, 298, 0, 6.283);
      paint.fill();
      const turn = reduced() ? 0 : now / 9000;
      for (const light of lights) {
        const lon = light.lon + turn;
        const x = Math.sin(lon) * Math.cos(light.lat);
        const z = Math.cos(lon) * Math.cos(light.lat);
        if (z < 0) continue;
        paint.fillStyle = `rgba(255, ${200 + light.warm * 40}, ${120 + light.warm * 60}, ${0.35 + z * 0.6})`;
        paint.beginPath();
        paint.arc(300 + x * 288, 300 + Math.sin(light.lat) * 288, light.r * (0.5 + z), 0, 6.283);
        paint.fill();
      }
      if (!reduced()) window.requestAnimationFrame(spin);
    };
    window.requestAnimationFrame(spin);
    animate(holder, [{ transform: "translate(90px, -60px) scale(0.7)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 1300 });
    hub.querySelectorAll(".admin-feature-button").forEach((tile, index) => {
      animate(tile, [
        { opacity: 0, transform: "perspective(600px) rotateX(-40deg) translateY(18px)" },
        { opacity: 1, transform: "none" },
      ], { duration: 680, delay: 120 + index * 60 });
    });
  }
  if (hub) {
    new MutationObserver(() => {
      if (!hub.hidden && !planetAlive) { warp(800); startPlanet(); }
      if (hub.hidden) planetAlive = false;
    }).observe(hub, { attributes: true, attributeFilter: ["hidden"] });
  }

  // ---------- Theme toggle: day light spreads out from the button as a circle ----------
  const MOON = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
  const SUN = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function labelToggles() {
    const label = isDark() ? "切换到日间" : "切换到深空";
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.title = label;
      button.setAttribute("aria-label", label);
    });
  }

  function flipTheme(button) {
    const next = isDark() ? "light" : "dark";
    const apply = () => { window.setCourseTheme?.(next); labelToggles(); wakeSky(); };
    if (reduced() || !document.startViewTransition) { apply(); return; }
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add("is-theme-flip");
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: 760, easing: EASE, pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
    transition.finished.finally(() => root.classList.remove("is-theme-flip"));
  }

  function makeToggle(extraClass) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-button theme-toggle ${extraClass}`;
    button.innerHTML = MOON + SUN;
    button.addEventListener("click", () => flipTheme(button));
    return button;
  }

  const authButton = document.querySelector("#authButton");
  authButton?.before(makeToggle("topbar-theme-toggle"));
  const sidebar = document.querySelector("#appSidebar");
  const placeSidebarToggle = () => {
    const footer = sidebar?.querySelector(".sidebar-footer");
    if (footer && !footer.querySelector(".theme-toggle")) {
      footer.querySelector(".sidebar-logout")?.before(makeToggle("sidebar-theme-toggle"));
      labelToggles();
    }
  };
  if (sidebar) new MutationObserver(placeSidebarToggle).observe(sidebar, { childList: true });
  placeSidebarToggle();
  labelToggles();
  decorate();
  wakeSky();
})();
