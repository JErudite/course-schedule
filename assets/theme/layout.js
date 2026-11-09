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
    const [h, m] = ($("#scheduleGrid .now-line-time")?.textContent || "").split(":").map(Number);
    const nowMin = Number.isFinite(h) ? h * 60 + m : 0;
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
    const upcoming = all.filter((c) => todayIndex < 0 || c.day > todayIndex || (c.day === todayIndex && c.end > nowMin));
    return { all, today: all.filter((c) => c.day === todayIndex), next: upcoming[0], headers, nowMin };
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
      const card = e.target.closest(".course-card, .calendar-course-chip");
      const flower = card?.style.getPropertyValue("--f-flower");
      if (flower) $("#courseDialog")?.style.setProperty("--f-flower", flower);
    }, true);

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
    hero.querySelector(".f-card").addEventListener("click", () => lessons().next?.card.click());

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
    new MutationObserver(() => { clearTimeout(refresh.t); refresh.t = setTimeout(refresh, 80); })
      .observe($("#scheduleGrid"), { childList: true });
    new MutationObserver(refresh).observe($("#weekRange") || document.body, { characterData: true, childList: true, subtree: true });
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
    });
  }

  function refresh() {
    const top = $(".f-top");
    if (!top) return;
    paintFlowers();
    top.querySelector(".f-range").textContent = `${$("#weekLabel")?.textContent || ""}  ·  ${$("#weekRange")?.textContent || ""}`;
    const { all, today, next, headers } = lessons();
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
    if (!next) {
      card.querySelector(".f-card-name").textContent = "本周的课都上完了";
      card.querySelector(".f-card-time").textContent = "翻到下一周看看";
      card.querySelector(".f-card-count").textContent = "";
      return;
    }
    const head = headers[next.day];
    const dayText = head ? `${head.querySelector(".day-weekday")?.textContent || ""} ${head.querySelector(".day-number")?.textContent || ""}日` : "";
    card.style.setProperty("--f-accent", next.color || "#6e1f17");
    card.querySelector(".f-card-name").textContent = next.name;
    card.querySelector(".f-card-time").textContent = `${dayText} · ${next.time}`;
    const later = all.filter((c) => c !== next && (c.day > next.day || (c.day === next.day && c.start > next.start))).length;
    card.querySelector(".f-card-count").textContent = later ? `之后还有 ${later} 节` : "这是最后一节";
  }

  build();
  // The app scrolls the page to "now" after its first data render (which can come seconds later, after
  // sign-in); with the hero on top, bring the page back to the hero once that first render has landed.
  const grid = $("#scheduleGrid");
  const backToHero = () => [120, 700].forEach((ms) => setTimeout(() => window.scrollTo({ top: 0 }), ms));
  if (grid?.querySelector(".day-header")) backToHero();
  else if (grid) {
    const once = new MutationObserver(() => {
      if (!grid.querySelector(".day-header")) return;
      once.disconnect();
      backToHero();
    });
    once.observe(grid, { childList: true });
  }
})();
