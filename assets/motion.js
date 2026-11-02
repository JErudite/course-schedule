// Motion layer: explains navigation and state changes; never hides content by default.
// Loaded after app.js. It wraps a few global functions instead of changing their logic.
(() => {
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reduceQuery.matches;
  const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";
  const animate = (element, keyframes, options) => {
    if (!element || typeof element.animate !== "function") return null;
    try { return element.animate(keyframes, { easing: easeOut, fill: "backwards", ...options }); } catch { return null; }
  };

  // ---------- Week / month / year: content arrives from the direction you travelled ----------
  let travel = 0; // -1 earlier, 1 later, 0 none
  let firstPaint = true;

  function columnOf(element) {
    return Number.parseInt(element.style.gridColumn, 10) || 2;
  }

  function playScheduleEntrance(direction, { initial = false } = {}) {
    if (typeof scheduleView === "undefined") return;
    const distance = reduced() ? 0 : 28 * direction;
    if (scheduleView === "week") {
      const grid = document.querySelector("#scheduleGrid");
      if (!grid) return;
      grid.querySelectorAll(".day-header").forEach((header) => {
        const column = columnOf(header) - 2;
        animate(header, [
          { opacity: 0, transform: `translateX(${distance * 0.5}px)` },
          { opacity: 1, transform: "none" },
        ], { duration: 360, delay: Math.min(column * 18, 120) });
      });
      grid.querySelectorAll(".course-card").forEach((card) => {
        const column = columnOf(card) - 2;
        const rise = initial && !reduced() ? 10 : 0;
        animate(card, [
          { opacity: 0, transform: `translate(${distance}px, ${rise}px) scale(0.98)`, filter: reduced() ? "none" : "blur(3px)" },
          { opacity: 1, transform: "none", filter: "none" },
        ], { duration: initial ? 560 : 420, delay: Math.min(column * (initial ? 40 : 24), initial ? 280 : 160) });
      });
      grid.querySelectorAll(".grid-cell.is-today").length && grid.querySelectorAll(".now-line, .now-line-time").forEach((line) => {
        animate(line, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 200 });
      });
      return;
    }
    const overview = document.querySelector("#calendarOverview");
    const target = overview?.firstElementChild;
    animate(target, [
      { opacity: 0, transform: `translateX(${distance}px)`, filter: reduced() ? "none" : "blur(2px)" },
      { opacity: 1, transform: "none", filter: "none" },
    ], { duration: 380 });
  }

  const originalRender = window.renderSchedule;
  if (typeof originalRender === "function") {
    window.renderSchedule = function renderScheduleWithMotion(...args) {
      const result = originalRender.apply(this, args);
      updateSwitcherThumb();
      const section = document.querySelector("#scheduleSection");
      if (section && !section.hidden) {
        if (travel !== 0) playScheduleEntrance(travel);
        else if (firstPaint && document.querySelector("#scheduleGrid .course-card")) {
          firstPaint = false;
          playScheduleEntrance(0, { initial: true });
        }
      }
      travel = 0;
      return result;
    };
  }

  const originalShift = window.shiftSelectedSchedulePeriod;
  if (typeof originalShift === "function") {
    window.shiftSelectedSchedulePeriod = function shiftWithMotion(amount, ...rest) {
      travel = amount < 0 ? -1 : 1;
      firstPaint = false;
      return originalShift.call(this, amount, ...rest);
    };
  }

  // "今天" travels back or forward depending on where you are.
  document.querySelector("#todayButton")?.addEventListener("click", () => {
    if (typeof selectedWeekStart === "undefined") return;
    const here = selectedWeekStart.getTime();
    const home = currentWeekStart.getTime();
    travel = here === home ? 0 : here > home ? -1 : 1;
    firstPaint = false;
  }, true);

  // Switching between week, month and year cross-fades the whole calendar.
  const originalSetView = window.setScheduleView;
  if (typeof originalSetView === "function") {
    window.setScheduleView = function setViewWithMotion(nextView, ...rest) {
      firstPaint = false;
      if (!document.startViewTransition || reduced() || nextView === scheduleView) {
        return originalSetView.call(this, nextView, ...rest);
      }
      let result;
      document.startViewTransition(() => { result = originalSetView.call(this, nextView, ...rest); });
      return result;
    };
  }

  // ---------- Segmented control: one thumb slides to the active view ----------
  function updateSwitcherThumb() {
    const switcher = document.querySelector("#scheduleViewSwitcher");
    const active = switcher?.querySelector(".is-active");
    if (!switcher || !active) return;
    switcher.style.setProperty("--thumb-x", `${active.offsetLeft}px`);
    switcher.style.setProperty("--thumb-w", `${active.offsetWidth}px`);
    switcher.classList.add("has-thumb");
  }
  window.addEventListener("resize", updateSwitcherThumb);

  // ---------- Lesson dialog grows out of the lesson you clicked ----------
  let lastOrigin = null;
  document.addEventListener("pointerdown", (event) => {
    const source = event.target.closest(".course-card, .calendar-course-chip, .sidebar-course, .agenda-item");
    lastOrigin = source ? source.getBoundingClientRect() : null;
  }, true);

  const originalShowCourse = window.showCourse;
  if (typeof originalShowCourse === "function") {
    window.showCourse = function showCourseWithMotion(...args) {
      const dialog = document.querySelector("#courseDialog");
      const wasOpen = dialog?.open;
      const result = originalShowCourse.apply(this, args);
      if (dialog?.open && !wasOpen && lastOrigin && !reduced()) {
        const box = dialog.getBoundingClientRect();
        const dx = lastOrigin.left + lastOrigin.width / 2 - (box.left + box.width / 2);
        const dy = lastOrigin.top + lastOrigin.height / 2 - (box.top + box.height / 2);
        const scale = Math.max(0.3, Math.min(lastOrigin.width / box.width, 0.6));
        animate(dialog, [
          { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
          { opacity: 1, transform: "none" },
        ], { duration: 460 });
        dialog.classList.add("is-grown");
      }
      lastOrigin = null;
      return result;
    };
  }

  // ---------- Toast: replays its arrival when a new message replaces an old one ----------
  const toast = document.querySelector("#statusMessage");
  if (toast && typeof window.showStatus === "function") {
    const originalShowStatus = window.showStatus;
    window.showStatus = function showStatusWithMotion(...args) {
      const wasVisible = toast.classList.contains("is-visible");
      const result = originalShowStatus.apply(this, args);
      if (wasVisible) animate(toast, [{ transform: "translateY(4px) scale(0.98)" }, { transform: "none" }], { duration: 260 });
      return result;
    };
  }

  updateSwitcherThumb();
})();
