// Theme layout "府邸": restructures the page around the app's own elements (no data logic).
// - 去掉常驻侧栏：月历、今天、续课提醒、账号收进右上角"菜单"抽屉。
// - 顶部一条细横栏：本周范围 · 菜单。
// - 首屏左文右画，"下一节课"卡片压在画的边上；"今天的课"排成一行可点的票根。
// - 所有操作按钮收进屏幕底部的浮动工具条（周/月/年 · 翻周 · 选周 · 新建课程）。
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function lessons() {
    const headers = $$("#scheduleGrid .day-header");
    const todayIndex = headers.findIndex((h) => h.classList.contains("is-today"));
    const all = $$("#scheduleGrid .course-card").map((card) => {
      const label = card.getAttribute("aria-label") || "";
      return {
        card,
        day: parseInt(getComputedStyle(card).gridColumnStart, 10) - 2,
        start: Number(card.dataset.start),
        end: Number(card.dataset.end),
        name: label.split("，")[0],
        time: (label.split("，")[1] || "").replace(" 至 ", " – "),
        color: getComputedStyle(card).getPropertyValue("--course-color").trim(),
      };
    }).sort((a, b) => a.day - b.day || a.start - b.start);
    return { all, today: all.filter((c) => c.day === todayIndex), headers };
  }

  function build() {
    const shell = $("#appShell");
    const section = $("#scheduleSection");
    if (!shell || !section || $(".f-top")) return;
    document.body.classList.add("f-layout");

    // Top bar
    const top = document.createElement("header");
    top.className = "f-top";
    top.innerHTML = `
      <span aria-hidden="true"></span>
      <p class="f-range"></p>
      <button class="f-menu-button" type="button" aria-expanded="false" aria-controls="appSidebar">
        <span class="f-menu-lines" aria-hidden="true"></span><span>菜单</span>
      </button>`;
    shell.prepend(top);

    // Drawer = the existing sidebar, plus the font size / holiday tools
    const drawer = $("#appSidebar");
    const scrim = document.createElement("div");
    scrim.className = "f-scrim";
    shell.append(scrim);
    const tools = $(".calendar-view-toolbar");
    const toolsHome = document.createElement("div");
    toolsHome.className = "f-drawer-tools";
    if (tools) toolsHome.append(tools);
    // The sidebar rebuilds its children on every render, so the tools live beside it (fixed over the
    // drawer's lower part) rather than inside it; app.js needs #holidayDataNote to stay in the page.
    shell.append(toolsHome);
    const setOpen = (open) => {
      document.body.classList.toggle("f-drawer-open", open);
      top.querySelector(".f-menu-button").setAttribute("aria-expanded", String(open));
    };
    top.querySelector(".f-menu-button").addEventListener("click", () => setOpen(!document.body.classList.contains("f-drawer-open")));
    scrim.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    drawer.addEventListener("click", (e) => { if (e.target.closest(".sidebar-day")) setOpen(false); });
    // The course dialog's header painting follows the card that opened it.
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".course-card, .calendar-course-chip, .agenda-item");
      const flower = card?.style.getPropertyValue("--f-flower");
      if (flower) $("#courseDialog")?.style.setProperty("--f-flower", flower);
      if (card) flipFrom = { card, at: performance.now() };
    }, true);
    const courseDialog = $("#courseDialog");
    if (courseDialog) {
      new MutationObserver(() => {
        const from = flipFrom;
        flipFrom = null;
        if (!courseDialog.open) { flipClose(courseDialog); return; }
        lastDialogRect = courseDialog.getBoundingClientRect();
        if (from && performance.now() - from.at < 800) flipOpen(from.card, courseDialog);
      }).observe(courseDialog, { attributes: true, attributeFilter: ["open"] });
      // Keep the dialog's size current (view → edit mode changes it) for the flight home.
      new ResizeObserver(() => { if (courseDialog.open) lastDialogRect = courseDialog.getBoundingClientRect(); }).observe(courseDialog);
    }

    // Hero
    const hero = document.createElement("section");
    hero.className = "f-hero";
    hero.innerHTML = `
      <div class="f-copy">
        <p class="f-eyebrow"></p>
        <div class="f-title-slot"></div>
        <div class="f-lede-slot"></div>
        <div class="f-today" aria-label="今天的课"></div>
      </div>
      <div class="f-art" aria-hidden="true"></div>
      <button class="f-card" type="button">
        <span class="f-card-art" aria-hidden="true"></span>
        <span class="f-card-body">
          <small>下一节课</small>
          <strong class="f-card-name"></strong>
          <span class="f-card-time"></span>
          <span class="f-card-count"></span>
        </span>
      </button>
      <p class="f-watermark" aria-hidden="true">Schedule</p>`;
    section.prepend(hero);
    hero.querySelector(".f-title-slot").append($("#scheduleTitle"));
    hero.querySelector(".f-lede-slot").append($("#todayText"));
    hero.querySelector(".f-card").addEventListener("click", () => {
      const next = nextLesson();
      if (next) window.showCourse(next.course.id, window.toISODate(next.date));
    });

    // Dock: every control that used to sit in the toolbar
    const dock = document.createElement("nav");
    dock.className = "f-dock";
    dock.setAttribute("aria-label", "课程表操作");
    dock.innerHTML = `<span class="f-dock-mark" aria-hidden="true">课</span><div class="f-dock-group f-dock-views"></div><div class="f-dock-group f-dock-week"></div>`;
    dock.querySelector(".f-dock-views").append($("#scheduleViewSwitcher"));
    dock.querySelector(".f-dock-week").append($(".week-controls"));
    dock.append($("#addCourse"));
    shell.append(dock);

    refresh();
    setInterval(refresh, 60 * 1000); // "正在上课" → next lesson as time passes
    new MutationObserver(() => { clearTimeout(refresh.t); refresh.t = setTimeout(refresh, 80); })
      .observe($("#scheduleGrid"), { childList: true });
    new MutationObserver(refresh).observe($("#weekRange") || document.body, { characterData: true, childList: true, subtree: true });
  }

  // Opening a course: the card is flicked like a hand turning a playing card over (user's reference
  // video, 11-09) — a small wind-up, a quick blurred flip — and tossed out to the right, then swings
  // back left into the middle, where it settles and becomes the dialog. The swing is one damped
  // spring, so it turns round smoothly like a pendulum instead of stopping at the right. Closing plays
  // the same flight backwards into the card's slot. The flying card is a popover so it sits in the top
  // layer above the modal dialog; the real dialog stays invisible until the card lands.
  let flipFrom = null;
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || !HTMLElement.prototype.showPopover;
  const clamp01 = (t) => Math.max(0, Math.min(1, t));
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const smooth = (t) => t * t * (3 - 2 * t);
  const FLIGHT_MS = 1000;
  const WIND = 0.07; // wind-up share of the flight
  const FLIP_END = 0.4; // the turn-over is done by here

  // Frames for the flight, from the card (p = 0) to the dialog (p = 1).
  function flightPath(a, b) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ac = { x: a.left + a.width / 2, y: a.top + a.height / 2 };
    const bc = { x: b.left + b.width / 2, y: b.top + b.height / 2 };

    // Horizontal: a damped spring pulling towards the centre, started with a flick to the right. Its
    // first swing peaks at the right of the screen; the way back is the swing home.
    const omega = 2 * Math.PI / 0.78; // period, in flight lengths
    const gamma = 3.4; // damping: the swing back overshoots only a little
    const c1 = ac.x - bc.x;
    const springX = (t, v0) => {
      const e = Math.exp(-gamma * t);
      const c2 = (v0 + gamma * c1) / omega;
      return bc.x + e * (c1 * Math.cos(omega * t) + c2 * Math.sin(omega * t));
    };
    const maxRight = (v0) => { let m = -Infinity; for (let t = 0; t <= 0.6; t += 0.01) m = Math.max(m, springX(t, v0)); return m; };
    const wantRight = Math.max(bc.x + 40, Math.min(vw - b.width * 0.35 - 16, bc.x + vw * 0.26));
    let lo = 0;
    let hi = vw * 60;
    for (let k = 0; k < 40; k += 1) { const mid = (lo + hi) / 2; if (maxRight(mid) < wantRight) lo = mid; else hi = mid; }
    const v0 = hi;

    const steps = 80;
    const frames = [];
    const turns = [];
    let prevX = ac.x;
    for (let i = 0; i <= steps; i += 1) {
      const p = i / steps;
      const wind = Math.sin(clamp01(p / WIND) * Math.PI); // 0 → 1 → 0 over the wind-up
      const t = clamp01((p - WIND) / (1 - WIND)); // flight time after the wind-up
      const land = smooth(clamp01((t - 0.82) / 0.18)); // ease the last bit exactly onto the centre
      const x = springX(t, v0) * (1 - land) + bc.x * land;
      // Vertical: rise a little on the toss, then come down to the centre.
      const y = ac.y + (bc.y - ac.y) * easeOut(clamp01(t / 0.7)) - Math.sin(clamp01(t / 0.75) * Math.PI) * vh * 0.06 + wind * 6;
      const grow = easeOut(clamp01(t / 0.55));
      const width = a.width + (b.width - a.width) * grow;
      const height = a.height + (b.height - a.height) * grow;
      const f = clamp01((p - WIND * 0.6) / (FLIP_END - WIND * 0.6));
      const spin = Math.sin(f * Math.PI); // 1 when edge-on
      frames.push({
        left: `${x - width / 2}px`,
        top: `${y - height / 2}px`,
        width: `${width}px`,
        height: `${height}px`,
        filter: `blur(${(spin * 1.4).toFixed(2)}px)`,
        offset: p,
      });
      // Lean into the swing: tilt follows horizontal speed, so it rocks back as it turns round.
      const vx = (x - prevX) * steps / vw;
      prevX = x;
      const lean = Math.max(-1, Math.min(1, vx / 2.2)) * 7 * (1 - land);
      const rotY = -180 * easeInOut(f); // negative: the card turns over from right to left (user 11-09)
      const rotZ = wind * 4 - spin * 8 + lean;
      const rotX = spin * 14;
      const scale = 1 - wind * 0.05 + spin * 0.04;
      turns.push({ transform: `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`, offset: p });
    }
    return { frames, turns };
  }

  // The back of the flying card is a copy of the filled-in dialog at its real size, scaled down to
  // the card's size, so the information is there the whole way instead of a blank sheet.
  function makeFly(card, dialog, b) {
    const cs = getComputedStyle(card);
    const fly = document.createElement("div");
    fly.className = "f-fly";
    fly.setAttribute("popover", "manual");
    fly.setAttribute("aria-hidden", "true");
    fly.setAttribute("inert", "");
    fly.innerHTML = '<div class="f-fly-inner"><div class="f-fly-face f-fly-front"></div><div class="f-fly-face f-fly-back"></div></div>';
    const front = fly.querySelector(".f-fly-front");
    front.style.background = cs.background;
    front.style.boxShadow = cs.boxShadow;
    front.style.borderRadius = cs.borderRadius;
    front.innerHTML = card.innerHTML;
    // A real <dialog> (opened in place, not modal) so every dialog style applies to the copy too.
    const sheet = document.createElement("dialog");
    sheet.setAttribute("open", "");
    sheet.className = `${[...dialog.classList].filter((c) => c !== "f-flipping").join(" ")} f-fly-sheet`;
    sheet.id = dialog.id; // some dialog styles are written against #courseDialog
    sheet.style.cssText = dialog.style.cssText;
    sheet.style.width = `${b.width}px`;
    sheet.style.height = `${b.height}px`;
    sheet.innerHTML = dialog.innerHTML;
    // The copy keeps the ids the dialog's styles hang on; it sits after the real dialog in the page, so
    // the app's id look-ups still find the real elements first, and it is gone within a second.
    sheet.querySelectorAll("[autofocus]").forEach((el) => el.removeAttribute("autofocus"));
    fly.querySelector(".f-fly-back").append(sheet);
    document.body.append(fly);
    fly.showPopover();
    return fly;
  }

  function fly(card, dialog, a, b, reverse) {
    const el = makeFly(card, dialog, b);
    const { frames, turns } = flightPath(a, b);
    const options = { duration: FLIGHT_MS, easing: "linear", fill: "forwards", direction: reverse ? "reverse" : "normal" };
    const move = el.animate(frames, options);
    const flip = el.querySelector(".f-fly-inner").animate(turns, options);
    const fit = el.querySelector(".f-fly-sheet").animate(
      frames.map((f) => ({ transform: `scale(${parseFloat(f.width) / b.width})`, offset: f.offset })), options);
    return { el, move, flip, fit };
  }

  // Where the card that opened the dialog is now (it may have been re-rendered after an edit).
  const findCard = (ref) => ref && document.querySelector(ref.selector);

  let openRef = null;
  function flipOpen(card, dialog) {
    if (reduceMotion()) return;
    const a = card.getBoundingClientRect();
    if (!a.width || !a.height) return;
    dialog.classList.add("f-flipping");
    const b = dialog.getBoundingClientRect();
    const id = card.dataset.courseId;
    const date = card.dataset.occurrenceDate;
    const ref = { card, selector: id && date
      ? `[data-course-id="${CSS.escape(id)}"][data-occurrence-date="${CSS.escape(date)}"]`
      : null };
    openRef = ref;
    const flight = fly(card, dialog, a, b, false);
    card.style.visibility = "hidden";

    let done = false;
    const land = () => {
      if (done) return;
      done = true;
      dialog.style.animation = "none"; // its own rise-in would replay as the class comes off
      dialog.classList.remove("f-flipping");
      // The flying copy matches the dialog exactly, so swap them outright: a cross-fade let the
      // schedule show through both half-transparent layers (looked like a flash).
      requestAnimationFrame(() => { flight.move.cancel(); flight.flip.cancel(); flight.fit.cancel(); flight.el.remove(); });
    };
    flight.move.finished.then(land, land);
    setTimeout(land, FLIGHT_MS + 600); // never leave the dialog invisible if the animation stalls
    // Closed before landing: drop the flight and let flipClose take it from here.
    dialog.addEventListener("close", () => {
      dialog.style.animation = ""; // later openings without a flight keep the normal rise-in
      if (!done) { done = true; dialog.classList.remove("f-flipping"); flight.el.remove(); }
    }, { once: true });
  }

  // Closing: the dialog turns back into the card and flies home along the same arc.
  let lastDialogRect = null;
  function flipClose(dialog) {
    const ref = openRef;
    openRef = null;
    if (!ref) return;
    const restore = () => { ref.card.style.visibility = ""; const now = findCard(ref); if (now) now.style.visibility = ""; };
    const card = (ref.card.isConnected ? ref.card : null) || (ref.selector && document.querySelector(`#scheduleGrid .course-card${ref.selector}, .calendar-course-chip${ref.selector}`));
    const b = lastDialogRect;
    const a = card?.getBoundingClientRect();
    const onScreen = a && a.width && a.height && a.bottom > 0 && a.top < window.innerHeight;
    if (reduceMotion() || !card || !b || !onScreen) { restore(); return; }
    card.style.visibility = "hidden";
    const flight = fly(card, dialog, a, b, true);
    let home = false;
    const arrive = () => {
      if (home) return;
      home = true;
      restore();
      card.style.visibility = "";
      flight.move.cancel(); flight.flip.cancel(); flight.fit.cancel(); flight.el.remove();
    };
    flight.move.finished.then(arrive, arrive);
    setTimeout(arrive, FLIGHT_MS + 600);
  }

  // 14 public-domain flower paintings. Course names are sorted and dealt out in order, so up to 14
  // courses never share a painting, and the same course keeps its painting on every card.
  function paintFlowers() {
    const cards = $$("#scheduleGrid .course-card, .calendar-course-chip, .agenda-item");
    const nameOf = (card) => card.classList.contains("agenda-item")
      ? (card.querySelector("strong")?.textContent || "").trim()
      : (card.getAttribute("aria-label") || "").split("，")[0];
    const names = [...new Set(cards.map(nameOf))].sort((a, b) => a.localeCompare(b, "zh"));
    cards.forEach((card) => {
      const n = (names.indexOf(nameOf(card)) % 14) + 1;
      // A url() inside a custom property resolves against the stylesheet that uses it (theme.css).
      card.style.setProperty("--f-flower", `url("art/flower-${String(n).padStart(2, "0")}.webp")`);
      // A course with its own colour gets its painting printed in that colour (app.js gives
      // colourless courses the default sage accent #6f8a64; those keep the painting's own colours).
      const color = card.style.getPropertyValue("--course-color").trim().toLowerCase();
      card.toggleAttribute("data-f-tint", Boolean(color) && color !== "#6f8a64");
    });
  }

  // The app's own answer (course data, Beijing time, up to 120 days ahead), so a lesson added a moment
  // ago or one in a later week is picked up; the grid only shows the selected week.
  const nextLesson = () => (typeof window.findNextLesson === "function" ? window.findNextLesson() : null);
  const cardFor = (next) => next && document.querySelector(
    `#scheduleGrid .course-card[data-course-id="${CSS.escape(String(next.course.id))}"][data-occurrence-date="${window.toISODate(next.date)}"]`);

  function refresh() {
    const top = $(".f-top");
    if (!top) return;
    paintFlowers();
    top.querySelector(".f-range").textContent = `${$("#weekLabel")?.textContent || ""}  ·  ${$("#weekRange")?.textContent || ""}`;
    const { all, today, headers } = lessons();
    const hero = $(".f-hero");
    hero.querySelector(".f-eyebrow").textContent = `本周 ${all.length} 节课`;

    const strip = hero.querySelector(".f-today");
    strip.replaceChildren();
    strip.hidden = !headers.some((h) => h.classList.contains("is-today"));
    if (!today.length) {
      const empty = document.createElement("p");
      empty.className = "f-today-empty";
      empty.textContent = "今天没有课，好好休息。";
      strip.append(empty);
    }
    today.forEach((c) => {
      const stub = document.createElement("button");
      stub.type = "button";
      stub.className = "f-stub";
      stub.style.setProperty("--f-accent", c.color || "#6e1f17");
      stub.innerHTML = `<time></time><span></span>`;
      stub.querySelector("time").textContent = c.time.split(" – ")[0];
      stub.querySelector("span").textContent = c.name;
      stub.addEventListener("click", () => c.card.click());
      strip.append(stub);
    });

    const card = hero.querySelector(".f-card");
    const next = nextLesson();
    card.classList.toggle("is-current", Boolean(next?.inProgress));
    card.querySelector("small").textContent = next?.inProgress ? "正在上课" : "下一节课";
    if (!next) {
      card.querySelector(".f-card-name").textContent = "近期没有课";
      card.querySelector(".f-card-time").textContent = "新建课程后会显示在这里";
      card.querySelector(".f-card-count").textContent = "";
      card.style.removeProperty("--f-flower");
      return;
    }
    const { course } = next;
    const end = course.startTime + course.duration;
    const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const shown = cardFor(next) || $$("#scheduleGrid .course-card")
      .find((c) => (c.getAttribute("aria-label") || "").split("，")[0] === course.name);
    card.style.setProperty("--f-accent", (shown && getComputedStyle(shown).getPropertyValue("--course-color").trim()) || "#6e1f17");
    const flower = shown?.style.getPropertyValue("--f-flower");
    if (flower) card.style.setProperty("--f-flower", flower); else card.style.removeProperty("--f-flower");
    card.querySelector(".f-card-name").textContent = course.name;
    card.querySelector(".f-card-time").textContent = `${next.dayLabel} ${next.weekday} · ${hhmm(course.startTime)} – ${hhmm(end)}`;
    const dayWord = next.offset === 0 ? "今天" : "当天";
    card.querySelector(".f-card-count").textContent = next.laterThatDay ? `${dayWord}之后还有 ${next.laterThatDay} 节` : `${dayWord}最后一节`;
  }

  // Cursor glow (user 11-09): a soft warm light follows the mouse, and a course card under the
  // pointer catches a highlight where the pointer is. Mouse/trackpad only; off for reduced motion.
  function cursorGlow() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glow = document.createElement("div");
    glow.className = "f-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.append(glow);
    let last = null;
    let frame = 0;
    let lit = null;
    const paint = () => {
      frame = 0;
      if (!last) return;
      glow.style.transform = `translate3d(${last.clientX}px, ${last.clientY}px, 0)`;
      glow.classList.add("is-on");
      const card = last.target instanceof Element
        ? last.target.closest("#scheduleGrid .course-card, .calendar-course-chip, .agenda-item, .f-card, .f-stub")
        : null;
      if (lit && lit !== card) lit.classList.remove("f-lit");
      lit = card;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${last.clientX - r.left}px`);
        card.style.setProperty("--my", `${last.clientY - r.top}px`);
        card.classList.add("f-lit");
      }
    };
    document.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });
    const off = () => { glow.classList.remove("is-on"); lit?.classList.remove("f-lit"); lit = null; };
    document.documentElement.addEventListener("mouseleave", off);
    window.addEventListener("blur", off);
  }

  build();
  cursorGlow();
  // The app scrolls its grid to today's lesson after its first data render (which can come seconds
  // later, after sign-in). Desktop: start at the hero. Phone: the hero fills the screen, so go
  // straight to the next lesson (the agenda list for students, the grid card for teachers).
  const phone = window.matchMedia("(max-width: 640px)");
  const landingTarget = () => {
    const agenda = $("#scheduleAgenda");
    if (agenda && !agenda.hidden) {
      return $$(".agenda-day:not(.is-past) .agenda-item:not(.is-done)", agenda)[0] || $(".agenda-day.is-today", agenda);
    }
    return cardFor(nextLesson());
  };
  const land = () => {
    const target = phone.matches && landingTarget();
    if (target) target.scrollIntoView({ block: "center" });
    else window.scrollTo({ top: 0 });
  };
  const grid = $("#scheduleGrid");
  const settle = () => [120, 700].forEach((ms) => setTimeout(land, ms));
  if (grid?.querySelector(".day-header")) settle();
  else if (grid) {
    const once = new MutationObserver(() => {
      if (!grid.querySelector(".day-header")) return;
      once.disconnect();
      settle();
    });
    once.observe(grid, { childList: true });
  }
})();
