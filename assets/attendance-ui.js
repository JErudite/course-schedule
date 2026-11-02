// Check-in page extras: a progress ring with the day's counts above the list, and initials
// avatars on each student row. It decorates what renderAttendance builds; saving stays there.
(() => {
  const page = document.querySelector("#attendanceManagementPage");
  const toolbar = page?.querySelector(".attendance-toolbar");
  if (!page || !toolbar || typeof renderAttendance !== "function") return;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const strip = el("div", "attendance-overview");
  toolbar.after(strip);

  function renderOverview() {
    const total = attendanceRecords.length;
    const counts = { present: 0, makeup: 0, leave: 0, pending: 0 };
    attendanceRecords.forEach((record) => { counts[record.status || "pending"] += 1; });
    const done = total - counts.pending;
    strip.hidden = attendanceLoading || total === 0;
    if (strip.hidden) return;
    const circumference = 2 * Math.PI * 26;
    const ring = el("div", "attendance-ring");
    ring.setAttribute("role", "img");
    ring.setAttribute("aria-label", `已点名 ${done} 人次，共 ${total} 人次`);
    ring.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke="#f2f2f7" stroke-width="7"/><circle cx="32" cy="32" r="26" fill="none" stroke="${counts.pending ? "#ff9500" : "#34c759"}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(circumference * done) / total} ${circumference}" transform="rotate(-90 32 32)"/></svg>`;
    ring.append(el("b", "", `${Math.round((done / total) * 100)}%`));
    const copy = el("div", "attendance-ring-copy");
    copy.append(el("strong", "", counts.pending ? `还有 ${counts.pending} 人次待点名` : "这一天都点完名了"), el("small", "", `共 ${total} 人次 · 已点 ${done}`));
    const chips = el("div", "attendance-count-chips");
    [["present", "到课"], ["makeup", "补课"], ["leave", "请假"], ["pending", "待点名"]].forEach(([key, label]) => {
      const chip = el("span", `attendance-count-chip is-${key}`);
      chip.append(el("i", ""), `${label} `, el("b", "", String(counts[key])));
      chips.append(chip);
    });
    strip.replaceChildren(ring, copy, chips);
  }

  function decorateRows() {
    document.querySelectorAll("#attendanceList .attendance-row, #attendanceHistoryList .attendance-row").forEach((row) => {
      const identity = row.querySelector(".attendance-identity");
      const indicator = identity?.querySelector(".student-color-indicator");
      if (!identity || !indicator || identity.querySelector(".attendance-avatar")) return;
      const name = identity.querySelector("strong")?.textContent || "学";
      const avatar = el("span", "attendance-avatar", name.trim().slice(0, 1));
      avatar.setAttribute("aria-hidden", "true");
      const color = indicator.style.getPropertyValue("--student-color").trim();
      avatar.style.setProperty("--student-color", color && color.toLowerCase() !== defaultCourseColor ? color : defaultCourseAccent);
      indicator.replaceWith(avatar);
    });
  }

  const original = window.renderAttendance;
  window.renderAttendance = function renderAttendanceWithExtras(...args) {
    const result = original.apply(this, args);
    renderOverview();
    decorateRows();
    return result;
  };
  // Expanded history days render their rows later.
  new MutationObserver(decorateRows).observe(document.querySelector("#attendanceHistoryList") || page, { childList: true, subtree: true });
})();
