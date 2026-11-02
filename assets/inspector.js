// Right-hand panel beside the week grid on wide screens: the lesson in focus with its
// check-in, a week overview and shortcuts. It reuses the app's own attendance functions.
(() => {
  const section = document.querySelector("#scheduleSection");
  const toolbar = section?.querySelector(".schedule-toolbar");
  if (!section || !toolbar || typeof renderSchedule !== "function") return;

  // Everything below the toolbar moves into a main column; the panel sits beside it.
  const body = document.createElement("div");
  body.className = "schedule-body";
  const main = document.createElement("div");
  main.className = "schedule-main";
  const panel = document.createElement("aside");
  panel.className = "schedule-inspector";
  panel.setAttribute("aria-label", "本节课与本周概览");
  [...section.children].filter((child) => child !== toolbar).forEach((child) => main.append(child));
  body.append(main, panel);
  section.append(body);

  const svg = (paths, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;
  const ICONS = {
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    repeat: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>',
    open: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    checks: '<path d="M3 12l4 4L17 6M13 16l2 2 6-8"/>',
    bell: '<path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 003.4 0"/>',
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const weekdayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  let focus = null; // { courseId, isoDate } chosen by clicking a lesson

  function courseColor(course) {
    const color = getEffectiveCourseColor(course);
    return color && color !== defaultCourseColor ? color : defaultCourseAccent;
  }

  // The lesson in focus: the one last opened, else the current or next one today, else the last one today.
  function focusOccurrence() {
    if (focus) {
      const course = schedule.find((item) => item.id === focus.courseId);
      if (course) return { course, isoDate: focus.isoDate };
    }
    const today = getScheduleToday();
    const isoDate = toISODate(today);
    const now = getScheduleTimeMinutes();
    const lessons = getOccurrencesForDate(today);
    const pick = lessons.find((course) => getCourseEnd(course) > now) || lessons[lessons.length - 1];
    return pick ? { course: pick, isoDate } : null;
  }

  function timing(course, isoDate) {
    const todayIso = toISODate(getScheduleToday());
    if (isoDate < todayIso) return "past";
    if (isoDate > todayIso) return "later";
    const now = getScheduleTimeMinutes();
    if (getCourseEnd(course) <= now) return "past";
    return course.startTime <= now ? "current" : "later";
  }

  function renderLesson() {
    const card = el("section", "inspector-card inspector-lesson");
    const occurrence = focusOccurrence();
    if (!occurrence) {
      card.classList.add("is-empty");
      card.innerHTML = '<svg class="inspector-empty-art" viewBox="0 0 120 80" aria-hidden="true"><rect x="22" y="14" width="76" height="56" rx="12" fill="#f2f2f7"/><path d="M22 30h76" stroke="#e5e5ea" stroke-width="3"/><circle cx="44" cy="46" r="4" fill="#d1d1d6"/><circle cx="60" cy="46" r="4" fill="#d1d1d6"/><circle cx="76" cy="46" r="4" fill="#ffb340"/><path d="M38 8v12M82 8v12" stroke="#d1d1d6" stroke-width="4" stroke-linecap="round"/></svg>';
      card.append(el("strong", "", "今天没有课"), el("p", "", "点课表里的任意一节课，这里会显示它的点名。"));
      return card;
    }
    const { course, isoDate } = occurrence;
    const date = parseISODate(isoDate);
    const color = courseColor(course);
    const state = timing(course, isoDate);
    card.style.setProperty("--lesson-color", color);

    const head = el("div", "inspector-lesson-head");
    const glyph = el("span", "inspector-glyph", String(course.name || "课").trim().slice(0, 2));
    const titleBox = el("div", "inspector-lesson-title");
    const badge = el("span", `inspector-badge is-${state}`, state === "current" ? "上课中" : state === "past" ? "已结束" : "未开始");
    titleBox.append(badge, el("h3", "", course.name));
    head.append(glyph, titleBox);

    const loaded = !canEdit || scheduleAttendanceLoaded.has(isoDate);
    const roster = canEdit && loaded ? getOccurrenceRoster(course, isoDate) : [];
    if (canEdit) {
      const done = roster.filter((entry) => entry.status).length;
      const total = Math.max(roster.length, 1);
      const ring = el("span", "inspector-ring");
      ring.setAttribute("role", "img");
      ring.setAttribute("aria-label", `已点名 ${done} 人，共 ${roster.length} 人`);
      const circumference = 2 * Math.PI * 22;
      ring.innerHTML = `<svg viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="22" fill="none" stroke="#f2f2f7" stroke-width="6"/><circle cx="27" cy="27" r="22" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(circumference * done) / total} ${circumference}" transform="rotate(-90 27 27)"/></svg><b>${done}/${roster.length}</b>`;
      head.append(ring);
    }

    const meta = el("div", "inspector-meta");
    const when = el("span", "");
    when.innerHTML = svg(ICONS.clock);
    when.append(`${date.getMonth() + 1}月${date.getDate()}日 ${weekdayNames[date.getDay()]} · ${formatTime(course.startTime)}–${formatTime(getCourseEnd(course))}`);
    const repeat = el("span", "");
    repeat.innerHTML = svg(ICONS.repeat);
    repeat.append(course.repeatIntervalDays === null ? "单次课程" : "重复课程");
    meta.append(when, repeat);
    card.append(head, meta);

    if (canEdit) {
      const list = el("div", "inspector-roster");
      if (!loaded) {
        list.append(el("p", "inspector-note", "正在读取这节课的点名…"));
        void loadScheduleAttendance({ range: [date, date] });
      } else if (!roster.length) {
        list.append(el("p", "inspector-note", "这节课还没有分配学生"));
      }
      const lowThreshold = window.CourseOperations?.lowThreshold ?? 3;
      roster.forEach((entry) => {
        const row = el("div", "inspector-row");
        const avatar = el("span", "inspector-avatar", entry.name.slice(0, 1));
        avatar.style.setProperty("--student-color", entry.student?.color || color);
        const who = el("div", "inspector-who");
        who.append(el("strong", "", entry.name));
        if (entry.student) {
          const remaining = getStudentRemainingCount(entry.student);
          who.append(el("small", remaining === 0 ? "is-empty" : remaining <= lowThreshold ? "is-low" : "", `剩 ${remaining} 次课`));
        }
        const choices = el("div", "inspector-choices");
        choices.setAttribute("role", "group");
        choices.setAttribute("aria-label", `${entry.name} 的状态`);
        attendanceStatusOptions.forEach(({ value, label, className }) => {
          const button = el("button", `inspector-choice ${className}${entry.status === value ? " is-selected" : ""}`, label);
          button.type = "button";
          button.disabled = scheduleAttendanceBusy;
          button.setAttribute("aria-pressed", String(entry.status === value));
          button.addEventListener("click", () => (entry.status === value
            ? clearOccurrenceAttendance(course, isoDate, entry.studentId)
            : setOccurrenceAttendance(course, isoDate, entry.studentId, value)));
          choices.append(button);
        });
        row.append(avatar, who, choices);
        list.append(row);
      });
      card.append(list);
    }

    const actions = el("div", "inspector-actions");
    const open = el("button", "inspector-icon-button");
    open.type = "button";
    open.title = "课程详情与编辑";
    open.setAttribute("aria-label", "课程详情与编辑");
    open.innerHTML = svg(ICONS.open);
    open.addEventListener("click", () => showCourse(course.id, isoDate));
    actions.append(open);
    if (canEdit) {
      const all = el("button", "primary-button inspector-all");
      all.type = "button";
      all.innerHTML = svg(ICONS.check, ' class="inspector-all-icon"');
      all.append("全部到课");
      all.disabled = scheduleAttendanceBusy || !roster.some((entry) => !entry.status);
      all.addEventListener("click", () => markOccurrenceAllPresent({ course, isoDate }));
      actions.append(all);
    }
    card.append(actions);
    return card;
  }

  function renderWeek() {
    const card = el("section", "inspector-card inspector-week");
    const start = typeof selectedWeekStart !== "undefined" ? selectedWeekStart : getScheduleToday();
    const todayIso = toISODate(getScheduleToday());
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(start, index);
      const hours = getOccurrencesForDate(date).reduce((total, course) => total + course.duration / 60, 0);
      return { date, hours, isToday: toISODate(date) === todayIso };
    });
    const total = days.reduce((sum, day) => sum + day.hours, 0);
    const most = Math.max(...days.map((day) => day.hours), 1);
    const head = el("div", "inspector-week-head");
    head.append(el("strong", "", "本周概览"), el("b", "", Number.isInteger(total) ? String(total) : total.toFixed(1)), el("small", "", "小时"));
    const bars = el("div", "inspector-bars");
    days.forEach((day) => {
      const column = el("div", `inspector-bar${day.isToday ? " is-today" : ""}`);
      column.title = `${weekdayNames[day.date.getDay()]} ${day.hours ? `${Number.isInteger(day.hours) ? day.hours : day.hours.toFixed(1)} 小时` : "没有课"}`;
      const fill = el("i", "");
      fill.style.height = `${Math.max(4, (day.hours / most) * 64)}px`;
      column.append(fill, el("span", "", weekdayNames[day.date.getDay()].slice(1)));
      bars.append(column);
    });
    card.append(head, bars);
    return card;
  }

  function renderShortcuts() {
    const box = el("section", "inspector-shortcuts");
    box.setAttribute("aria-label", "快捷操作");
    const pending = todayAttendanceSummary?.date === toISODate(getScheduleToday()) && !todayAttendanceSummary.failed ? todayAttendanceSummary.pending : 0;
    const threshold = window.CourseOperations?.lowThreshold ?? 3;
    const low = students.filter((student) => !student.disabled_at && getStudentRemainingCount(student) <= threshold).length;
    [
      ["is-green", ICONS.checks, "今天点名", pending ? `还有 ${pending} 人次待点名` : "今天都点完了", () => showAttendanceManagement()],
      ["is-orange", ICONS.bell, "续课提醒", low ? `${low} 人课时 ≤ ${threshold}` : "暂时没有人需要续课", () => showStudentManagement()],
    ].forEach(([tone, icon, title, sub, run]) => {
      const button = el("button", "inspector-shortcut");
      button.type = "button";
      const tile = el("span", `inspector-shortcut-icon ${tone}`);
      tile.innerHTML = svg(icon);
      button.append(tile, el("strong", "", title), el("small", "", sub));
      button.addEventListener("click", run);
      box.append(button);
    });
    return box;
  }

  function render() {
    if (!currentUser) { panel.replaceChildren(); return; }
    const parts = [renderLesson(), renderWeek()];
    if (canEdit) parts.push(renderShortcuts());
    panel.replaceChildren(...parts);
  }

  const originalRender = window.renderSchedule;
  window.renderSchedule = function renderScheduleWithInspector(...args) {
    const result = originalRender.apply(this, args);
    render();
    return result;
  };

  window.ScheduleInspector = {
    render,
    select(courseId, isoDate) {
      focus = { courseId, isoDate: isoDate || schedule.find((item) => item.id === courseId)?.startDate };
      render();
    },
  };
  render();
})();
