// Student page extras: summary tiles, a status filter, initials avatars and a lesson
// progress line along the foot of each row. It decorates the rows renderStudentList builds; editing stays there.
(() => {
  const page = document.querySelector("#studentManagementPage");
  const toolbar = page?.querySelector(".student-sort-toolbar");
  if (!page || !toolbar || typeof renderStudentList !== "function") return;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const icon = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  let filter = "all";

  const stats = el("div", "student-stats");
  page.querySelector(".admin-page-header")?.after(stats);

  const filters = el("div", "student-filter");
  filters.setAttribute("role", "tablist");
  filters.setAttribute("aria-label", "按状态筛选学生");
  toolbar.prepend(filters);

  const threshold = () => window.CourseOperations?.lowThreshold ?? 3;
  const isLow = (student) => !student.disabled_at && getStudentRemainingCount(student) <= threshold();
  const matches = (student) => (filter === "low" ? isLow(student) : filter === "disabled" ? Boolean(student.disabled_at) : true);

  function renderStats() {
    const active = students.filter((student) => !student.disabled_at);
    const low = active.filter(isLow);
    const empty = active.filter((student) => getStudentRemainingCount(student) === 0);
    const remaining = active.reduce((sum, student) => sum + getStudentRemainingCount(student), 0);
    const tiles = [
      ["is-teal", '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M21.5 20a6.5 6.5 0 00-4-6"/>', active.length, "在读学生", `共 ${students.length} 个账号`],
      ["is-blue", '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 9h6M9 13h6M9 17h3"/>', remaining, "剩余课时合计", "在读学生还能上的次数"],
      ["is-orange", '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>', low.length, `课时 ≤ ${threshold()} 次`, empty.length ? `其中 ${empty.length} 人已用完` : "提醒家长续课"],
      ["is-gray", '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>', students.length - active.length, "已停用", "停用后不能登录"],
    ];
    stats.replaceChildren(...tiles.map(([tone, paths, value, label, sub]) => {
      const tile = el("div", "student-stat");
      const mark = el("span", `student-stat-icon ${tone}`);
      mark.innerHTML = icon(paths);
      const copy = el("div", "");
      copy.append(el("b", "", String(value)), el("strong", "", label), el("small", "", sub));
      tile.append(mark, copy);
      return tile;
    }));
  }

  function renderFilters() {
    const counts = { all: students.length, low: students.filter(isLow).length, disabled: students.filter((student) => student.disabled_at).length };
    filters.replaceChildren(...[["all", "全部"], ["low", "课时不足"], ["disabled", "已停用"]].map(([value, label]) => {
      const button = el("button", `student-filter-tab${filter === value ? " is-active" : ""}`);
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(filter === value));
      button.append(label, el("span", "", String(counts[value])));
      button.addEventListener("click", () => {
        filter = value;
        renderStudentList();
      });
      return button;
    }));
  }

  function decorateRows() {
    let shown = 0;
    document.querySelectorAll("#studentList .student-row").forEach((row) => {
      const student = students.find((item) => item.id === row.dataset.studentId);
      if (!student) return;
      const visible = matches(student);
      row.hidden = !visible;
      if (visible) shown += 1;
      row.classList.toggle("is-disabled", Boolean(student.disabled_at));
      const identity = row.querySelector(".student-identity");
      if (identity && !identity.querySelector(".student-avatar")) {
        const avatar = el("span", "student-avatar", String(student.username || "学").slice(0, 1));
        avatar.setAttribute("aria-hidden", "true");
        identity.querySelector(".student-name-link")?.before(avatar);
      }
      identity?.querySelector(".student-avatar")?.style.setProperty("--student-color", student.color || defaultCourseAccent);
      const remaining = row.querySelector(".student-remaining-count");
      if (remaining && !row.querySelector(".student-progress")) {
        const required = Number(student.required_lesson_count) || 0;
        const current = Number(student.current_lesson_count) || 0;
        const left = getStudentRemainingCount(student);
        const bar = el("span", `student-progress${left === 0 ? " is-empty" : left <= threshold() ? " is-low" : ""}`);
        bar.setAttribute("role", "img");
        bar.setAttribute("aria-label", `已上 ${current} 次，共 ${required} 次`);
        const fill = el("i", "");
        fill.style.width = `${required ? Math.min(100, (current / required) * 100) : 0}%`;
        bar.append(fill);
        row.append(bar);
      }
    });
    // Class dividers follow their students.
    document.querySelectorAll("#studentList .student-class-divider").forEach((divider) => {
      let next = divider.nextElementSibling;
      let any = false;
      while (next && !next.classList.contains("student-class-divider")) {
        if (!next.hidden) any = true;
        next = next.nextElementSibling;
      }
      divider.hidden = !any;
    });
    let empty = page.querySelector(".student-filter-empty");
    if (!empty) {
      empty = el("div", "student-filter-empty");
      empty.innerHTML = '<svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="52" cy="38" r="20" fill="none" stroke="#d1d1d6" stroke-width="6"/><path d="M67 53l16 16" stroke="#d1d1d6" stroke-width="7" stroke-linecap="round"/><path d="M44 42c4-5 12-5 16 0" fill="none" stroke="#d1d1d6" stroke-width="4" stroke-linecap="round"/></svg><p>这个筛选下没有学生</p>';
      document.querySelector("#studentList")?.after(empty);
    }
    empty.hidden = shown > 0 || !students.length;
  }

  const original = window.renderStudentList;
  window.renderStudentList = function renderStudentListWithExtras(...args) {
    const result = original.apply(this, args);
    renderStats();
    renderFilters();
    decorateRows();
    return result;
  };
})();
