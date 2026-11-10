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
        if (courseDialog.open && from && performance.now() - from.at < 800) flipOpen(from.card, courseDialog);
      }).observe(courseDialog, { attributes: true, attributeFilter: ["open"] });
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

  // Opening a course: the clicked card lifts, turns over, and its back flies to the middle of the
  // screen and becomes the dialog. The flying card is a popover so it sits in the top layer above the
  // modal dialog; the real dialog stays invisible underneath until the card lands, then takes over.
  let flipFrom = null;
  function flipOpen(card, dialog) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !HTMLElement.prototype.showPopover) return;
    const a = card.getBoundingClientRect();
    if (!a.width || !a.height) return;
    dialog.classList.add("f-flipping");
    const b = dialog.getBoundingClientRect();
    const cs = getComputedStyle(card);
    const ds = getComputedStyle(dialog);
    const name = (card.querySelector("strong")?.textContent || card.getAttribute("aria-label") || "").split("，")[0].trim();

    const fly = document.createElement("div");
    fly.className = "f-fly";
    fly.setAttribute("popover", "manual");
    fly.setAttribute("aria-hidden", "true");
    fly.style.setProperty("--f-flower", card.style.getPropertyValue("--f-flower") || dialog.style.getPropertyValue("--f-flower"));
    fly.innerHTML = '<div class="f-fly-inner"><div class="f-fly-face f-fly-front"></div><div class="f-fly-face f-fly-back"><strong></strong></div></div>';
    const front = fly.querySelector(".f-fly-front");
    front.style.background = cs.background;
    front.style.boxShadow = cs.boxShadow;
    front.style.borderRadius = cs.borderRadius;
    front.innerHTML = card.innerHTML;
    fly.querySelector(".f-fly-back strong").textContent = name;
    Object.assign(fly.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.append(fly);
    fly.showPopover();
    card.style.visibility = "hidden";

    const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";
    const flip = fly.querySelector(".f-fly-inner").animate(
      [{ transform: "rotateY(0deg) scale(1)" }, { transform: "rotateY(90deg) scale(1.08)", offset: 0.5 }, { transform: "rotateY(180deg) scale(1)" }],
      { duration: 420, easing: "ease-in-out", fill: "forwards" });
    const move = fly.animate(
      [
        { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, borderRadius: cs.borderRadius },
        { left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px`, borderRadius: ds.borderRadius },
      ],
      { duration: 460, delay: 220, easing: ease, fill: "forwards" });

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      dialog.removeEventListener("close", finish);
      card.style.visibility = "";
      dialog.classList.remove("f-flipping");
      dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
      fly.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out" }).finished
        .finally(() => { flip.cancel(); move.cancel(); fly.remove(); });
    };
    move.finished.then(finish, finish);
    dialog.addEventListener("close", finish, { once: true });
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

  build();
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
